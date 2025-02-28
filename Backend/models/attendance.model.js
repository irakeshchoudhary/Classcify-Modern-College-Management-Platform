// models/attendance.model.js
import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  course: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    default: 'absent'
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  collegeName: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Attendance', attendanceSchema);