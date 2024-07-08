import { Configuration, OpenAIApi } from 'openai';
export async function getProfileInfo(texts_ary) {
  // OpenAI recommends replacing newlines with spaces for best results
  const questions = [
    '1. who did this document issue for? or what is the name of owner of this documnet? ',
    '2. what is the Registration number - No d’immatriculation of pilot? If you can not get it from provided documents, do NOT generate answer. Jjust reply empty sting like this :  ""',
    '3. what is the Certificate Number? ',
    '4. what is the coordinates?',
  ];

  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const chatCompletion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-0613',
      messages: [
        {
          role: 'user',
          content: `I will provide you RCPC ( Remote Control Pilots Canada ) Ceritication documents  and will aks question about that document.
	        And also I will ask question about it.
		Questions are array.  
		Out put must be array of string ( answer ) like this format : 
		["Answer 1", "Answer 2", "Answer 3", "Answer 4"]
		If you can not find correct answer from document, then just reply empty string like this : ""

//		There are two types of documents and I can provide one of them or all of them to you.
//		If I provide "Pilot Certificate" document, you MUST answer first and third and fourth qusetion. For second question, just reply empty string like this : ""
//		If I provide "Certificate of Registration" document, you MUST answer first and second  and fourth question. For third question, just reply empty string like this : "",
//		If I provide "Pilot Certificate" document and "Certificate of Registeration" document all, then you MUST answer all of four questions. Not reply with empty string.
	  -----------------------------
          Here are document contents: 
          ${texts_ary}
          Here are  user's questions : 
          ${questions}
          Here is your answer :`,
        },
      ],
    });
    return JSON.parse(chatCompletion.data.choices[0].message.content);
  } catch (error) {
    console.log('Error while getting profile : ', error);
    return false;
  }
}
