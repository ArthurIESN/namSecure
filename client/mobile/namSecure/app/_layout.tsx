import 'react-native-reanimated';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
//import { AuthProvider } from "@/context/auth/AuthContext";
import { View } from 'react-native';
import {store} from "@/store/store";
import { Provider } from 'react-redux';
import {AuthProvider, useAuth} from "@/provider/AuthProvider";
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Redirect } from 'expo-router';


/*
export default function RootLayout()
{
    return (
        <Provider store={store}>
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                <Stack initialRouteName="(tabs)">
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                </Stack>
                <StatusBar style="dark" />
            </View>
        </Provider>
    );
} */
function InitialLayout()
{
    const { authState, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (authState === "FULLY_AUTHENTICATED") {
                router.replace("/(tabs)");
            } else if (authState === "EMAIL_NOT_VERIFIED") {
                router.replace("/(auth)/(validation)/EmailValidation");
            } else if (authState === "ID_CARD_NOT_VERIFIED") {
                router.replace("/(auth)/(validation)/IdValidation");
            } else if (authState === "NOT_AUTHENTICATED") {
                router.replace("/(auth)");
            }
        }
    }, [authState, isLoading]);

    if (isLoading) {
        return <View style={{ flex: 1, backgroundColor: '#ffffff' }} />;
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'white'
                } }}>
                {authState === "FULLY_AUTHENTICATED" && (
                    <Stack.Screen name="(tabs)" />
                )}

                {authState !== "FULLY_AUTHENTICATED" && (
                    <Stack.Screen name="(auth)" />
                )}
            </Stack>
        </View>
    );
}

export default function RootLayout() {
    return (
        <Provider store={store}>
            <AuthProvider>
                <InitialLayout />
            </AuthProvider>
        </Provider>
    );
}
