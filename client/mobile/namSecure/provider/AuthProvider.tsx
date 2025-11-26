import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {getToken} from "@/services/auth/authServices";
import {api, EAPI_METHODS, IApiResponse} from "@/utils/api/api";
import type {IAuthUserInfo} from "@namSecure/shared/types/auth/auth";
import {EAuthState} from "@/types/auth/auth";
import {router} from "expo-router";

interface IAuthContextType
{
    user: IAuthUserInfo | null;
    authState: EAuthState;
    isLoading: boolean;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

const getAuthState = (user: IAuthUserInfo | null): EAuthState => {
    if (!user) return EAuthState.NOT_AUTHENTICATED;
    if (!user.emailVerified) return EAuthState.EMAIL_NOT_VERIFIED;
    if (!user.idVerified) return EAuthState.ID_CARD_NOT_VERIFIED;
    if (user.twoFactorEnabled && !user.twoFactorValidated) return EAuthState.TWO_FACTOR_NOT_VERIFIED;
    return EAuthState.FULLY_AUTHENTICATED;
};

export const AuthProvider = ({ children }: { children: ReactNode }) =>
{
    const [user, setUser] = useState<IAuthUserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = async () => {

        const response: IApiResponse<IAuthUserInfo> = await api('auth/me', EAPI_METHODS.GET);

        console.log("response", response);

        if (response.error)
        {
            setUser(null);
            return;
        }

        console.info(JSON.stringify(response));
        setUser(response.data);
    };

    useEffect(() =>
    {
        const loadAuthState = async () =>
        {
            await refreshUser();
            setIsLoading(false);
        };

        void loadAuthState();
    }, []);

    const logout = async () =>
    {
        const response = await api('auth/logout', EAPI_METHODS.POST);
        console.log("Logout API response:", response);

        if (response.error)
        {
            console.error("Logout failed:", response.errorMessage);
            return;
        }
        setUser(null);
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
