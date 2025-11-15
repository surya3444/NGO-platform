import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect, isNgo } from '../middleware/authMiddleware.js';
import {
  createPost,
  getAllPosts,
  getMyNgoPosts,
  getPostById,
  createComment, 
  deletePost,
} from '../controllers/postController.js';

const router = express.Router();

// Multer Configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});
// End Multer Configuration

router
  .route('/')
  .post(protect, isNgo, upload.single('image'), createPost)
  .get(protect, getAllPosts);

router.route('/myposts').get(protect, isNgo, getMyNgoPosts);

router
  .route('/:id')
  .get(protect, getPostById)
  .delete(protect, isNgo, deletePost);
  
router.route('/:id/comments').post(protect, createComment);

export default router;