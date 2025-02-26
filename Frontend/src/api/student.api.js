// api/student.api.js
import api from './axios';

const studentApi = {
  signup: (data) =>
    api
      .post('/api/students/signup', data)
      .catch((error) => {
        if (error.response) {
          if (error.response.data?.error?.name === 'ValidationError') {
            const messages = Object.values(error.response.data.error.errors).map(
              (e) => e.message
            );
            error.response.data.error = messages.join(', ');
          }
        }
        throw error;
      }),

  login: (data) =>
    api.post('/api/students/login', data).catch((error) => {
      console.log(`getting data from api: ${JSON.stringify(data)}`);
      throw error;
    }),

  verify: (studentId, otp) =>
    api.post(`/api/students/verify/${studentId}`, { otp }).catch((error) => {
      throw error;
    }),

  getProfile: () =>
    api.get('/api/students/profile').catch((error) => {
      throw error;
    }),

  getAllStudents: () =>
    api.get('/api/students').catch((error) => {
      throw error;
    }),

};

export default studentApi;
