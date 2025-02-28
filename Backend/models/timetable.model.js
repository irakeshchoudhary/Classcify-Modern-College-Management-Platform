// models/timetable.model.js
import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  lecturer: { type: String, required: true },
  lecturerEmail: { type: String, required: true },
  office: { type: String, required: true },
  room: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  course: { type: String, required: true },
  collegeName: { type: String, required: true },
  dayOfWeek: { type: String }
}, { timestamps: true });

export default mongoose.model('Timetable', timetableSchema);