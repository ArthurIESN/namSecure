import React, { ReactElement, useState } from 'react';
import { View, ActivityIndicator, Linking, Alert } from 'react-native';
import Text from '@/components/ui/Text';
import ConfirmationCodeField from '@/components/ui/fields/ConfirmationCodeField';
import NativeButton from '@/components/ui/buttons/NativeButton';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '@/providers/ThemeProvider';
import { styles as createStyles } from '@/styles/screens/app/setup2fa';
import { api, EAPI_METHODS, IApiResponse } from '@/utils/api/api';
import { useAuth } from '@/providers/AuthProvider';
import { ITwoFactorStepProps } from '@/types/components/twoFactor/twoFactor';

interface Verify2FAResponse {
    success: boolean;
    message?: string;
}

export const SetupTwoFactor = (props: ITwoFactorStepProps): ReactElement =>
{
    const { colorScheme } = useTheme();
    const { user } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [secret, setSecret] = useState<string>('');
    const [step, setStep] = useState<'init' | 'setup'>('init');
    const styles = createStyles(colorScheme);

    const handleStartSetup = async (): Promise<void> => {
        setLoading(true);

        try {
            const response = await api(
                'auth/2fa/setup?codeQR=false',
                EAPI_METHODS.GET
            );

            if (response.error) {
                props.showError(response.errorMessage || 'Failed to generate 2FA setup');
                setLoading(false);
                return;
            }

            setSecret(response.data!.secret);
            setStep('setup');
            setLoading(false);
        } catch (err) {
            props.showError('An error occurred while setting up 2FA');
            setLoading(false);
        }
    };

    const handleOpenAuthenticator = async () => {
        try {
            const email = user?.email || 'user';
            const otpauthUri = `otpauth://totp/NamSecure:${email}?secret=${secret}&issuer=NamSecure`;

            console.debug('Generated otpauth URI:', otpauthUri);

            await Clipboard.setStringAsync(secret);

            try {
                await Linking.openURL(otpauthUri);
                Alert.alert('Success', 'Opening authenticator app. The secret has been copied to clipboard.');
                return;
            } catch (error) {
                console.log('Cannot open otpauth URI:', error);
            }
        } catch (error: any) {
            Alert.alert('Error', 'Failed to prepare authenticator setup');
        }
    };

    const handleVerifyAndEnable = async (code: string): Promise<void> => {
        if (!code || code.length !== 6) {
            props.showError('Please enter a valid 6-digit code');
            return;
        }

        setLoading(true);

        try {
            const response: IApiResponse<Verify2FAResponse> = await api(
                'auth/2fa/setup',
                EAPI_METHODS.POST,
                { secret: secret, code: code }
            );

            setLoading(false);

            if (response.error) {
                props.showError(response.errorMessage || 'Invalid verification code');
                setVerificationCode('');
                return;
            }

            props.nextStep('verify');
        } catch (err) {
            setLoading(false);
            props.showError('An error occurred while verifying your code');
        }
    };

    if (step === 'init') {
        return (
            <>
                <Text style={styles.titleText}>Enable Two-Factor Authentication</Text>
                <Text style={styles.descriptionText}>
                    Two-Factor Authentication adds an extra layer of security to your account. You'll need to enter a code from your authenticator app when logging in.
                </Text>
                <NativeButton
                    title={loading ? "Generating..." : "Start Setup"}
                    onPress={handleStartSetup}
                    disabled={loading}
                />
                <Text style={{ height: 30 }}>
                </Text>
            </>
        );
    }

    return (
        <>
            <NativeButton
                title="Open Authenticator App"
                onPress={handleOpenAuthenticator}
            />

            <View style={styles.orContainer}>
                <Text style={styles.orText}>OR</Text>
            </View>

            <Text style={styles.descriptionText}>
                Enter this code manually:
            </Text>
            <View style={styles.secretContainer}>
                <Text style={styles.secretText} selectable={true}>
                    {secret}
                </Text>
            </View>

            <Text style={styles.descriptionText}>
                After scanning or entering the code, enter the 6-digit code displayed in your authenticator app:
            </Text>

            <View style={styles.codeFieldContainer}>
                <ConfirmationCodeField
                    length={6}
                    onComplete={(code: string) => {
                        setVerificationCode(code);
                        handleVerifyAndEnable(code);
                    }}
                    resetTrigger={verificationCode}
                />
            </View>

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#0000ff" />
                    <Text style={styles.loadingText}>Verifying code...</Text>
                </View>
            )}
        </>
    );
};
