import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { signinThunk, socialSigninThunk } from '../thunk/authThunk';

interface AuthUser {
  id:    string;
  email: string;
  name:  string;
}

interface AuthState {
  token: string | null;
  user:  AuthUser | null;
}

const initialState: AuthState = {
  token: null,
  user:  null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Clear auth state on explicit logout. */
    logout(state) {
      state.token = null;
      state.user  = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signinThunk.fulfilled, (state, action) => {
        state.token = action.payload.data?.token  ?? null;
        state.user  = action.payload.data?.users  ?? null;
      })
      .addCase(socialSigninThunk.fulfilled, (state, action) => {
        state.token = action.payload.data?.token  ?? null;
        state.user  = action.payload.data?.users  ?? null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
