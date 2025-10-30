import 'react-native-reanimated';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
//import { AuthProvider } from "@/context/auth/AuthContext";
import { View } from 'react-native';

/*
export const unstable_settings = {
    anchor: '(tabs)',
}; */

export default function RootLayout() {
    // Force light theme without paper
    return (
        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <Stack initialRouteName="(tabs)">
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="dark" />
        </View>
    );
}
