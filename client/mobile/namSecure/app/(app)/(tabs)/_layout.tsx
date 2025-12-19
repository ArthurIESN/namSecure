import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import React, {useEffect} from "react";
import { Text, StyleSheet } from "react-native";
import { useSetup2FA } from "@/context/2fa/Setup2FAContext";
import { useAuth } from "@/providers/AuthProvider";
import {Tabs} from "expo-router";

export default function TabLayout()
{
    return (
        <NativeTabs backgroundColor="transparent">
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
    );
}
/*
// try with default tab layout
export default function TabLayout()
{
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
                sceneStyle: { backgroundColor: 'transparent' },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Text>🏠</Text>,
                }}
            />
            <Tabs.Screen
                name="reportCreate"
                options={{
                    title: 'Signaler',
                    tabBarIcon: ({ color }) => <Text>➕</Text>,
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    title: 'Notifications',
                    tabBarIcon: ({ color }) => <Text>🔔</Text>,
                }}
            />
        </Tabs>
    );
}*/
