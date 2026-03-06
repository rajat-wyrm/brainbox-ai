import React from 'react';
import * as Sentry from '@sentry/react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useErrorHandler } from '../hooks/useErrorHandler';

interface FallbackProps {
  error: Error;
  componentStack: string | null;
  eventId: string | null;
  resetError(): void;
}

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetError }) => {
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();

  React.useEffect(() => {
    handleError(error);
  }, [error, handleError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center animate-pulse">
              <AlertTriangle size={48} className="text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Oops! Something broke
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We've been notified and are working on a fix.
          </p>
          <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg mb-6 text-left">
            <p className="text-sm font-mono text-red-600 dark:text-red-400 break-all">
              {error.message}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={resetError}
            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2 w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <Home size={18} />
            Go to Dashboard
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export const GlobalErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => <ErrorFallback error={error} resetError={resetError} componentStack={null} eventId={null} />}
      onError={(error, componentStack) => {
        console.error('Global error:', error, componentStack);
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};
