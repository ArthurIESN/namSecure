import { ReactElement } from 'react';
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/context/auth/AuthContext";

export default function AuthLayout(): ReactElement {
    const { session } = useAuth();

    if (session) {
        return <Redirect href="/" />;
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'white' }
            }}
        >
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="emailValidation" />
        </Stack>
    );
}
