import multer from 'multer';
import path from 'path';
import fs from 'fs';

// pastikan folder uploads ada
const uploadDir = 'uploads';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('File harus berupa gambar'), false);
};

const upload = multer({
  storage,
  limits: { fileSize: 512000 }, // max 500 KB
  fileFilter,
});


export default upload;