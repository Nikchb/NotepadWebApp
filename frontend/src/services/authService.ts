import axios, { AxiosError, AxiosResponse } from "axios";
import ServiceResponse from "../models/serviceResponse";

export interface SignDTO {
  email: string,
  password: string
}

export class AuthService {

  auth: boolean;

  constructor() {
    this.configureAxiosDefaults();

    let accessToken = localStorage.getItem('access_token');
    if (accessToken != null) {
      this.sign(accessToken);
    }
    this.auth = false;
  }

  configureAxiosDefaults() {
    axios.defaults.baseURL = `${process.env.BACKEND_HOST}:${process.env.BACKEND_HOST}`;
    axios.interceptors.response.use(
      (response: AxiosResponse): AxiosResponse => {
        return response;
      },
      (error: AxiosError): Promise<AxiosError> => {
        if (error.response?.status === 401) {
          this.signOut();
        }
        return Promise.reject(error);
      }
    );
  }

  configureAxiosAuthentication(accessToken: string) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  }

  async signUp(model: SignDTO) {
    try {
      const response = (await axios.post('/sing-up', model)) as AxiosResponse<ServiceResponse<string>>;
      if (response.data.success && response.data.data) {
        this.sign(response.data.data);
      }
    } catch (e: any) {
      this.signOut;
      console.error(e.message);
    }
  }

  async signIn(model: SignDTO) {
    try {
      const response = (await axios.post('/sing-in', model)) as AxiosResponse<ServiceResponse<string>>;
      if (response.data.success && response.data.data) {
        this.sign(response.data.data);
      }
    } catch (e: any) {
      this.signOut();
      console.error(e.message);
    }
  }

  sign(accessToken: string) {
    this.auth = true;
    this.configureAxiosAuthentication(accessToken);
    localStorage.removeItemsetItem('access_token', accessToken);
  }

  signOut() {
    this.auth = false;
    this.configureAxiosAuthentication('');
    localStorage.removeItem('access_token')
  }
}

export const authService = new AuthService();