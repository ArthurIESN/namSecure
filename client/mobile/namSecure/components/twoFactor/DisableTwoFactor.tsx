import React, {ReactElement, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import Text from '@/components/ui/Text';
import ConfirmationCodeField from '@/components/ui/fields/ConfirmationCodeField';
import {useTheme} from '@/providers/ThemeProvider';
import {styles as createStyles} from '@/styles/screens/app/setup2fa';
import {api, EAPI_METHODS} from "@/utils/api/api";
import {isLoading} from "expo-font";
import {ITwoFactorStepProps} from "@/types/components/twoFactor/twoFactor";



export const DisableTwoFactor = (props: ITwoFactorStepProps): ReactElement =>
{
    const { colorScheme } = useTheme();
    const [loading, setLoading] = useState<boolean>(false);
    const styles = createStyles(colorScheme);

    async function handleCodeComplete(code: string): Promise<void>
    {
        setLoading(true);

        const response = await api('auth/2fa/disable', EAPI_METHODS.POST,
            {
                code: code
            });

        setLoading(false);

        if (response.error)
        {
            props.showError(response.errorMessage || "An error occurred while disabling Two-Factor Authentication.");
            return;
        }

        props.nextStep("disabled");
    }

    return (
        <>
            <Text style={styles.titleText}>Disable Two-Factor Authentication</Text>
            <Text style={styles.descriptionText}>
                Enter the 6-digit code from your authenticator app to disable Two-Factor Authentication:
            </Text>

            <View style={styles.codeFieldContainer}>
                <ConfirmationCodeField
                    length={6}
                    onComplete={(code: string) =>
                    {
                        handleCodeComplete(code);
                    }}
                />
            </View>

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#0000ff" />
                    <Text style={styles.loadingText}>Disabling 2FA...</Text>
                </View>
            )}
        </>
    );
};