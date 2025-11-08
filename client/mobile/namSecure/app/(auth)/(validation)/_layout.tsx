import { ReactElement } from 'react';
import { Stack } from "expo-router";

export default function ValidationLayout(): ReactElement
{
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'white' }
            }}
        >
            <Stack.Screen name="EmailValidation" />
            <Stack.Screen name="IdValidation" />
            <Stack.Screen name="Verify2FA" />
        </Stack>
    );
}
