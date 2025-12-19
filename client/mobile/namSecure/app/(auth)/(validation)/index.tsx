import { Redirect } from 'expo-router';
import { useAuth } from "@/providers/AuthProvider";

export default function ValidationIndex()
{
    const { authState } = useAuth();

    if (authState === "EMAIL_NOT_VERIFIED") {
        return <Redirect href="/(auth)/(validation)/EmailValidation" />;
    }

    if (authState === "ID_CARD_NOT_VERIFIED") {
        return <Redirect href="/(auth)/(validation)/IdValidation" />;
    }

    return <Redirect href="/(auth)" />;
}