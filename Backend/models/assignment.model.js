// models/assignment.model.js
import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  subject: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'completed'], 
    default: 'pending' 
  },
  course: { type: String, required: true },
  collegeName: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Assignment', assignmentSchema);