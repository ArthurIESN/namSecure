import { Stack } from 'expo-router';
import React, {useEffect} from 'react';
import Setup2FA from '@/components/twoFactor/Setup2FA';
import { Setup2FAProvider, useSetup2FA } from '@/context/2fa/Setup2FAContext';
import {Icon, Label, NativeTabs} from "expo-router/unstable-native-tabs";
import {useAuth} from "@/providers/AuthProvider";

function AppLayoutContent() {
    const { isVisible, setIsVisible } = useSetup2FA();
    const { getLastLoginDate, user } = useAuth();

    async function check2FASetup()
    {
        const lastLoginDate: Date | null = await getLastLoginDate();
        const now = new Date();

        if(user && user.twoFactorEnabled) return;

        if (lastLoginDate)
        {
            const diffMs: number = now.getTime() - lastLoginDate.getTime();
            const diffMins: number = Math.floor(diffMs / 60000);

            if (diffMins < 2)
            {
                setIsVisible(true);
            }
        }
        else
        {
            setIsVisible(true);
        }
    }

    useEffect(() =>
    {
        check2FASetup();
    }, []);


    return (
        <>
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
            {isVisible && <Setup2FA />}
        </>
    );
}

export default function AppLayout() {
    return (
        <Setup2FAProvider>
            <AppLayoutContent />
        </Setup2FAProvider>
    );
}
