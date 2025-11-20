import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {api, type IApiResponse} from '@/utils/api/api.ts';
import type { IAuthUserInfo } from '@namSecure/shared/types/auth/auth';

interface IAuthContext
{
    isAuthenticated: boolean;
    loading: boolean;
    user: IAuthUserInfo | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode })
{
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<IAuthUserInfo | null>(null);

    useEffect(() =>
    {
        checkAuth();
    }, []);

    async function checkAuth()
    {
        try
        {
            await api.get('/auth/verify/admin');

            const user: IApiResponse<IAuthUserInfo> = await api.get('/auth/me');
            setUser(user.data);
            setIsAuthenticated(true);
        }
        catch
        {
            setIsAuthenticated(false);
        }
        finally
        {
            setLoading(false);
        }
    }

    async function login(email: string, password: string)
    {
        await api.post('/auth/login',
        {
            email,
            password
        });
        setIsAuthenticated(true);
    }

    async function logout() {
        await api.post('/auth/logout');
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
