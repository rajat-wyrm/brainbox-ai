import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Skeleton } from './components/ui/Skeleton';
import Login from './pages/Login';

// Lazy load dashboard
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  const token = localStorage.getItem('token');

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Login />} />
            <Route
              path="/dashboard/*"
              element={
                <Suspense fallback={
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
                      <Skeleton className="w-64 h-8 mx-auto mb-2" />
                      <Skeleton className="w-48 h-4 mx-auto" />
                    </div>
                  </div>
                }>
                  {token ? <Dashboard /> : <Navigate to="/login" replace />}
                </Suspense>
              }
            />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                icon: '🎉',
                duration: 3000,
                style: {
                  background: 'linear-gradient(to right, #10b981, #059669)',
                },
              },
              error: {
                icon: '❌',
                duration: 4000,
                style: {
                  background: 'linear-gradient(to right, #ef4444, #dc2626)',
                },
              },
            }}
          />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
