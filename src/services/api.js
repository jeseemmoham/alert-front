import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://alert-back.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ──────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
};

// ─── User API ──────────────────────────────────────────────
export const userAPI = {
  updateZipCode: (zipCode) => api.put('/users/zipcode', { zipCode }),
  updateProfile: (data) => api.put('/users/profile', data),
};

// ─── Alert API ─────────────────────────────────────────────
export const alertAPI = {
  getMyAlerts: (params) => api.get('/alerts', { params }),
  getAllAlerts: (params) => api.get('/alerts/all', { params }),
  getAlert: (id) => api.get(`/alerts/${id}`),
};

// ─── Admin API ─────────────────────────────────────────────
export const adminAPI = {
  createAlert: (data) => api.post('/admin/alerts', data),
  updateAlert: (id, data) => api.put(`/admin/alerts/${id}`, data),
  deleteAlert: (id) => api.delete(`/admin/alerts/${id}`),
  getUsers: () => api.get('/admin/users'),
};

// ─── Emergency Contacts API ────────────────────────────────
export const contactsAPI = {
  // GET /api/contacts
  getContacts: () => api.get('/contacts'),
  // POST /api/contacts
  add: (data) => api.post('/contacts', data),
  // DELETE /api/contacts/:id
  delete: (id) => api.delete(`/contacts/${id}`),
};

export default api;

