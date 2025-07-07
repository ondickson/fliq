// utils/upload.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storagePath = path.join(__dirname, '../uploads/profile_pictures');
fs.mkdirSync(storagePath, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, storagePath),
  filename: (_, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const fileFilter = (_, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowed = ['.jpg', '.jpeg', '.png'];
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only jpg, jpeg, png files are allowed'));
};

const upload = multer({ storage, fileFilter });

export default upload;
