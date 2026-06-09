import axios from 'axios';
import { getTokens, setTokens, removeTokens } from '../utils/storage';

const RAILWAY_FRONTEND_HOSTS = new Set([
  'employe-task.up.railway.app',
  'employe-task-frontend-production-101b.up.railway.app',
]);

const DEFAULT_RAILWAY_BACKEND_URL =
  'https://employeetaskmanagement-production-eab1.up.railway.app';

const getDefaultBaseURL = () => {
  if (
    typeof window !== 'undefined' &&
    RAILWAY_FRONTEND_HOSTS.has(window.location.host)
  ) {
    return DEFAULT_RAILWAY_BACKEND_URL;
  }

  return '/api/';
};

const getBaseURL = () => {
  const envUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
  const rawUrl = envUrl || getDefaultBaseURL();

  if (rawUrl.startsWith('/')) {
    return rawUrl;
  }

  let url = rawUrl;

  // Ensure it starts with http/https if it looks like a domain
  if (!url.startsWith('http')) {
    url = `https://${url}`;
  }
  
  // Ensure it ends with /api/
  if (!url.endsWith('/api') && !url.endsWith('/api/')) {
    url = url.endsWith('/') ? `${url}api/` : `${url}/api/`;
  } else if (!url.endsWith('/')) {
    url = `${url}/`;
  }

  return url;
};

const joinApiPath = (path = '') => {
  const baseUrl = getBaseURL();
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${normalizedBase}${normalizedPath}`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

if (import.meta.env.DEV) {
  console.log('Final API Base URL:', api.defaults.baseURL);
}

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
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      const { refresh } = getTokens();

      if (refresh) {
        try {
          const res = await axios.post(joinApiPath('auth/refresh/'), {
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
