import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import React from "react";

export default function TabLayout() {
    return (
        <NativeTabs backgroundColor={null}>
            <NativeTabs.Trigger name="index">
                <Icon sf="map" drawable="custom_settings_drawable" />
                <Label>Map</Label>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="reportCreate">
                <Icon sf="plus.square" drawable="custom_settings_drawable" />
                <Label>Report</Label>
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
