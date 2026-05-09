import axios from 'axios';
import { getTokens, setTokens, removeTokens } from '../utils/storage';

const getBaseURL = () => {
  let url = import.meta.env.VITE_API_BASE_URL || '';
  if (!url) return '/api/';
  
  // Ensure it starts with https://
  if (url && !url.startsWith('http')) {
    url = `https://${url}`;
  }
  
  // Ensure it ends with /api/
  if (url && !url.endsWith('/api') && !url.endsWith('/api/')) {
    url = url.endsWith('/') ? `${url}api/` : `${url}/api/`;
  } else if (url && !url.endsWith('/')) {
    url = `${url}/`;
  }
  
  return url;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('Final API Base URL:', api.defaults.baseURL);



// Request Interceptor: Attach access token
api.interceptors.request.use(
  (config) => {
    const { access } = getTokens();
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { refresh } = getTokens();

      if (refresh) {
        try {
          const res = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
            refresh,
          });

          const newAccess = res.data.access;
          setTokens(newAccess, refresh);

          // Update header and retry
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh token expired or invalid
          removeTokens();
          // We can dispatch a logout action from the redux store or force reload
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        removeTokens();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
