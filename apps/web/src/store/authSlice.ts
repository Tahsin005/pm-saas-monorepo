import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from './index';

const authSlice = createSlice({
  name: 'auth',
  initialState: {},
  reducers: {},
});

export default authSlice.reducer;

export const selectIsAuthenticated = (_state: RootState) => false;
