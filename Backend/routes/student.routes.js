import express from 'express';
import { signup, verify, login, getProfile, getAllStudents, searchUsers, getTimetable, getAssignments, getAnnouncements } from '../controllers/student.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/verify/:id', verify);
router.post('/login', login);
router.get('/profile', auth(['student']), getProfile);
router.get('/', getAllStudents);
router.get('/search', auth(['student']), searchUsers);
router.get('/timetable', auth(['student']), getTimetable);
router.get('/assignments', auth(['student']), getAssignments);
router.get('/announcements', auth(['student']), getAnnouncements);


export default router;