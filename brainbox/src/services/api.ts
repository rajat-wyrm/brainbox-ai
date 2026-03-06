import axios from 'axios';

class APIErrorInterceptor {
  private apiInstance: any;

  constructor() {
    this.apiInstance = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.apiInstance.interceptors.request.use(
      (config: any) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = Bearer ;
        }
        return config;
      },
      (error: any) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.apiInstance.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  handleError(error: any) {
    console.error('API Error:', error);
  }

  get api() {
    return this.apiInstance;
  }
}

export const api = new APIErrorInterceptor().api;
