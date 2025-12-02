import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import {useAuth} from "@/context/auth/AuthContext";
import React, {useEffect} from "react";
import Setup2FA from './Setup2FA';
import {Redirect} from "expo-router";
import { Setup2FAProvider, useSetup2FA } from "@/context/2fa/Setup2FAContext";
import { MapProvider } from "@/context/map/MapContext";

function TabLayoutContent() {

    const { isVisible, setIsVisible } = useSetup2FA();

    // delay de 3 secondes puis ouvrir le modal
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
            <NativeTabs.Trigger name="profil">
                <Icon sf="person.circle" drawable="custom_settings_drawable" />
                <Label>Profil</Label>
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
