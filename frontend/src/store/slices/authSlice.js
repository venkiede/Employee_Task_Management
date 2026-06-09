import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { setTokens, removeTokens } from '../../utils/storage';

const extractAuthPayload = (response) => {
  const payload = response?.data?.data;
  const contentType = String(response?.headers?.['content-type'] || '');

  if (payload?.user && payload?.tokens?.access && payload?.tokens?.refresh) {
    return payload;
  }

  const error = new Error(
    contentType.includes('text/html')
      ? 'The app reached the frontend shell instead of the API. Check the Railway API base URL.'
      : 'The app received an unexpected response from the API.'
  );

  error.isInvalidApiResponse = true;
  error.status = response?.status || 0;
  throw error;
};

const normalizeAuthError = (error, fallbackMessage) => {
  if (error?.isInvalidApiResponse) {
    return {
      message: error.message,
      status: error.status || 0,
    };
  }

  if (!error.response) {
    return {
      message: 'Unable to reach the server. Check whether the Railway backend is running and the API URL is correct.',
      status: 0,
    };
  }

  const { status, data } = error.response;

  if (status >= 500) {
    return {
      message: 'The server is unavailable right now. Please try again in a moment.',
      status,
    };
  }

  if (data && typeof data === 'object') {
    return {
      ...data,
      status,
      message: data.message || fallbackMessage,
    };
  }

  return {
    message: fallbackMessage || 'Request failed.',
    status,
  };
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('auth/login/', credentials);
      const { user, tokens } = extractAuthPayload(response);
      setTokens(tokens.access, tokens.refresh);
      return { user, tokens };
    } catch (error) {
      return rejectWithValue(normalizeAuthError(error, 'Login failed.'));
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('auth/register/', userData);
      const { user, tokens } = extractAuthPayload(response);
      setTokens(tokens.access, tokens.refresh);
      return { user, tokens };
    } catch (error) {
      return rejectWithValue(normalizeAuthError(error, 'Registration failed.'));
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('auth/profile/');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(normalizeAuthError(error, 'Unable to fetch profile.'));
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        await api.post('auth/logout/', { refresh });
      }
      removeTokens();
      return true;
    } catch (error) {
      removeTokens(); // force remove locally anyway
      return rejectWithValue(normalizeAuthError(error, 'Logout failed.'));
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      removeTokens();
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload || null;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
