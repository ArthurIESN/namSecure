import type {ReactNode} from "react";
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';

export function ProtectedRoute({ children }: { children: ReactNode })
{
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div>Chargement...</div>;

    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}
