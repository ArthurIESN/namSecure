import 'react-native-reanimated';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
//import { AuthProvider } from "@/context/auth/AuthContext";
import { View, AppState } from 'react-native';
import {store} from "@/store/store";
import { Provider } from 'react-redux';
import {AuthProvider, useAuth} from "@/providers/AuthProvider";
import { ServerStatusProvider } from "@/providers/ServerStatusProvider";
import { WebSocketProvider } from "@/providers/WebSocketProvider";
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
    const appStateRef = useRef(AppState.currentState);

    useEffect(() => {
        async function requestLocationPermissions() {
            if (authState === EAuthState.FULLY_AUTHENTICATED) {
                try {
                    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
                    if (foregroundStatus === 'granted') {
                        console.log('Foreground location permission granted');

                    } else {
                        console.error('Foreground location permission denied');
                    }
                } catch (error) {
                    console.error('Error requesting location permissions:', error);
                }
            }
        }
        requestLocationPermissions();
    }, [authState]);

    useEffect(() => {
        const handleAppStateChange = async (nextAppState: any) => {
            if (
                appStateRef.current === 'active' &&
                (nextAppState === 'background' || nextAppState === 'inactive')
            ) {

                const {status} = await Location.getForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.log('Location permission not granted, not starting background location');
                    return;
                }
                await startBackgroundLocation();

            }

            if (
                (appStateRef.current === 'background' || appStateRef.current === 'inactive') &&
                nextAppState === 'active'
            ) {
                await stopBackgroundLocation();
            }

            appStateRef.current = nextAppState;
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);
    const { colorScheme } = useTheme();
    const colors = Colors[colorScheme];

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
                            <WebSocketProvider>
                                    <InitialLayout />
                            </WebSocketProvider>
                        </AuthProvider>
                    </ServerStatusProvider>
                </Provider>
            </AppThemeProvider>
        </GestureHandlerRootView>
    );
}
