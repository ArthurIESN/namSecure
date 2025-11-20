import type {ReactNode} from "react";
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';

export function PublicRoute({ children }: { children: ReactNode }): ReactNode
{
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}
