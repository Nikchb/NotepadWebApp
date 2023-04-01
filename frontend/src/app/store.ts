import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import auth, { accept, revoke } from './slices/authSlice';
import notes, { removeNotes } from './slices/notesSlice';
import axios, { AxiosError, AxiosResponse } from 'axios';
import serverURLs from '../configs/serverURLs';

export const store = configureStore({
  reducer: {
    auth,
    notes
  },
});

export function configureAxiosDefaults() {
  axios.defaults.baseURL = process.env.NODE_ENV === "production" ? serverURLs.prodBackendURL : serverURLs.devBackendURL;
  axios.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
      return response;
    },
    (error: AxiosError): Promise<AxiosError> => {
      if (error.response?.status === 401) {
        removeAuthToken();
      }
      return Promise.reject(error);
    }
  );
}

export function configureAxiosAuthentication(accessToken: string) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
}

export function setAuthToken(accessToken: string) {
  store.dispatch(accept());
  configureAxiosAuthentication(accessToken);
  localStorage.setItem('access_token', accessToken);
}

export function removeAuthToken() {
  store.dispatch(revoke());
  store.dispatch(removeNotes());
  configureAxiosAuthentication('');
  localStorage.removeItem('access_token')
}

configureAxiosDefaults();
const accessToken = localStorage.getItem('access_token');
if (accessToken != null) {
  setAuthToken(accessToken);
}

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
