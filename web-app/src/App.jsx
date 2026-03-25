import { lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import PageTransition from './components/PageTransition';
import ToastContainer from './components/Toast';
import useSmoothScroll from './lib/useSmoothScroll';
import SkeletonLoader from './components/SkeletonLoader';

// Lazy load pages for code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

// TanStack Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Page loading fallback
function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      padding: 40,
    }}>
      <SkeletonLoader width="200px" height="24px" />
      <SkeletonLoader width="320px" height="16px" />
      <SkeletonLoader width="260px" height="16px" />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}>
              <LandingPage />
            </Suspense>
          </PageTransition>
        } />
        <Route path="/login" element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}>
              <LoginPage />
            </Suspense>
          </PageTransition>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PageTransition>
              <Suspense fallback={<PageLoader />}>
                <DashboardPage />
              </Suspense>
            </PageTransition>
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function SmoothScrollProvider({ children }) {
  useSmoothScroll();
  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <SmoothScrollProvider>
            <AnimatedRoutes />
            <ToastContainer />
          </SmoothScrollProvider>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
