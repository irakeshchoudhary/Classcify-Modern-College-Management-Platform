// models/announcement.model.js
import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  course: { type: String },
  collegeName: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Announcement', announcementSchema);