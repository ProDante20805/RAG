import path from 'path';
import dotenv from 'dotenv';
import { PineconeClient } from '@pinecone-database/pinecone';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '../config/pinecone';
import { encode } from 'gpt-tokenizer';
import { getText, getTextFromURL } from './helperFunc';
import { loadQAChain } from 'langchain/chains';
import { OpenAIChat } from 'langchain/llms/openai';
import { CallbackManager } from 'langchain/callbacks';
import { PromptTemplate } from 'langchain/prompts';
import { z } from 'zod';
import { StructuredOutputParser, OutputFixingParser } from 'langchain/output_parsers';

dotenv.config({ path: path.join(__dirname, '../.env') });

if (!process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_API_KEY) {
  throw new Error('Pinecone environment or api key vars missing');
}

export const initPinecone = async () => {
  try {
    const pinecone = new PineconeClient();

    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT ?? '', //this is in the dashboard
      apiKey: process.env.PINECONE_API_KEY ?? '',
    });

    console.log('Pinecone database connected successfully');

    return pinecone;
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to initialize Pinecone Client');
  }
};

export const run = async (filePath, url = null) => {
  try {
    const pinecone = await initPinecone();
    const contents = url === null ? await getText(filePath) : await getTextFromURL(url);
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 3000,
      chunkOverlap: 500,
    });

    const docs = await textSplitter.splitText(contents);

    let token_count = 0;
    docs.map((doc, idx) => {
      token_count += encode(doc).length;
    });

    const metadatas = docs.map(() => {
      return { source: url === null ? path.basename(filePath, path.extname(filePath)) : url };
    });

    console.log('creating vector store...');
    /*create and store the embeddings in the vectorStore*/
    const embeddings = new OpenAIEmbeddings();
    const index = pinecone.Index(PINECONE_INDEX_NAME); //change to your own index name

    //embed the PDF documents
    const result = await PineconeStore.fromTexts(docs, metadatas, embeddings, {
      pineconeIndex: index,
      namespace: PINECONE_NAME_SPACE,
      textKey: 'text',
    });
    console.log('Ingest completed --------');
    return result;
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
};

/**
 * @function_name removePineconeData
 * @flag 1: del by all , id: del by id
 * @return none
 * @description delete pinecone database
 */

export const removePineconeData = async (del_flag) => {
  try {
    const pinecone = await initPinecone();
    const index = pinecone.Index(PINECONE_INDEX_NAME); //change to your own index name
    await index.delete1({
      deleteAll: true,
      namespace: PINECONE_NAME_SPACE,
    });
    console.log('Pinecone data deleted --------');
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to delete pinecone data');
  }
};

const isJSON = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const getMainCourses = async ({ question }) => {
  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

  try {
    const pinecone = await initPinecone();
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    /* Create vectorstore*/
    const vectorStore = await PineconeStore.fromExistingIndex(new OpenAIEmbeddings({}), {
      pineconeIndex: index,
      textKey: 'text',
      namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
    });

    // Get suitable docs
    let suitableDocs = await vectorStore.similaritySearch(sanitizedQuestion);
    console.log('suitableDocs is : ', suitableDocs);

    const chat_model = new OpenAIChat({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0,
      modelName: 'gpt-3.5-turbo',
      verbose: true,
      streaming: true,
      callbackManager: CallbackManager.fromHandlers({
        async handleLLMNewToken(token) {
          console.log(token);
        },
      }),
    });

    const outputParser = StructuredOutputParser.fromZodSchema(
      z
        .array(
          z.object({
            title: z.string().describe('The title of study course'),
            description: z.string().describe('The description of study course'),
          })
        )
        .length(5)
    );
    const outputFixingParser = OutputFixingParser.fromLLM(chat_model, outputParser);

    const prompt = new PromptTemplate({
      template: `Act as assistant chatbot 
      Your name is "RCPC AI Chatbot".
      Some data that you can reference will be provided for this. \n Data:{context}\n
      User ask to you random questions. and you have to analysis this and make study course of five each type with data provided. \n Question: {question}\n
      List five study courses.     
      Output schema like this \n{format_instructions}\n `,
      inputVariables: ['context', 'question'],
      partialVariables: {
        format_instructions: outputFixingParser.getFormatInstructions(),
      },
    });

    // Create QA Chain
    const chain = loadQAChain(chat_model, {
      type: 'stuff',
      prompt,
      outputParser: outputFixingParser,
    });

    const res = await chain.call({
      input_documents: suitableDocs,
      question: sanitizedQuestion,
    });

    let result;
    if (isJSON(res.text)) {
      result = JSON.stringify(JSON.parse(res.text).items);
      console.log('JSON------------');
    } else {
      result = res.text;
      console.log('not JSON------------');
    }

    const parsed_data = await outputFixingParser.parse(result);
    console.log('parsed_text---------------------', parsed_data);
    const response = {
      text: parsed_data,
      sourceDocuments: suitableDocs,
    };

    return response;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

export const getSubTitles = async ({ main_question, sub_question, title }) => {
  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = sub_question.trim().replaceAll('\n', ' ');

  const prompt = PromptTemplate.fromTemplate(`
  Act as assistant chatbot 
  Your name is "RCPC AI Chatbot".
  Some contents that you can reference will be provided for this.
  You have already made five study course on user's question (${main_question}) before and  the title lists of the study course that you already made are ${title}.
  User provide you a title of random study course. and you have to analysis it and make sub title array(JS array) on five each type with data provided. 
  If title array is not JS array, convert it as JS string array.
  When you make title array, you must never include any title(${title}).
  If there is no a suitable data in provided data, you can use general data.
  Say as only JS string array like this.
      For example : ["title one","title two","title three",title four","title five"]
  There is no need any description in answers.
      
      Context : 
      {context}
      Question: 
      {question}
  `);

  try {
    const pinecone = await initPinecone();
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    /* Create vectorstore*/
    const vectorStore = await PineconeStore.fromExistingIndex(new OpenAIEmbeddings({}), {
      pineconeIndex: index,
      textKey: 'text',
      namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
    });

    // Get suitable docs
    let suitableDocs = await vectorStore.similaritySearch(sanitizedQuestion);
    console.log('suitableDocs is : ', suitableDocs);

    const chat_model = new OpenAIChat({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.6,
      modelName: 'gpt-3.5-turbo',
      verbose: true,
      streaming: true,
      callbackManager: CallbackManager.fromHandlers({
        async handleLLMNewToken(token) {
          console.log(token);
        },
      }),
    });

    // Create QA Chain
    const chain = loadQAChain(chat_model, {
      type: 'stuff',
      prompt: prompt,
    });

    const res = await chain.call({
      input_documents: suitableDocs,
      question: sanitizedQuestion,
    });

    const response = {
      text: res.text,
      sourceDocuments: suitableDocs,
    };

    return response;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

export const socketChat = async ({ sub_question, main_question }, socketCallback, socketEndCallback) => {
  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = sub_question.trim().replaceAll('\n', ' ');

  const prompt = PromptTemplate.fromTemplate(`
    Act as a helper of technical exam for human, especially pilots. Your name is "RCPC AI Chatbot". 
    It will be provided content realted with exam.
    You had already made a title of study course on user's basic question The users' basic question is ${main_question}.
    User will ask you a sub title of the study course as question. 
    
    You have to analysis it and say to user closely with detail information based on user's basic question.
    If you don't find a suitable answer, say with reference in general data.
    The generated sentences should be formatted with markdown and especially all links must be display correctly as markdown. For example: [Link Text](URL).
    Context : 
    {context}
    Question: 
    {question}
  `);

  try {
    const pinecone = await initPinecone();
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    /* Create vectorstore*/
    const vectorStore = await PineconeStore.fromExistingIndex(new OpenAIEmbeddings({}), {
      pineconeIndex: index,
      textKey: 'text',
      namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
    });

    // Get suitable docs
    let suitableDocs = await vectorStore.similaritySearch(sanitizedQuestion);
    console.log('suitableDocs is : ', suitableDocs);

    // Create QA Chain
    const chain = loadQAChain(
      new OpenAIChat({
        openAIApiKey: process.env.OPENAI_API_KEY,
        temperature: 0.6,
        modelName: 'gpt-4',
        verbose: true,
        streaming: true,
        callbackManager: CallbackManager.fromHandlers({
          async handleLLMNewToken(token) {
            socketCallback(token);
            console.log(token);
          },
        }),
      }),
      {
        type: 'stuff',
        prompt: prompt,
      }
    );

    const res = await chain.call({
      input_documents: suitableDocs,
      question: sanitizedQuestion,
    });

    const response = {
      text: res.text,
      sourceDocuments: suitableDocs,
    };
    socketEndCallback(response);
    return;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};
