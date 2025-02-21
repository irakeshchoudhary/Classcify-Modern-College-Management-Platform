import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';

const router = express.Router();

// ✅ DEBUG: Add logs to check if the API is working
router.post("/init", async (req, res) => {
  console.log("✅ [DEBUG] /api/admin/init route hit!");

  try {
    const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (adminExists) {
      return res.status(400).json({ msg: "Admin already exists" });
    }

    const admin = new Admin({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_INITIAL_PASSWORD,
      name: "Super Admin",
    });

    await admin.save();
    res.status(201).json({ msg: "Admin created successfully" });
  } catch (err) {
    console.error("🔥 [ERROR] in /init:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Admin Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(400).json({ msg: 'Invalid admin credentials' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ msg: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
    res.json({ 
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;