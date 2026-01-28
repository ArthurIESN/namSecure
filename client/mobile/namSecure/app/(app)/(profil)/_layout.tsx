import { Stack } from 'expo-router';

export default function ProfilLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="profil"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="groupManagement"
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitle: "",
                    headerBackTitle: 'Profile',
                    animation: 'fade',
                    animationDuration: 100,
                }}
            />
            <Stack.Screen
                name="verifyPassword"
                options={{
                    headerShown: false,
                    animation: 'fade',
                    animationDuration: 300,
                }}
            />
            <Stack.Screen
                name="changePassword"
                options={{
                    headerShown: false,
                    animation: 'fade',
                    animationDuration: 300,
                }}
            />
        </Stack>
    );
}
