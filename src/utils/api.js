import axios from 'axios';

const API_URL = 'https://link-trimify.vercel.app'; // Update this with your Django backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't try to refresh token for login requests
    if (error.response.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/login/')) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}/api/auth/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (error) {
        // If refresh token fails, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/api/auth/login/', credentials),
  register: (userData) => api.post('/api/auth/register/', userData),
  refreshToken: (refresh) => api.post('/api/auth/refresh/', { refresh }),
};

export const userAPI = {
  getProfile: () => api.get('/api/users/profile/'),
  updateProfile: (data) => api.put('/api/users/profile/', data),
  updatePassword: (data) => api.post('/api/users/change-password/', data),
  deleteAccount: () => api.delete('/api/users/profile/'),
  uploadAvatar: (formData) => api.post('/api/users/avatar/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export const urlAPI = {
  shorten: (url) => api.post('/shorten/', url),
  getUrls: () => api.get('/urls/'),
  getUrlDetail: (shortCode) => api.get(`/urls/${shortCode}/`),
  updateUrl: (shortCode, data) => api.put(`/urls/${shortCode}/edit/`, data),
  deleteUrl: (shortCode) => api.delete(`/urls/${shortCode}/delete/`),
  toggleUrl: (shortCode) => api.post(`/urls/${shortCode}/toggle/`),
  bulkDelete: (shortCodes) => api.post('/urls/bulk/delete/', { short_codes: shortCodes }),
  bulkToggle: (shortCodes) => api.post('/urls/bulk/toggle/', { short_codes: shortCodes }),
  getStats: (shortCode) => api.get(`/stats/${shortCode}/`),
  getAnalytics: (shortCode) => api.get(`/analytics/${shortCode}/`),
  getQRCode: (shortCode) => api.get(`/qr/${shortCode}/`, { responseType: 'blob' }),
  getUserStats: () => api.get('/user/stats/'),

};

export default api; 