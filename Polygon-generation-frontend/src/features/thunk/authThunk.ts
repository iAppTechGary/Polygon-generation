import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError }  from 'axios';

// ─── Types ────────────────────────────────────────────────────────────────────

type ApiError = { message: string; statusCode?: number };

type AuthResponse = {
  success: boolean;
  data:    { token: string; users: object } | null;
  message: string;
};

type SigninPayload         = { email: string; password: string };
type SignupPayload         = { user_name: string; email: string; password: string };
type SocialSigninPayload   = { token: string; loginType: string };
type ChangePasswordPayload = { token: string | null; data: { password: string; newPassword: string } };
type ForgetPasswordPayload = { data: { email: string } };
type VerifyOtpPayload      = { data: { email: string; email_otp: number | null } };
type ResetPasswordPayload  = { token: string | null; data: { password: string | null } };

// ─── Axios instance ───────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ─── Helper ───────────────────────────────────────────────────────────────────

function rejectError(err: unknown) {
  const e = err as AxiosError<ApiError>;
  return e.response?.data ?? { message: e.message ?? 'Unknown error' };
}

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const signinThunk = createAsyncThunk<AuthResponse, SigninPayload, { rejectValue: ApiError }>(
  'auth/signin',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post<AuthResponse>('/api/auth/signin', data);
      return res.data;
    } catch (err) {
      return rejectWithValue(rejectError(err));
    }
  },
);

export const signupThunk = createAsyncThunk<AuthResponse, SignupPayload, { rejectValue: ApiError }>(
  'auth/signup',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post<AuthResponse>('/api/auth/signup', data);
      return res.data;
    } catch (err) {
      return rejectWithValue(rejectError(err));
    }
  },
);

export const socialSigninThunk = createAsyncThunk<AuthResponse, SocialSigninPayload, { rejectValue: ApiError }>(
  'auth/social-signin',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post<AuthResponse>('/api/auth/social-signin', data);
      return res.data;
    } catch (err) {
      return rejectWithValue(rejectError(err));
    }
  },
);

export const changePasswordThunk = createAsyncThunk<AuthResponse, ChangePasswordPayload, { rejectValue: ApiError }>(
  'auth/change-password',
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const res = await api.put<AuthResponse>('/api/auth/change-password', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(rejectError(err));
    }
  },
);

export const forgetPasswordThunk = createAsyncThunk<AuthResponse, ForgetPasswordPayload, { rejectValue: ApiError }>(
  'auth/forget-password',
  async ({ data }, { rejectWithValue }) => {
    try {
      const res = await api.post<AuthResponse>('/api/auth/forget-password', data);
      return res.data;
    } catch (err) {
      return rejectWithValue(rejectError(err));
    }
  },
);

export const verifyOtpThunk = createAsyncThunk<AuthResponse, VerifyOtpPayload, { rejectValue: ApiError }>(
  'auth/verify-otp',
  async ({ data }, { rejectWithValue }) => {
    try {
      const res = await api.post<AuthResponse>('/api/auth/verify-otp', data);
      return res.data;
    } catch (err) {
      return rejectWithValue(rejectError(err));
    }
  },
);

export const resetPasswordThunk = createAsyncThunk<AuthResponse, ResetPasswordPayload, { rejectValue: ApiError }>(
  'auth/reset-password',
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const res = await api.put<AuthResponse>('/api/auth/reset-password', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(rejectError(err));
    }
  },
);
