// routes/announcement.routes.js
import express from 'express';
import Announcement from '../models/announcement.model.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create announcement (Admin only)
router.post('/', auth(['admin']), async (req, res) => {
  try {
    const announcement = new Announcement(req.body);
    await announcement.save();
    res.status(201).send(announcement);
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
