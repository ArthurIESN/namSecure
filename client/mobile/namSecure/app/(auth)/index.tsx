import { Redirect } from 'expo-router';
import { useAuth } from "@/provider/AuthProvider";

export default function AuthIndex() {
    const { authState } = useAuth();

    if (authState === "EMAIL_NOT_VERIFIED") {
        return <Redirect href="/(auth)/(validation)/EmailValidation" />;
    }

    if (authState === "ID_CARD_NOT_VERIFIED") {
        return <Redirect href="/(auth)/(validation)/IdValidation" />;
    }

    return <Redirect href="/(auth)/Login" />;
}