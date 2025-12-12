import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import React, {useEffect} from "react";
import Setup2FA from './Setup2FA';
import { Setup2FAProvider, useSetup2FA } from "@/context/2fa/Setup2FAContext";

function TabLayoutContent()
{

    const { isVisible, setIsVisible } = useSetup2FA();

    // auto open 2FA setup
    // @todo remove this
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 3000);
        return () => clearTimeout(timer);
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
            <NativeTabs.Trigger name="notifications">
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
