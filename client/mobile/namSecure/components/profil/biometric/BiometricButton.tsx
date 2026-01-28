import {ReactElement, useEffect, useState, useCallback} from "react";
import GlassedProfileButton from "@/components/profil/GlassedProfileButton";
import {isBiometricEnabled, disableBiometric, enableBiometric, isBiometricAvailable} from "@/utils/biometric/biometricAuth";
import {router, useFocusEffect, useLocalSearchParams} from "expo-router";
import {useAuth} from "@/providers/AuthProvider";
import {Alert} from "react-native";


export default function BiometricButton(): ReactElement
{
    const [isEnabled, setIsEnabled] = useState<boolean>(false);
    const [passwordVerified, setPasswordVerified] = useState<boolean>(false);
    const { user } = useAuth();

    if(!user) return <></>;

    const params = useLocalSearchParams();

    async function enableBiometricAfterVerification(): Promise<void>
    {
        const password = params.password as string | undefined;
        if (password)
        {
            await enableBiometric(user!.email, password);
            setIsEnabled(true);
        }
    }

    async function checkBiometricStatus(): Promise<void>
    {
        const enabled: boolean = await isBiometricEnabled();
        setIsEnabled(enabled);
    }

    async function toggleBiometricStatus(): Promise<void>
    {
        if (isEnabled)
        {
            Alert.alert(
                "Disable Biometric Authentication",
                "Are you sure you want to disable biometric authentication?",
                [
                    { text: "Cancel", onPress: () => {}, style: "cancel" },
                    { text: "Disable", onPress: async () => {
                            await disableBiometric();
                            setIsEnabled(false);
                        }, style: "destructive" }
                ]
            );
            return;
        }
        else
        {
            const available: boolean = await isBiometricAvailable();

            if (!available)
            {
                alert("Biometric authentication is not available on this device.");
                return;
            }

            router.push({ pathname: "/(app)/(profil)/verifyPassword", params: { fromURL: "(app)/(profil)/profil" } });
        }
    }



    useEffect(() =>
    {
        if(params.passwordVerified === "true" && !isEnabled)
        {
            enableBiometricAfterVerification();
        }

        checkBiometricStatus();
    }, []);

    return (
        <GlassedProfileButton
            label={isEnabled ? "Disable Biometric" : "Enable Biometric"}
            onPress={toggleBiometricStatus}
            variant={isEnabled ? "danger" : "primary"}
        />
    );
}
