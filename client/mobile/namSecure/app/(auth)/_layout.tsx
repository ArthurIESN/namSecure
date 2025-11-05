import { ReactElement } from 'react';
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/provider/AuthProvider";

export default function AuthLayout(): ReactElement {
    const { authState } = useAuth();

    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'white' }
        }}>
            <Stack.Screen name="Login" />
            <Stack.Screen name="Register" />
            <Stack.Screen name="ResetPassword" options={{ headerShown: true, headerTitle: "" }} />
            <Stack.Screen name="(validation)" />
        </Stack>
    );
}