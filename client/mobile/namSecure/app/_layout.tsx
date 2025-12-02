import 'react-native-reanimated';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
//import { AuthProvider } from "@/context/auth/AuthContext";
import { View } from 'react-native';
import {store} from "@/store/store";
import { Provider } from 'react-redux';
import {AuthProvider, useAuth} from "@/provider/AuthProvider";
import { WebSocketProvider } from "@/providers/WebSocketProvider";
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Redirect } from 'expo-router';
import { EAuthState } from "@/types/auth/auth";
import Loading from "@/components/ui/loading/Loading";
import { GestureHandlerRootView } from 'react-native-gesture-handler';


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
            if (authState === EAuthState.FULLY_AUTHENTICATED) {
                router.replace("/(app)/(tabs)");
            } else if (authState === EAuthState.EMAIL_NOT_VERIFIED) {
                router.replace("/(auth)/(validation)/EmailValidation");
            } else if (authState === EAuthState.ID_CARD_NOT_VERIFIED) {
                router.replace("/(auth)/(validation)/IdValidation");
            } else if (authState === EAuthState.TWO_FACTOR_NOT_VERIFIED) {
                router.replace("/(auth)/(validation)/Verify2FA");
            } else if (authState === EAuthState.NOT_AUTHENTICATED) {
                router.replace("/(auth)");
            }
        }
    }, [authState, isLoading]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
            <Stack screenOptions={{ headerShown: false }}>
                {authState === EAuthState.FULLY_AUTHENTICATED && (
                    <>
                        <Stack.Screen
                            name="(app)"
                            options={{
                                header: () => null
                            }}
                        />
                        <Stack.Screen
                            name="(app)/(tabs)/Setup2FA"
                            options={{
                                presentation: 'transparentModal',
                            }}
                        />
                    </>
                )}

                {authState !== EAuthState.FULLY_AUTHENTICATED && (
                    <Stack.Screen name="(auth)" />
                )}
            </Stack>
        </View>
    );
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Provider store={store}>
                <AuthProvider>
                    <WebSocketProvider>
                        <InitialLayout />
                    </WebSocketProvider>
                </AuthProvider>
            </Provider>
        </GestureHandlerRootView>
    );
}
