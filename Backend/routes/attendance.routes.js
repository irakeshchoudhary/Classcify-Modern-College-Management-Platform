// routes/attendance.routes.js
import express from 'express';
import {
  getAttendance,
  updateAttendance,
  getStudentAttendance
} from '../controllers/attendance.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Teacher routes
router.get('/teacher', auth(['teacher']), getAttendance);
router.post('/teacher', auth(['teacher']), updateAttendance);

// Student route
router.get('/student', auth(['student']), getStudentAttendance);

export default router;