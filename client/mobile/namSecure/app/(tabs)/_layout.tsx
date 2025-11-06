import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import {useAuth} from "@/context/auth/AuthContext";
import {Redirect} from "expo-router";

export default function TabLayout() {



    return (
        <NativeTabs>
            <NativeTabs.Trigger name="index">
                <Icon sf="house.fill" drawable="custom_settings_drawable" />
                <Label>Home</Label>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="Setup2FA">
                <Label>Arthur</Label>
                <Icon sf="house.fill" drawable="custom_android_drawable" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="eventCreate">
                <Icon sf="plus.square" drawable="custom_settings_drawable" />
                <Label>Signaler</Label>
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
