import express from 'express';
import { signup, verify, login, getProfile, getAllStudents } from '../controllers/student.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/verify/:id', verify);
router.post('/login', login);
router.get('/profile', auth(['student']), getProfile);
router.get('/', getAllStudents);

export default router;