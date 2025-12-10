import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import React, {useEffect} from "react";

import Setup2FA from '../../../components/twoFactor/Setup2FA';
import { Setup2FAProvider, useSetup2FA } from "@/context/2fa/Setup2FAContext";
import { useAuth } from "@/providers/AuthProvider";

function TabLayoutContent()
{

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
        <NativeTabs>
            <NativeTabs.Trigger name="index">
                <Icon sf="house.fill" drawable="custom_settings_drawable" />
                <Label>Home</Label>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="reportCreate">
                <Icon sf="plus.square" drawable="custom_settings_drawable" />
                <Label>Signaler</Label>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="profil">
                <Icon sf="bell" drawable="custom_settings_drawable" />
                <Label>Notifications</Label>
            </NativeTabs.Trigger>
        </NativeTabs>

        {isVisible && <Setup2FA />}

        </>
    );
}

export default function TabLayout() {
    return (
            <Setup2FAProvider>
                <TabLayoutContent />
            </Setup2FAProvider>
    );
}
