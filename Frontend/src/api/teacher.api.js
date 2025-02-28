import api from './axios';

const teacherApi = {
  getTeacherAttendance: (params) =>
    api.get('/api/attendance/teacher', { params }).catch(error => {
      throw error.response?.data?.error || 'Failed to fetch attendance';
    }),

  updateAttendance: (data) =>
    api.post('/api/attendance/teacher', data).catch(error => {
      throw error.response?.data?.error || 'Failed to update attendance';
    }),
}

export default teacherApi;