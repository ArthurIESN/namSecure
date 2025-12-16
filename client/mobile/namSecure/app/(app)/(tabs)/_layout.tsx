import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import React, {useEffect} from "react";
import { useSetup2FA } from "@/context/2fa/Setup2FAContext";
import { useAuth } from "@/providers/AuthProvider";

export default function TabLayout()
{
    return (
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
    );
}
