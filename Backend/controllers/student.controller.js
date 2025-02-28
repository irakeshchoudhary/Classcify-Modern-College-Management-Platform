import Student from '../models/student.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Timetable from '../models/timetable.model.js';
import Assignment from '../models/assignment.model.js';
import Announcement from '../models/announcement.model.js';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const signup = async (req, res) => {
    try {
        const { personal, academic, other } = req.body;
        const existingStudent = await Student.findOne({ 'personal.email': personal.email });

        if (existingStudent) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(req.body.auth.password, 10);
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const student = new Student({
            personal,
            academic,
            other: {
                interests: other.interests,
                personalityType: other.personalityType,
                genz: other.genz || false
            },
            auth: {
                password: hashedPassword,
                otp,
                otpExpires
            }
        });

        await student.save();

        // In production, send OTP via email here
        console.log(`OTP for ${personal.email}: ${otp}`);

        res.status(201).json({
            message: 'Student registered. Check email for OTP.',
            studentId: student._id
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const verify = async (req, res) => {
    try {
        const studentId = req.params.id;
        const { otp } = req.body;
        const student = await Student.findById(studentId).select('+auth.otp +auth.otpExpires');

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        if (student.auth.otp !== otp || student.auth.otpExpires < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        student.auth.isVerified = true;
        student.auth.otp = undefined;
        student.auth.otpExpires = undefined;
        const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        await student.save(); // ✅ Save before sending response

        return res.json({ message: 'Email verified successfully', token }); // ✅ Only ONE response
    } catch (error) {
        return res.status(400).json({ error: error.message }); // ✅ Use return to prevent duplicate responses
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const student = await Student.findOne({ 'personal.email': email })
            .select('+auth.password +auth.isVerified');

        if (!student || !(await bcrypt.compare(password, student.auth.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!student.auth.isVerified) {
            return res.status(401).json({ error: 'Email not verified' });
        }

        const token = jwt.sign(
            { id: student._id, role: 'student' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id).select("-auth.password");
        if (!student) return res.status(404).json({ error: "Student not found" });
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};


export const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().select('-auth.password -auth.otp');
        console.log("Fetched Students:", students); // Debug log
        res.json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: 'Server error' });
    }
};


export const searchUsers = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ error: 'Search query required' });

        const users = await Student.find({
            $or: [
                { 'personal.firstName': { $regex: query, $options: 'i' } },
                { 'personal.lastName': { $regex: query, $options: 'i' } },
                { 'academic.course': { $regex: query, $options: 'i' } },
                { 'academic.collegeName': { $regex: query, $options: 'i' } }
            ]
        })
            .select('-password -otp -verified')
            .limit(50)
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getTimetable = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const timetable = await Timetable.find({
      collegeName: student.academic.collegeName,
      course: student.academic.course
    }).sort({ startTime: 1 });

    res.json(timetable);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getAssignments = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const assignments = await Assignment.find({
      collegeName: student.academic.collegeName,
      course: student.academic.course,
      dueDate: { $gte: new Date() }
    }).sort({ dueDate: 1 });

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getAnnouncements = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const announcements = await Announcement.find({
      collegeName: student.academic.collegeName,
      $or: [
        { course: student.academic.course },
        { course: { $exists: false } },
        { course: null }
      ]
    }).sort({ date: -1 });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};