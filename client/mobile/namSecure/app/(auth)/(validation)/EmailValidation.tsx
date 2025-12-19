import React, {ReactElement, useEffect} from 'react';
import {View} from "react-native";
import Text from '@/components/ui/Text';
import {IconSymbol} from "@/components/ui/symbols/IconSymbol";
import ConfirmationCodeField from "@/components/ui/fields/ConfirmationCodeField";
import ErrorMessageContainer from "@/components/ui/error/ErrorMessageContainer";
import {api, EAPI_METHODS, IApiResponse} from "@/utils/api/api";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAuth} from "@/providers/AuthProvider";
import LoadingContainer from "@/components/ui/loading/LoadingContainer";
import { styles as createStyles } from "@/styles/screens/auth/validation/emailValidation";
import {useTheme} from "@/providers/ThemeProvider";

export default function EmailValidation(): ReactElement
{
    const { colorScheme } = useTheme();
    const styles = createStyles(colorScheme);

    const [emailError, setEmailError] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const { refreshUser, user } = useAuth();

    useEffect(() =>
    {
        loadEmail();
    }, []);

    const loadEmail = async (): Promise<void> =>
    {
        const response = await api('auth/register/email-validation', EAPI_METHODS.GET);
        if (response.error)
        {
            setEmailError(response.errorMessage || 'Failed to load email validation status');
            setIsLoading(false);
            return;
        }

        setIsLoading(false);
    }

    const handleVerify = async (code: string): Promise<void> =>
    {
        setEmailError(null);
        const response: IApiResponse<any> = await api('auth/register/email-validation', EAPI_METHODS.POST, { code });
        if (response.error)
        {
            setEmailError(response.errorMessage || 'Email verification failed');
            return;
        }

        if (response.data) {
            await refreshUser();
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.namSecure}>NamSecure</Text>
            </View>
            <View style={styles.emailContainer}>
                <View style={styles.emailInfoContainer}>
                    <IconSymbol name={"envelope.fill"} size={192} color={"black"} />
                    <ErrorMessageContainer message={emailError} />
                    <Text style={styles.confirmation}>Confirmation is required</Text>
                    <LoadingContainer visible={isLoading} />
                    {!isLoading && (
                        <>
                            <View style={styles.emailTextContainer}>
                                <Text>A 6-digit code has been sent at </Text>
                                <Text style={styles.emailAddress}>{user!.email}</Text>
                            </View>
                            <View style={styles.confirmationCodeField}>
                                <ConfirmationCodeField
                                    length={6}
                                    onComplete={handleVerify}
                                    resetTrigger={emailError !== null}
                                />
                            </View>
                        </>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}