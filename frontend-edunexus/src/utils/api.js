import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const courseAPI = {
  getAll: () => api.get('/courses'),
  getOne: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  enroll: (id) => api.post(`/courses/${id}/enroll`),
  getInstructor: () => api.get('/courses/instructor'),
  getEnrolled: () => api.get('/courses/enrolled')
};

export const lectureAPI = {
  getByCourse: (courseId) => api.get(`/lectures/course/${courseId}`),
  getOne: (id) => api.get(`/lectures/${id}`),
  create: (courseId, data) => api.post(`/lectures/${courseId}`, data),
  update: (id, data) => api.put(`/lectures/${id}`, data),
  delete: (id) => api.delete(`/lectures/${id}`)
};

export const assignmentAPI = {
  getByCourse: (courseId) => api.get(`/assignments/course/${courseId}`),
  getOne: (id) => api.get(`/assignments/${id}`),
  create: (courseId, formData) => api.post(`/assignments/${courseId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/assignments/${id}`, data),
  delete: (id) => api.delete(`/assignments/${id}`),
  submit: (assignmentId, formData) => api.post(`/assignments/${assignmentId}/submit`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getSubmissions: (assignmentId) => api.get(`/assignments/${assignmentId}/submissions`),
  gradeSubmission: (submissionId, data) => api.put(`/assignments/submissions/${submissionId}/grade`, data)
};

export const liveClassAPI = {
  getByCourse: (courseId) => api.get(`/liveclasses/course/${courseId}`),
  getOne: (id) => api.get(`/liveclasses/${id}`),
  create: (courseId, data) => api.post(`/liveclasses/${courseId}`, data),
  update: (id, data) => api.put(`/liveclasses/${id}`, data),
  delete: (id) => api.delete(`/liveclasses/${id}`)
};

export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  getContent: () => api.get('/admin/content'),
  deleteContent: (type, id) => api.delete(`/admin/content/${type}/${id}`),
  getStats: () => api.get('/admin/stats')
};

export default api;