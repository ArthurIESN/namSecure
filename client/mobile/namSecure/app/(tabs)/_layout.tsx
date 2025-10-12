import { zIndex } from '@expo/ui/swift-ui/modifiers';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
    return (
        <NativeTabs>
            <NativeTabs.Trigger name="index">
                <Icon sf="map" drawable="custom_settings_drawable" />
                <Label>Il est PD</Label>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="explore">
                <Label>Grégory</Label>
                <Icon sf="house.fill" drawable="custom_android_drawable" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="auth/Login">
                <Label>TEST</Label>
                <Icon sf="testtube.2" drawable="custom_android_drawable" />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
