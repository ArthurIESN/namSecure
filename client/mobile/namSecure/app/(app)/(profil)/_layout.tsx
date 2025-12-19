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
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="verifyPassword"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}
