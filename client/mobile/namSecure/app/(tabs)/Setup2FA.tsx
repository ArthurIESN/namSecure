import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image, ScrollView, Linking, Clipboard, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import TextInputField from '@/components/ui/fields/TextInputField';
import ConfirmationCodeField from '@/components/ui/fields/ConfirmationCodeField';
import ErrorMessageContainer from '@/components/ui/error/ErrorMessageContainer';
import Button from "@/components/ui/buttons/Button";
import { api, EAPI_METHODS, IApiResponse } from '@/utils/api/api';
import { router } from "expo-router";
import { useAuth } from '@/provider/AuthProvider';
import NativeBottomSheet from '@/components/ui/bottomSheet/NativeBottomSheet';
import NativeButton from "@/components/ui/buttons/NativeButton";
import { useSetup2FA } from '@/context/2fa/Setup2FAContext';
import ColorGradientSlider from "@/components/test/ColorGradientSlider";

interface Setup2FAResponse {
    secret: string;
    qrCode: string;
}

interface Verify2FAResponse {
    success: boolean;
    message?: string;
}

export default function Setup2FAScreen() {
    const [step, setStep] = useState<'init' | 'setup' | 'verify'>('init');
    const [secret, setSecret] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(true);

    const { refreshUser, user } = useAuth();
    const { setIsVisible } = useSetup2FA();

    const handleStartSetup = async (): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const response: IApiResponse<Setup2FAResponse> = await api(
                'auth/2fa/setup',
                EAPI_METHODS.GET
            );

            if (response.error) {
                setError(response.errorMessage || 'Failed to generate 2FA setup');
                return;
            }

            if (response.data) {
                setSecret(response.data.secret);
                setQrCode(response.data.qrCode);
                setStep('setup');
            }
        } catch (err) {
            setError('An error occurred while setting up 2FA');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndEnable = async (code: string): Promise<void> => {
        if (!code || code.length !== 6) {
            setError('Please enter a valid 6-digit code');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response: IApiResponse<Verify2FAResponse> = await api(
                'auth/2fa/setup',
                EAPI_METHODS.POST,
                { secret, code: code }
            );

            if (response.error) {
                setError(response.errorMessage || 'Invalid verification code');
                setVerificationCode('');
                return;
            }

            if (response.data) {
                setStep('verify');
                // Refresh user to update 2FA status
                await new Promise(resolve => setTimeout(resolve, 1000));
                void refreshUser();
                setIsBottomSheetOpen(false);
                setIsVisible(false);
            }
        } catch (err) {
            setError('An error occurred while verifying your code');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsBottomSheetOpen(false);
        setIsVisible(false);
    };

    const handleOpenAuthenticator = async () => {
        try {
            // Format OTPAuth URI (standard format for authenticator apps)
            // otpauth://totp/NamSecure:[email]?secret=[SECRET]&issuer=NamSecure
            const email = user?.email || 'user';
            const otpauthUri = `otpauth://totp/NamSecure:${email}?secret=${secret}&issuer=NamSecure`;

            // Copy secret to clipboard for manual entry
            await Clipboard.setString(secret);

            // Try to open the otpauth URI directly (works with most authenticator apps)
            try {
                await Linking.openURL(otpauthUri);
                Alert.alert('Success', 'Opening authenticator app. The secret has been copied to clipboard.');
                return;
            } catch (error) {
                console.log('Cannot open otpauth URI:', error);
            }

            // Fallback: alert user to manually enter the code
            Alert.alert('Secret Copied', 'The secret has been copied to your clipboard. You can now paste it in your authenticator app.');
        } catch (error) {
            Alert.alert('Error', 'Failed to prepare authenticator setup');
        }
    };

    useEffect(() =>
    {
        if(user?.twoFactorEnabled)
        {
            setStep('verify');
        }
    }, []);

    return (
        <NativeBottomSheet isOpen={isBottomSheetOpen} onClose={handleCancel} >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} scrollEnabled={true}>
                    <ErrorMessageContainer message={error} />
                    <View style={styles.setupContainer}>

                    {step === 'init' && (
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
                            <Text style={styles.cancelText} onPress={handleCancel}>
                                Cancel
                            </Text>
                        </>
                    )}

                        {step === 'setup' && (
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
                                        onComplete={(code) => {
                                            setVerificationCode(code);
                                            handleVerifyAndEnable(code);
                                        }}
                                        resetTrigger={false}
                                    />
                                </View>

                                {loading && (
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator size="small" color="#0000ff" />
                                        <Text style={styles.loadingText}>Verifying code...</Text>
                                    </View>
                                )}
                            </>
                        )}


                    {step === 'verify' && (
                        <>
                            <Text style={styles.successText}>✓ Two-Factor Authentication Enabled</Text>
                            <Text style={styles.descriptionText}>
                                Your account is now protected with Two-Factor Authentication. You'll be asked to enter a code from your authenticator app each time you log in.
                            </Text>
                        </>
                    )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </NativeBottomSheet>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: 0,
        marginHorizontal: 0,
        backgroundColor: 'transparent'
    },
    namSecure: {
        fontSize: 30,
        fontWeight: '600',
        textAlign: 'center',
        top: 0,
        alignSelf: 'center'
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        paddingTop: 0,
        paddingBottom: 40,
        backgroundColor: 'transparent'
    },
    setupContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: -50,
        paddingHorizontal: 30,
        backgroundColor: 'transparent'
    },
    titleText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 0,
        textAlign: 'center'
    },
    descriptionText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20
    },
    successText: {
        fontSize: 18,
        fontWeight: '600',
        color: 'green',
        textAlign: 'center',
        marginBottom: 20
    },
    qrContainer: {
        alignItems: 'center',
        marginVertical: 30,
        padding: 20,
        backgroundColor: 'transparent',
        borderRadius: 8
    },
    qrCode: {
        width: 250,
        height: 250,
        borderRadius: 8
    },
    openAuthButton: {
        marginTop: 15
    },
    codeFieldContainer: {
        marginVertical: 30,
        paddingHorizontal: 10
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15,
        gap: 10
    },
    loadingText: {
        fontSize: 14,
        color: '#666'
    },
    orContainer: {
        alignItems: 'center',
        marginVertical: 20
    },
    orText: {
        fontSize: 14,
        color: '#999',
        fontWeight: '600'
    },
    secretContainer: {
        padding: 15,
        backgroundColor: 'transparent',
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0'
    },
    secretText: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        color: '#333',
        fontFamily: 'monospace',
        letterSpacing: 2
    },
    cancelText: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
        textDecorationLine: 'underline',
        cursor: 'pointer'
    }
});

/*
 {step === 'setup' && (
                        <>
                            <Text style={styles.titleText}>Scan QR Code</Text>
                            <Text style={styles.descriptionText}>
                                Scan this QR code with Google Authenticator, Microsoft Authenticator, Authy, or any other authenticator app.
                            </Text>

                            {qrCode ? (
                                <View style={styles.qrContainer}>
                                    <Image
                                        source={{ uri: qrCode }}
                                        style={styles.qrCode}
                                    />
                                    <NativeButton
                                        title="Open Authenticator App"
                                        onPress={handleOpenAuthenticator}
                                        style={styles.openAuthButton}
                                    />
                                </View>
                            ) : (
                                <ActivityIndicator size="large" color="#0000ff" />
                            )}

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
                                    onComplete={(code) => {
                                        setVerificationCode(code);
                                        handleVerifyAndEnable(code);
                                    }}
                                    resetTrigger={false}
                                />
                            </View>

                            {loading && (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="small" color="#0000ff" />
                                    <Text style={styles.loadingText}>Verifying code...</Text>
                                </View>
                            )}

                            <Text style={styles.cancelText} onPress={handleCancel}>
                                Cancel
                            </Text>
                        </>
                    )}
 */
