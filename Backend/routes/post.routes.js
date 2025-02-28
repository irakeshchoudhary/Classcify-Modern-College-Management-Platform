import express from 'express';
import auth from '../middleware/auth.js';
import fileUpload from '../middleware/fileUpload.js';
import { addComment, createPost, deleteComment, getExplorePosts, getPosts, likePost, searchPosts, updateComment } from '../controllers/post.controller.js';
import multer from "multer";


const router = express.Router();
const storage = multer.memoryStorage(); // Memory storage for Cloudinary
const upload = multer({ storage: multer.memoryStorage() });



router.post('/', auth(['student']), fileUpload.single('media'), createPost);
router.get('/', auth(['student']), getPosts);
router.post('/:id/like', auth(['student']), likePost);
router.post('/:id/comments', auth(['student']), addComment);
router.put('/:postId/comments/:commentId', auth(['student']), updateComment);
router.delete('/:postId/comments/:commentId', auth(['student']), deleteComment);
router.get('/search', auth(['student']), searchPosts);
router.get('/explore', auth(['student']), getExplorePosts);

export default router;