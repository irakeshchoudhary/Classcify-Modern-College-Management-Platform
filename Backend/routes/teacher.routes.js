import express from 'express';
import {
  saveDraft,
  sendOTPController,
  verifyOTP,
  getDraft,
  getTeachers,
  deleteTeacher,
  updateTeacher,
  teacherLogin,
  getTeacherCourses
} from '../controllers/teacher.controller.js';
import { sendInvitationEmail } from '../controllers/sendInvitation.controller.js';

const router = express.Router();

router.post('/draft', saveDraft);
router.post('/send-otp', sendOTPController);
router.post('/verify', verifyOTP);
router.get('/draft/:draftId', getDraft);
router.get('/', getTeachers);
router.delete('/:id', deleteTeacher);
router.put('/:id', updateTeacher);
router.post('/send-invitation', sendInvitationEmail);
router.post('/login', teacherLogin);
router.get('/courses', getTeacherCourses);



export default router;
