import axios from 'axios';
import toast from 'react-hot-toast';
import * as Sentry from '@sentry/react';

class APIErrorInterceptor {
  constructor() {
    this.api = axios.create({
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
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request ID for tracking
        config.headers['X-Request-ID'] = this.generateRequestId();

        return config;
      },
      (error) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  handleError(error) {
    const errorData = {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      requestId: error.config?.headers?.['X-Request-ID'],
      timestamp: new Date().toISOString()
    };

    console.error('API Error:', errorData);

    // Send to Sentry in production
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(error, {
        contexts: {
          api: errorData
        }
      });
    }

    // Show user-friendly message
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || this.getStatusMessage(error.response.status);
      toast.error(message);
    } else if (error.request) {
      // Request made but no response
      toast.error('Unable to reach server. Please check your connection.');
    } else {
      // Request setup error
      toast.error('An unexpected error occurred');
    }
  }

  getStatusMessage(status) {
    const messages = {
      400: 'Bad request. Please check your input.',
      401: 'You are not authorized. Please log in again.',
      403: 'You do not have permission to perform this action.',
      404: 'Resource not found.',
      409: 'Conflict with existing data.',
      422: 'Validation failed. Please check your input.',
      429: 'Too many requests. Please try again later.',
      500: 'Server error. Please try again later.',
      503: 'Service unavailable. Please try again later.'
    };

    return messages[status] || `Error ${status}. Please try again.`;
  }

  // Retry failed requests
  async retryRequest(error, maxRetries = 3) {
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
        const response = await axios(error.config);
        return response;
      } catch (retryError) {
        retries++;
        if (retries === maxRetries) {
          throw retryError;
        }
      }
    }
  }
}

export const api = new APIErrorInterceptor().api;
