import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {getToken} from "@/services/auth/authServices";
import {api, EAPI_METHODS, IApiResponse} from "@/utils/api/api";
import type {IAuthUserInfo} from "@namSecure/shared/types/auth/auth";

type AuthState = "NOT_AUTHENTICATED" | "EMAIL_NOT_VERIFIED" | "ID_CARD_NOT_VERIFIED" | "FULLY_AUTHENTICATED";

interface IAuthContextType
{
    user: IAuthUserInfo | null;
    authState: AuthState;
    isLoading: boolean;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

const getAuthState = (user: IAuthUserInfo | null): AuthState => {
    if (!user) return "NOT_AUTHENTICATED";
    if (!user.emailVerified) return "EMAIL_NOT_VERIFIED";
    if (!user.idVerified) return "ID_CARD_NOT_VERIFIED";
    //if( !user.twoFactorEnabled) return "ID_CARD_NOT_VERIFIED";
    return "FULLY_AUTHENTICATED";
};

export const AuthProvider = ({ children }: { children: ReactNode }) =>
{
    const [user, setUser] = useState<IAuthUserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const response: IApiResponse<IAuthUserInfo> = await api('auth/me', EAPI_METHODS.GET);

            console.log("response", response);

            if (response.error)
            {
                setUser(null);
                return;
            }

            console.info(JSON.stringify(response));
            setUser(response.data);
        } catch (error)
        {
            console.error('Failed to refresh user:', error);
            setUser(null);
        }
    };

    useEffect(() =>
    {
        const loadAuthState = async () =>
        {
            try
            {
                await refreshUser();
            }
            catch (error)
            {
                console.error('Failed to load auth state', error);
                setUser(null);
            }
            finally
            {
                setIsLoading(false);
            }
        };

        void loadAuthState();
    }, []);

    const logout = async () =>
    {
        try
        {
            const response = await api('auth/logout', EAPI_METHODS.POST);
            console.log("Logout API response:", response);
        } catch (error)
        {
            console.error('Failed to logout:', error);
        } finally
        {
            setUser(null);
        }
    }

    const authState = getAuthState(user);

    return (
        <AuthContext.Provider value={{ user, authState, isLoading, logout, refreshUser }}>
            {!isLoading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): IAuthContextType =>
{
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
