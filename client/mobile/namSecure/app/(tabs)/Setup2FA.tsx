import React, { useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image, ScrollView } from 'react-native';
import TextInputField from '@/components/ui/fields/TextInputField';
import Button from "@/components/ui/buttons/Button";
import { api, EAPI_METHODS, IApiResponse } from '@/utils/api/api';
import { router } from "expo-router";
import { useAuth } from '@/provider/AuthProvider';

interface Setup2FAResponse {
    secret: string;
    qrCode: string;
}

interface Verify2FAResponse {
    success: boolean;
    message?: string;
}

const Setup2FAScreen = () => {
    const [step, setStep] = useState<'init' | 'setup' | 'verify'>('init');
    const [secret, setSecret] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { refreshUser } = useAuth();

    const handleStartSetup = async (): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const response: IApiResponse<Setup2FAResponse> = await api(
                'auth/2fa/setup',
                EAPI_METHODS.POST,
                {}
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

    const handleVerifyAndEnable = async (): Promise<void> => {
        if (!verificationCode || verificationCode.length !== 6) {
            setError('Please enter a valid 6-digit code');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response: IApiResponse<Verify2FAResponse> = await api(
                'auth/2fa/verify',
                EAPI_METHODS.POST,
                { secret, code: verificationCode }
            );

            if (response.error) {
                setError(response.errorMessage || 'Invalid verification code');
                return;
            }

            if (response.data) {
                setStep('verify');
                // Refresh user to update 2FA status
                await new Promise(resolve => setTimeout(resolve, 1000));
                void refreshUser();
                router.back();
            }
        } catch (err) {
            setError('An error occurred while verifying your code');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.namSecure}>NamSecure</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.setupContainer}>
                    {error && (
                        <Text style={styles.errorText}>{error}</Text>
                    )}

                    {step === 'init' && (
                        <>
                            <Text style={styles.titleText}>Enable Two-Factor Authentication</Text>
                            <Text style={styles.descriptionText}>
                                Two-Factor Authentication adds an extra layer of security to your account. You'll need to enter a code from your authenticator app when logging in.
                            </Text>
                            <Button
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

                            <TextInputField
                                value={verificationCode}
                                onChangeText={(code) => {
                                    // Only allow numbers
                                    const numericCode = code.replace(/[^0-9]/g, '');
                                    setVerificationCode(numericCode);
                                }}
                                placeholder="000000"
                                keyboardType="numeric"
                                maxLength={6}
                            />

                            <Button
                                title={loading ? "Verifying..." : "Verify and Enable 2FA"}
                                onPress={handleVerifyAndEnable}
                                disabled={loading || verificationCode.length !== 6}
                            />

                            <Text style={styles.cancelText} onPress={handleCancel}>
                                Cancel
                            </Text>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: 16,
        marginHorizontal: 8,
        backgroundColor: 'white'
    },
    namSecure: {
        fontSize: 30,
        fontWeight: '600',
        textAlign: 'center',
        position: 'absolute',
        top: 60,
        alignSelf: 'center'
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 20
    },
    setupContainer: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 80,
        paddingHorizontal: 10
    },
    titleText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center'
    },
    descriptionText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
        backgroundColor: '#ffe6e6',
        padding: 10,
        borderRadius: 8,
        overflow: 'hidden'
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
        backgroundColor: '#f5f5f5',
        borderRadius: 8
    },
    qrCode: {
        width: 250,
        height: 250,
        borderRadius: 8
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
        backgroundColor: '#f5f5f5',
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

export default Setup2FAScreen;
