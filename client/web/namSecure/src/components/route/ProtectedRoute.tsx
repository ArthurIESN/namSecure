import type {ReactNode} from "react";
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';
import { ErrorDialogProvider } from '@/context/ErrorDialogContext';

export function ProtectedRoute({ children }: { children: ReactNode }): ReactNode
{
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return isAuthenticated ? (
        <ErrorDialogProvider>
            {children}
        </ErrorDialogProvider>
    ) : <Navigate to="/login" replace />;
}
