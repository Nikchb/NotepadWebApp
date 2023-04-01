import { createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';
import axios, { AxiosResponse } from "axios";
import ServiceResponse from "../../models/serviceResponse";
import AuthDTO from "../../models/authDTO";
import SignDTO from '../../models/signDTO';
import { setAuthToken, removeAuthToken } from '../store';

export interface AuthState {
  auth: boolean;
};

const authState: AuthState = {
  auth: false
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: authState,
  reducers: {
    accept: (state) => {
      state.auth = true;
    },
    revoke: (state) => {
      state.auth = false;
    },
  },
});

export const { accept, revoke } = authSlice.actions;

export const signUpAsync =
  (model: SignDTO): AppThunk<Promise<boolean>> =>
    async (): Promise<boolean> => {
      try {
        const response = (await axios.post('/sign-up', model)) as AxiosResponse<ServiceResponse<AuthDTO>>;
        if (response.data.success && response.data.data) {
          setAuthToken(response.data.data.token);
          return true;
        }
      } catch (e: any) {
        removeAuthToken();
        console.error(e.message);
      }
      return false;
    };

export const signInAsync =
  (model: SignDTO): AppThunk<Promise<boolean>> =>
    async (): Promise<boolean> => {
      try {
        const response = (await axios.post('/sign-in', model)) as AxiosResponse<ServiceResponse<AuthDTO>>;
        if (response.data.success && response.data.data) {
          setAuthToken(response.data.data.token);
          return true;
        }
      } catch (e: any) {
        removeAuthToken();
        console.error(e.message);
      }
      return false;
    };

export const signOutAsync =
  (): AppThunk<Promise<void>> =>
    async (): Promise<void> => {
      console.log('signOutSlice');
      removeAuthToken();
    };

export const isAuth = (state: RootState) => state.auth.auth;

export default authSlice.reducer;