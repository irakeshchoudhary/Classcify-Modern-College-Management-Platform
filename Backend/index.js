import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import adminRoutes from './routes/admin.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import { otpRateLimiter } from './middleware/rateLimiter.js';
import studentRoutes from './routes/student.routes.js'
import connectDB from './config/db.js';
import postRoutes from './routes/post.routes.js';
import announcementRoutes from './routes/announcement.routes.js';
import assignmentRoutes from './routes/assignment.routes.js';
import timetableRoutes from './routes/timetable.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';

dotenv.config();
connectDB();
const app = express();

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiter Middleware for OTP routes
app.use('/api/teachers/send-otp', otpRateLimiter);


// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/attendance', attendanceRoutes);

// Health Check
app.get('/', (req, res) => res.json({
  status: 'OK',
  message: 'Classcify Backend API'
}));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});