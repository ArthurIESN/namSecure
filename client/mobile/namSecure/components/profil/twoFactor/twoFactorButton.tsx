import {ReactElement, useState} from "react";
import GlassedProfileButton from "@/components/profil/GlassedProfileButton";
import {useAuth} from "@/providers/AuthProvider";
import {useSetup2FA} from "@/context/2fa/Setup2FAContext";
import {Alert} from "react-native";
import {api} from "@/utils/api/api";


export default function TwoFactorButton(): ReactElement
{
    const { user } = useAuth();
    const { setDisable, setIsVisible } = useSetup2FA();

    const handleToggle = async () =>
    {
        if(user?.twoFactorValidated)
        {
            setDisable(true);
            setIsVisible(true);
        }
        else
        {
            setIsVisible(true);
        }
    };

    return (
        <GlassedProfileButton
            label={user?.twoFactorValidated ? "Disable Two-Factor" : "Enable Two-Factor"}
            onPress={handleToggle}
            icon={user?.twoFactorValidated ? "checkmark.2" : "number"}
            variant={user?.twoFactorValidated ? "danger" : "primary"}
        />
    );
}
