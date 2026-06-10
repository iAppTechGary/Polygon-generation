import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError }  from 'axios';

type ApiError = { message: string };

// ─── Axios instances ──────────────────────────────────────────────────────────

/** Node.js backend */
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

/** Python FastAPI service */
const pythonApi = axios.create({ baseURL: import.meta.env.VITE_PYTHON_API_URL });

function rejectError(err: unknown) {
  const e = err as AxiosError<ApiError>;
  return e.response?.data ?? { message: e.message ?? 'Unknown error' };
}

// ─── Geometrize (image → shape primitives) ────────────────────────────────────

type GeometrizePayload = {
  token: string | null;
  formData: FormData; // contains image file + config params
};

/**
 * Upload an image and receive back a JSON array of geometric primitives
 * (triangles, ellipses, rectangles, etc.) from the Python service.
 */
export const createGeometrizeImageThunk = createAsyncThunk(
  'palette/geometrize-image',
  async ({ token, formData }: GeometrizePayload, { rejectWithValue }) => {
    try {
      const res = await pythonApi.post('/geometrize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(rejectError(err));
    }
  },
);

// ─── Shape ordering ───────────────────────────────────────────────────────────

type OrderShapesPayload = {
  token: string | null;
  data:  unknown; // raw geometrize JSON
};

/**
 * Send raw shape JSON to the backend for ordering/post-processing
 * before canvas rendering.
 *
 * NOTE: Proprietary ordering algorithm runs server-side.
 */
export const createOrderShapeFromJsonThunk = createAsyncThunk(
  'palette/order-shapes',
  async ({ token, data }: OrderShapesPayload, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/geometrize/order-shapes', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(rejectError(err));
    }
  },
);

// ─── Colour unmixing ──────────────────────────────────────────────────────────

type UnmixColorPayload = {
  token: string | null;
  data:  { colors: string[]; targetColor: string };
};

export const unmixColorThunk = createAsyncThunk(
  'palette/unmix-color',
  async ({ token, data }: UnmixColorPayload, { rejectWithValue }) => {
    try {
      const res = await pythonApi.post('/unmix-color', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(rejectError(err));
    }
  },
);

// ─── Palette brands ───────────────────────────────────────────────────────────

export const listPaletteBrandsThunk = createAsyncThunk(
  'palette/list-brands',
  async (token: string | null, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/palette-brand', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(rejectError(err));
    }
  },
);
