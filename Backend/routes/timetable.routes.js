import express from 'express';
import Timetable from '../models/timetable.model.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth(['admin']), async (req, res) => {
  try {
    const timetableEntry = new Timetable({
      subject: req.body.subject,
      lecturer: req.body.lecturer,
      lecturerEmail: req.body.lecturerEmail,
      office: req.body.office,
      room: req.body.room,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      course: req.body.course,
      collegeName: req.body.collegeName
    });

    await timetableEntry.save();
    res.status(201).send(timetableEntry);
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;