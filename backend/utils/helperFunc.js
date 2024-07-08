import crypto from 'crypto';
import fs from 'fs';
import textact from 'textract';
import { scrapeDatas } from './scrapData';

export const generateHex = () => {
  const hash = crypto.createHash('sha256').update(crypto.randomBytes(32)).digest('hex');
  return hash;
};

export const createPathIfNotExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  } else {
    console.log(`Directory already exists: ${dir}`);
  }
};

export async function getText(filepath) {
  return new Promise((resolve, reject) => {
    textact.fromFileWithPath(filepath, (err, txt) => {
      resolve(txt);
    });
  });
}

export const getTextFromURL = async (url) => {
  return await scrapeDatas(url);
};
