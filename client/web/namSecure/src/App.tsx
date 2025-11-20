import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/auth/AuthContext';
import { ProtectedRoute } from '@/components/route/ProtectedRoute';
import { PublicRoute } from '@/components/route/PublicRoute';
import { Login } from '@/pages/auth/Login';
import { ResetPasswordRedirect } from '@/pages/auth/ResetPasswordRedirect';
import { Dashboard } from '@/pages/dashboard/Dashboard';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
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
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
