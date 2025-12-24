import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

console.log('[Axios] Creating API instance with baseURL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('[Axios] Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('[Axios] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('[Axios] Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('[Axios] Response error:', error.message, error.code);
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject({ message, status: error.response?.status });
  }
);

export default api;

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/sign-up', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
};

// Profile APIs
export const profileAPI = {
  getProfile: () => api.get('/profile/view'),
  updateProfile: (data) => api.patch('/profile/edit', data),
  changePassword: (password) => api.patch('/profile/edit/password', { password }),
};

// Request APIs
export const requestAPI = {
  sendRequest: (status, toUserID) => api.post(`/request/send/${status}/${toUserID}`),
  reviewRequest: (status, requestID) => api.post(`/request/review/${status}/${requestID}`),
};

// User APIs
export const userAPI = {
  getFeed: (page = 1, limit = 10) => api.get(`/user/feed?page=${page}&limit=${limit}`),
  getConnections: () => api.get('/user/connections'),
  getReceivedRequests: () => api.get('/user/requests/recieved'),
};
