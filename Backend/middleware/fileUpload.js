import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'classcify/posts',
    allowed_formats: ['jpg', 'jpeg', 'png', 'mp4', 'mov'],
    resource_type: 'auto',
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    console.log("🟢 File received by Multer:", file);
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});


export default upload;