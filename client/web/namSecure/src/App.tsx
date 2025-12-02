import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from '@/context/auth/AuthContext';
import { ProtectedRoute } from '@/components/route/ProtectedRoute';
import { PublicRoute } from '@/components/route/PublicRoute';
import { PageLoader } from '@/components/PageLoader';

const Login = lazy(() => import('@/pages/auth/Login').then(m => ({ default: m.Login })));
const ResetPasswordRedirect = lazy(() => import('@/pages/auth/ResetPasswordRedirect').then(m => ({ default: m.ResetPasswordRedirect })));
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard').then(m => ({ default: m.Dashboard })));

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/login" element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        } />

                        <Route path="/ResetPassword" element={
                            <ResetPasswordRedirect />
                        } />

                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
