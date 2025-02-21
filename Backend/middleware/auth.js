import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';
import Teacher from '../models/teacher.model.js';
import Student from '../models/student.model.js';

export const auth = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) throw new Error('Authentication required');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      let user;
      if (roles.includes('admin')) {
        user = await Admin.findById(decoded.id);
      }
      if (roles.includes('teacher')) {
        user = await Teacher.findById(decoded.id);
      }
      if (roles.includes('student')) {
        user = await Student.findById(decoded.id);
      }

      if (!user) throw new Error('User not found');
      req.user = user;
      req.token = token;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Please authenticate' });
    }
  };
};