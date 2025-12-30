import { ReactElement } from 'react';
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { Colors } from '@/constants/theme';

export default function AuthLayout(): ReactElement {
    const { authState } = useAuth();
    const { colorScheme } = useTheme();
    const colors = Colors[colorScheme];

    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background }
        }}>
            <Stack.Screen name="Login" />
            <Stack.Screen name="Register" />
            <Stack.Screen
              name="RegisterApple"
              options={{
                headerShown: true,
                headerTitle: "",
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.text,
              }}
            />
            <Stack.Screen
              name="SendResetPassword"
              options={{
                headerShown: true,
                headerTitle: "",
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.text,
              }}
            />
            <Stack.Screen
              name="ResetPassword"
              options={{
                headerShown: true,
                headerTitle: "",
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.text,
              }}
            />
            <Stack.Screen name="(validation)" />
        </Stack>
    );
}