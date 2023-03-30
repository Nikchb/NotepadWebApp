import axios, { AxiosError, AxiosResponse } from "axios";
import ServiceResponse from "../models/serviceResponse";
import AuthDTO from "../models/authDTO";
import serverURLs from "../configs/serverURLs";

export interface SignDTO {
  email: string,
  password: string
}

export class AuthService {

  auth: boolean;

  constructor() {
    this.auth = false;
    this.configureAxiosDefaults();
    let accessToken = localStorage.getItem('access_token');
    if (accessToken != null) {
      this.sign(accessToken);
    }
  }

  configureAxiosDefaults() {
    axios.defaults.baseURL = process.env.NODE_ENV === "production" ? serverURLs.prodBackendURL : serverURLs.devBackendURL;
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

  async signUp(model: SignDTO): Promise<boolean> {
    try {
      const response = (await axios.post('/sign-up', model)) as AxiosResponse<ServiceResponse<AuthDTO>>;
      if (response.data.success && response.data.data) {
        this.sign(response.data.data.token);
        return true;
      }
    } catch (e: any) {
      this.signOut();
      console.error(e.message);
    }
    return false;
  }

  async signIn(model: SignDTO): Promise<boolean> {
    try {
      console.log(axios.defaults);
      const response = (await axios.post('/sign-in', model)) as AxiosResponse<ServiceResponse<AuthDTO>>;
      if (response.data.success && response.data.data) {
        this.sign(response.data.data.token);
        return true;
      }
    } catch (e: any) {
      this.signOut();
      console.error(e.message);
    }
    return false;
  }

  sign(accessToken: string) {
    this.auth = true;
    this.configureAxiosAuthentication(accessToken);
    localStorage.setItem('access_token', accessToken);
  }

  signOut() {
    this.auth = false;
    this.configureAxiosAuthentication('');
    localStorage.removeItem('access_token')
  }
}

export const authService = new AuthService();