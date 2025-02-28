// routes/assignment.routes.js
import express from 'express';
import Assignment from '../models/assignment.model.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create assignment (Admin only)
router.post('/', auth(['admin']), async (req, res) => {
  try {
    const newAssignment = new Assignment(req.body); // Changed variable name
    await newAssignment.save();
    res.status(201).send(newAssignment);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/', auth(['student', 'admin']), async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.send(announcements);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;

// Repeat similar files for assignments.routes.js and timetable.routes.js