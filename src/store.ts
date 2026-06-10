import { configureStore } from '@reduxjs/toolkit';
import authReducer       from './features/slice/authSlice';
import paletteReducer    from './features/slice/paletteSlice';
import paintReducer      from './features/slice/paintSlice';
import portfolioReducer  from './features/slice/portfolioSlice';
import templateReducer   from './features/slice/templateSlice';
import userReducer       from './features/slice/userSlice';
import geometrizeReducer from './features/slice/geometrizeSlice';

export const store = configureStore({
  reducer: {
    auth:       authReducer,
    palette:    paletteReducer,
    paint:      paintReducer,
    portfolio:  portfolioReducer,
    template:   templateReducer,
    user:       userReducer,
    geometrize: geometrizeReducer,
  },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
