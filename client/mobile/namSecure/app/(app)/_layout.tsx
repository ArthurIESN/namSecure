import { Stack } from 'expo-router';

export default function AppLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="(profil)"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitle: "",
                    headerBackTitle: 'Maps',
                    animation: 'fade',
                    animationDuration: 250
                }}
            />
        </Stack>
    );
}
