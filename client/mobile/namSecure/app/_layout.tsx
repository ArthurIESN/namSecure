import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { View, AppState } from 'react-native';
import {store} from "@/store/store";
import { Provider } from 'react-redux';
import {AuthProvider, useAuth} from "@/providers/AuthProvider";
import { ServerStatusProvider } from "@/providers/ServerStatusProvider";
import { WebSocketProvider } from "@/providers/WebSocketProvider";
import { MapProvider } from "@/providers/MapProvider";
import { useEffect, useRef } from 'react';
import { ThemeProvider as AppThemeProvider, useTheme } from "@/providers/ThemeProvider";
import { useRouter } from 'expo-router';
import { Redirect } from 'expo-router';
import { EAuthState } from "@/types/auth/auth";
import Loading from "@/components/ui/loading/Loading";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { startBackgroundLocation, stopBackgroundLocation } from '@/services/backgroundLocationService';
import * as Location from 'expo-location';
import { Colors } from '@/constants/theme';
import { HeaderProvider } from '@/context/HeaderContext';

function InitialLayout()
{
    const { authState, isLoading } = useAuth();
    const router = useRouter();
    const appStateRef = useRef(AppState.currentState);

    const { colorScheme } = useTheme();
    const colors = Colors[colorScheme];

    // Gestion de la navigation basée sur l'état d'authentification
    useEffect(() => {
        console.log("_layout useEffect - authState:", authState, "isLoading:", isLoading);
        if (!isLoading) {
            if (authState === EAuthState.SERVER_UNAVAILABLE) {
                console.log("Redirecting to serverUnavailable screen");
                router.replace("/(errors)/serverUnavailable");
            } else if (authState === EAuthState.FULLY_AUTHENTICATED) {
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

    useEffect(() => {
        const handleAppStateChange = async (nextAppState: any) => {
            if (
                appStateRef.current === 'active' &&
                (nextAppState === 'background' || nextAppState === 'inactive')
            ) {
                if (authState !== EAuthState.FULLY_AUTHENTICATED) {
                    console.log('[Background Location] User not authenticated');
                    appStateRef.current = nextAppState;
                    return;
                }

                const { status } = await Location.getForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.log('[Background Location] Permissions not granted');
                    appStateRef.current = nextAppState;
                    return;
                }

                console.log('[Background Location] Starting background location');
                await startBackgroundLocation();
            }

            if (
                (appStateRef.current === 'background' || appStateRef.current === 'inactive') &&
                nextAppState === 'active'
            ) {
                console.log('[Background Location] Stopping background location');
                await stopBackgroundLocation();
            }

            appStateRef.current = nextAppState;
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, [authState]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
            <Stack screenOptions={{ headerShown: false }}>
                {authState === EAuthState.SERVER_UNAVAILABLE && (
                    <Stack.Screen
                        name="(errors)"
                        options={{
                            animation: 'slide_from_bottom',
                            animationDuration: 150,
                        }}
                    />
                )}

                {authState === EAuthState.FULLY_AUTHENTICATED && (
                    <>
                        <Stack.Screen
                            name="(app)"
                            options={{
                                header: () => null,
                                contentStyle: { backgroundColor: 'transparent' }
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

                {authState !== EAuthState.FULLY_AUTHENTICATED && authState !== EAuthState.SERVER_UNAVAILABLE && (
                    <Stack.Screen name="(auth)" />
                )}
            </Stack>
        </View>
    );
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AppThemeProvider>
                <Provider store={store}>
                    <ServerStatusProvider>
                        <AuthProvider>
                            <HeaderProvider>
                                <MapProvider>
                                    <WebSocketProvider>
                                            <InitialLayout />
                                    </WebSocketProvider>
                                </MapProvider>
                            </HeaderProvider>
                        </AuthProvider>
                    </ServerStatusProvider>
                </Provider>
            </AppThemeProvider>
        </GestureHandlerRootView>
    );
}
