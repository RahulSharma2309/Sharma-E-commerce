import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
const createProfile = (profile) => api.post('/api/users', profile);
const getProfileByUserId = (userId) => api.get(`/api/users/by-userid/${encodeURIComponent(userId)}`);
const getProfileById = (id) => api.get(`/api/users/${id}`);
const updateProfile = (id, profile) => api.put(`/api/users/${id}`, profile);

export { createProfile, getProfileByUserId, getProfileById, updateProfile };
export default api;
