import { Redirect } from 'expo-router';
import { useAuth } from "@/provider/AuthProvider";
import { EAuthState } from "@/types/auth/auth";

export default function AuthIndex() {
    const { authState } = useAuth();

    if (authState === EAuthState.EMAIL_NOT_VERIFIED) {
        return <Redirect href="/(auth)/(validation)/EmailValidation" />;
    }

    if (authState === EAuthState.ID_CARD_NOT_VERIFIED) {
        return <Redirect href="/(auth)/(validation)/IdValidation" />;
    }

    if (authState === EAuthState.TWO_FACTOR_NOT_VERIFIED) {
        return <Redirect href="/(auth)/(validation)/Verify2FA" />;
    }

    return <Redirect href="/(auth)/Login" />;
}