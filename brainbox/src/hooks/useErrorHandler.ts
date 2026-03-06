import { useState, useCallback } from 'react';
import * as Sentry from '@sentry/react';
import toast from 'react-hot-toast';

export const useErrorHandler = () => {
  const [error, setError] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  const handleError = useCallback((error, errorInfo = null) => {
    console.error('Error caught:', error, errorInfo);
    
    setError(error);
    setErrorInfo(errorInfo);

    // Send to Sentry in production
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(error, {
        contexts: {
          react: errorInfo
        }
      });
    }

    // Show toast to user
    toast.error(error.message || 'An unexpected error occurred');

    // Log to backend
    fetch('/api/v1/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        name: error.name,
        context: errorInfo
      })
    }).catch(console.error);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setErrorInfo(null);
  }, []);

  return {
    error,
    errorInfo,
    handleError,
    clearError
  };
};
