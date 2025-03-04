import Teacher from '../models/teacher.model.js'
import { sendOTP } from '../utils/smsService.js'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const saveDraft = async (req, res) => {
  try {
    let { draftId } = req.body;
    const { data } = req.body;

    // Generate new draft ID if not exists
    if (!draftId) {
      draftId = uuidv4();
    }

    // Merge all data fields
    const updateData = {
      ...data,
      draftId,
      updatedAt: new Date(),
      status: 'draft'
    };

    const teacher = await Teacher.findOneAndUpdate(
      { draftId },
      { $set: updateData },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      draftId: teacher.draftId
    });

  } catch (err) {
    console.error('🔥 Save Draft Error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

export const sendOTPController = async (req, res) => {
  try {
    const { draftId, phone } = req.body // Get draftId from request
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    const success = await sendOTP(phone, otp)
    if (!success) return res.status(500).json({ error: 'Failed to send OTP' })

    // Update using draftId instead of phone number
    await Teacher.findOneAndUpdate(
      { draftId },
      {
        otp,
        otpExpiry: Date.now() + 600000,
        'professional.phone': phone // Save phone number in draft
      }
    )

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const verifyOTP = async (req, res) => {
  try {
    const { draftId, otp } = req.body

    const teacher = await Teacher.findOne({ draftId })
    if (!teacher) return res.status(404).json({ error: 'Draft not found' })

    if (teacher.otp !== otp || teacher.otpExpiry < Date.now()) {
      return res.status(400).json({ error: 'Invalid/Expired OTP' })
    }

    // Generate UID
    const uid = `${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}@classcify.in`;

    const updated = await Teacher.findByIdAndUpdate(teacher._id, {
      status: 'verified',
      'professional.uid': uid,
      otp: null,
      otpExpiry: null
    }, { new: true })

    res.json({ teacher: updated })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getDraft = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ draftId: req.params.draftId });
    if (!teacher) return res.status(404).json({ error: 'Draft not found' });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ status: 'verified' });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    await Teacher.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const teacher = await Teacher.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const teacherLogin = async (req, res) => {
  try {
    const { uid, password } = req.body;

    // Find teacher by UID
    const teacher = await Teacher.findOne({ 'professional.uid': uid });
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // Check if teacher is verified
    if (teacher.status !== 'verified') {
      return res.status(403).json({ error: 'Teacher not verified' });
    }

    // Handle first-time password setup
    if (!teacher.auth.password) {
      if (!password) {
        return res.status(400).json({ error: 'Password required for first login' });
      }

      // Hash and save password
      const hashedPassword = await bcrypt.hash(password, 10);
      teacher.auth.password = hashedPassword;
      teacher.auth.lastLogin = new Date();
      await teacher.save();

      // Generate token
      const token = jwt.sign(
        { id: teacher._id, role: 'teacher' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({ token });
    }

    // Regular login
    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, teacher.auth.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    teacher.auth.lastLogin = new Date();
    await teacher.save();

    // Generate token
    const token = jwt.sign(
      { id: teacher._id, role: 'teacher' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTeacherCourses = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user._id);

    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    // Extracting classrooms (which contain course names)
    const courses = teacher.professional.classrooms || [];

    res.json({ courses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

