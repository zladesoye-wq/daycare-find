import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@daycarefind_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to get token for request:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        console.warn('Authentication error - token may be expired');
      }
      return Promise.reject({
        status,
        message: data?.message || data?.error || 'An error occurred',
        data,
      });
    } else if (error.request) {
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
      });
    }
    return Promise.reject({
      status: 0,
      message: error.message || 'An unexpected error occurred',
    });
  }
);

// Auth endpoints
export const authApi = {
  login: (email, password, role) =>
    api.post('/auth/login', { email, password, role }),
  register: (data) => api.post('/auth/register', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  getProfile: () => api.get('/auth/profile'),
};

// Provider search & detail endpoints
export const providerApi = {
  search: (params) => api.get('/providers', { params }),
  getById: (id) => api.get(`/providers/${id}`),
  update: (id, data) => api.put(`/providers/${id}`, data),
  updateAvailability: (id, data) =>
    api.put(`/providers/${id}/availability`, data),
  updatePricing: (id, data) =>
    api.put(`/providers/${id}/pricing`, data),
};

// Booking endpoints
export const bookingApi = {
  create: (data) => api.post('/bookings', data),
  list: (params) => api.get('/bookings', { params }),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  cancel: (id) => api.delete(`/bookings/${id}`),
};

// Favorites endpoints
export const favoritesApi = {
  list: () => api.get('/favorites'),
  add: (providerId) => api.post('/favorites', { providerId }),
  remove: (providerId) => api.delete(`/favorites/${providerId}`),
};

// Waitlist endpoints
export const waitlistApi = {
  join: (providerId) => api.post('/waitlist', { providerId }),
  leave: (providerId) => api.delete(`/waitlist/${providerId}`),
};

// Notification endpoints
export const notificationApi = {
  list: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  registerPushToken: (pushToken) => api.post('/notifications/register-push', { pushToken }),
};

export default api;