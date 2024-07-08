import multer from 'multer';
import path from 'path';
import fs from 'fs';

const dir = './uploads';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const allowed = ['.pdf', '.docx'];
    if (allowed.includes(ext)) {
      cb(null, Date.now() + '-' + file.originalname);
    } else {
      cb(new Error('Only docx and pdf files allowed'));
    }
  },
});
