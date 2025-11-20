import { Stack } from 'expo-router';

export default function ProfilLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="explore" />
                name="explore"
                options={{ 
                    headerShown: false,
                }} 
            />
        </Stack>
    );
}

