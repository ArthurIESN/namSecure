import { ReactElement } from 'react';
import { Stack } from "expo-router";

export default function ErrorsLayout(): ReactElement {
    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'white' } }}>
            <Stack.Screen name="serverUnavailable" />
        </Stack>
    );
}
