import {useContext, createContext, useState, ReactNode, useEffect} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import LoginScreen from "@/app/(auth)/Login";
import { getToken } from "@/services/auth/authServices";

// Define types for context data and provider props
type AuthContextType = {
    session: boolean;
    user: boolean;
};

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
    session: false,
    user: false
});

const AuthProvider = async ({ children }: AuthProviderProps) => {
    // Change initial loading state to false to show children
    const [loading, setLoading] = useState(false);
    const [session, setSession] = useState<string | null>("sessiontkt");
    const [user, setUser] = useState(true);
    const contextData = { session, user };

    /*useEffect(() => {
        const fetchToken = async () => {
            const token = await getToken();
            console.log(token);
            //setSession(token);
            setLoading(false);
        };
        fetchToken();
    }, []);*/

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? (
                <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Loading...</Text>
                </SafeAreaView>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
