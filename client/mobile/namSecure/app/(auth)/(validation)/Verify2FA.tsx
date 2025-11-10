import React, {ReactElement, useState} from 'react';
import {Text, View} from "react-native";
import ConfirmationCodeField from "@/components/ui/fields/ConfirmationCodeField";
import ErrorMessageContainer from "@/components/ui/error/ErrorMessageContainer";
import {api, EAPI_METHODS, IApiResponse} from "@/utils/api/api";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAuth} from "@/provider/AuthProvider";
import {styles} from "@/styles/screens/auth/verify2fa";

export default function Verify2FA(): ReactElement {
    const [error2FA, setError2FA] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { refreshUser } = useAuth();

    const handleVerify = async (code: string): Promise<void> => {
        setError2FA(null);
        setIsLoading(true);

        const response: IApiResponse<any> = await api('auth/2fa/verify', EAPI_METHODS.POST, { code });

        if (response.error) {
            setError2FA(response.errorMessage || '2FA verification failed');
            setIsLoading(false);
            return;
        }

        if (response.data) {
            await refreshUser();
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Two-Factor Authentication</Text>
                <Text style={styles.subtitle}>Enter the 6-digit code from your authenticator app</Text>

                <ErrorMessageContainer message={error2FA} />

                <ConfirmationCodeField
                    onComplete={handleVerify}
                    length={6}
                    resetTrigger={error2FA}
                />
            </View>
        </SafeAreaView>
    );
}
