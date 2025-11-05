import React, {useState, useEffect} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import TextInputField from '@/components/ui/fields/TextInputField';
import Button from "@/components/ui/buttons/Button";
import ButtonAppleConnect from "@/components/ui/buttons/ButtonAppleConnect";
import Separator from "@/components/ui/separators/Separator";
import {api, EAPI_METHODS, IApiResponse} from '@/utils/api/api';
import { storeToken} from "@/services/auth/authServices";
import { router } from "expo-router";
import { useAuth } from '@/provider/AuthProvider';
import { isBiometricEnabled, loginWithBiometric } from '@/utils/biometric/biometricAuth';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState<string | null>(null);
    const [useBiometric, setUseBiometric] = useState(true);
    const [biometricAttempted, setBiometricAttempted] = useState(false);

    const { refreshUser } = useAuth();

    useEffect(() => {
        const tryBiometricLogin = async () => {
            const enabled = await isBiometricEnabled();
            if (enabled && !biometricAttempted) {
                setBiometricAttempted(true);
                const credentials = await loginWithBiometric();
                if (credentials) {
                    // Login with biometric credentials
                    const loginResponse = await api('auth/login', EAPI_METHODS.POST, {
                        email: credentials.email,
                        password: credentials.password
                    });

                    if (loginResponse.error) {
                        setLoginError(loginResponse.errorMessage || 'Login failed');
                        setUseBiometric(false);
                        return;
                    }
                    if (loginResponse.data) {
                        void refreshUser();
                    }
                } else {
                    // Biometric failed, show manual login
                    setUseBiometric(false);
                }
            } else if (!enabled) {
                setUseBiometric(false);
            }
        };

        tryBiometricLogin();
    }, []);


    const handleLogin = async (): Promise<void> =>
    {
        const loginResponse: Promise<IApiResponse<{ token: string }>> = api('auth/login', EAPI_METHODS.POST , { email, password });
        loginResponse.then(async response =>
        {
            if (response.error)
            {
                setLoginError(response.errorMessage || 'Login failed');
                return;
            }
            if (response.data)
            {
                void refreshUser();
            }
        });


    };

    if (useBiometric && !biometricAttempted) {
        return (
            <View style={styles.container}>
                <View>
                    <Text style={styles.namSecure}>NamSecure</Text>
                </View>
                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Authenticating...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.namSecure}>NamSecure</Text>
            </View>
            <View style={styles.loginContainer}>
                {loginError && (
                    <Text style={styles.errorText}>{loginError}</Text>
                )}
                <Text style={styles.loginText}>Login</Text>
                <TextInputField
                    value={email}
                    onChangeText={setEmail}
                    placeholder={"Address Email"}
                    keyboardType={"email-address"}
                    autoCapitalize={"none"}
                    autoComplete={"email"}
                />
                <TextInputField
                    value={password}
                    onChangeText={setPassword}
                    placeholder={"Password"}
                    autoCapitalize={"none"}
                    secureTextEntry={true}
                />
                <Button title="Login" onPress={handleLogin} />

                <Text style={styles.createAccount} onPress={() => router.push('/ResetPassword')}>
                    Forgot your password ?
                </Text>

                {Platform.OS === 'ios' && (
                    <>
                        <Separator text="or" style={{ marginVertical: 30 }} />
                        <ButtonAppleConnect />
                    </>
                )}
                <Text style={styles.createAccount} onPress={() => router.push('/Register')}>
                    No NamSecure account yet ?
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: 16,
        marginHorizontal: 8,
    },
    namSecure: {
        fontSize: 30,
        fontWeight: '600',
        textAlign: 'center',
        position: 'absolute',
        top: 120,
        alignSelf: 'center'
    },
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        top: 20
    },
    loginText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center'
    },
    createAccount: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginTop: 40,
        textDecorationLine: 'underline',
        cursor: 'pointer',
    },
    errorText: {
        position: 'absolute',
        top: 180,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'red',
        fontSize: 14
    }
});

export default LoginScreen;
