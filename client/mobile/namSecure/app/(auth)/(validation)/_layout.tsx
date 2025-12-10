import { ReactElement } from 'react';
import { Stack } from "expo-router";
import { useTheme } from "@/providers/ThemeProvider";
import { Colors } from '@/constants/theme';

export default function ValidationLayout(): ReactElement
{
    const { colorScheme } = useTheme();
    const colors = Colors[colorScheme];

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background }
            }}
        >
            <Stack.Screen name="EmailValidation" />
            <Stack.Screen name="IdValidation" />
            <Stack.Screen name="Verify2FA" />
        </Stack>
    );
}
