// controllers/attendance.controller.js
import Attendance from '../models/attendance.model.js';
import Student from '../models/student.model.js';
import Teacher from '../models/teacher.model.js';

export const getAttendance = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user._id);
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    const { date = new Date(), course, subject } = req.query;
    
    const query = {
      date: {
        $gte: new Date(date).setHours(0,0,0,0),
        $lt: new Date(date).setHours(23,59,59,999)
      },
      collegeName: teacher.professional.collegeName,
      ...(course && { course }),
      ...(subject && { subject })
    };

    const attendance = await Attendance.find(query)
      .populate('student', 'personal firstName lastName academic.course');

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const { date, course, subject, attendanceData } = req.body;
    
    const bulkOps = attendanceData.map(record => ({
      updateOne: {
        filter: {
          student: record.studentId,
          date: new Date(date),
          course,
          subject
        },
        update: {
          $set: {
            status: record.status,
            markedBy: req.user._id,
            collegeName: req.user.professional.collegeName
          }
        },
        upsert: true
      }
    }));

    await Attendance.bulkWrite(bulkOps);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudentAttendance = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    const attendance = await Attendance.find({
      student: req.user._id,
      collegeName: student.academic.collegeName
    }).sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};