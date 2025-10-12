import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
    return (
        <NativeTabs>
            <NativeTabs.Trigger name="index">
                <Icon sf="map" drawable="custom_settings_drawable" />
                <Label>Map</Label>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="explore">
                <Label>Grégory</Label>
                <Icon sf="dog" drawable="custom_android_drawable" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="auth/Login">
                <Label>TEST</Label>
                <Icon sf="testtube.2" drawable="custom_android_drawable" />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
