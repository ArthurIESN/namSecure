import React, {useState, useEffect} from 'react';
import {Platform, Text, View} from 'react-native';
import TextInputField from '@/components/ui/fields/TextInputField';
import ErrorMessageContainer from '@/components/ui/error/ErrorMessageContainer';
import Button from "@/components/ui/buttons/Button";
import ButtonAppleConnect from "@/components/ui/buttons/ButtonAppleConnect";
import Separator from "@/components/ui/separators/Separator";
import {api, EAPI_METHODS, IApiResponse} from '@/utils/api/api';
import { storeToken} from "@/services/auth/authServices";
import { router } from "expo-router";
import { useAuth } from '@/providers/AuthProvider';
import { isBiometricEnabled, loginWithBiometric } from '@/utils/biometric/biometricAuth';
import {SafeAreaView} from "react-native-safe-area-context";
import emailValidator from 'email-validator';
import {styles} from '@/styles/screens/auth/login';
import {IAuthLoginBiometric} from "@/types/auth/auth";

export default function LoginScreen()
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState<string | null>(null);
    const [useBiometric, setUseBiometric] = useState(true);
    const [biometricAttempted, setBiometricAttempted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { refreshUser } = useAuth();

    useEffect(() =>
    {
        const tryBiometricLogin = async (): Promise<void> =>
        {
            const enabled: boolean = await isBiometricEnabled();
            if (enabled && !biometricAttempted)
            {
                setBiometricAttempted(true);
                const credentials: IAuthLoginBiometric | null = await loginWithBiometric();
                if (credentials)
                {
                    // Login with biometric credentials
                    setIsLoading(true);
                    const response: IApiResponse<undefined> = await api('auth/login', EAPI_METHODS.POST, {
                        email: credentials.email,
                        password: credentials.password
                    });

                    if (response.error)
                    {
                        setLoginError(response.errorMessage || 'Login failed');
                        setUseBiometric(false);
                        setIsLoading(false);
                        return;
                    }

                    await refreshUser();
                    setIsLoading(false);

                } else
                {
                    setUseBiometric(false);
                }
            }
            else if (!enabled)
            {
                setUseBiometric(false);
            }
        };

        tryBiometricLogin();
    }, []);


    const handleLogin = async (): Promise<void> =>
    {
        setLoginError(null);
        setIsLoading(true);

        if (email.trim() === '')
        {
            setLoginError('Email is required');
            setIsLoading(false);
            return;
        }

        if (!emailValidator.validate(email))
        {
            setLoginError('Email format is invalid');
            setIsLoading(false);
            return;
        }

        if (password.trim() === '')
        {
            setLoginError('Password is required');
            setIsLoading(false);
            return;
        }

        const response = await api('auth/login', EAPI_METHODS.POST, { email, password });

        if (response.error) {
            setLoginError(response.errorMessage || 'Login failed');
            setIsLoading(false);
            return;
        }

        if (response.data) {
            await refreshUser();
            setIsLoading(false);
        }
    };

    const handleAppleLogin = async (): Promise<void> =>
    {
        // @todo
    }

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
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.namSecure}>NamSecure</Text>
            </View>
            <View style={styles.loginContainer}>
                <ErrorMessageContainer message={loginError} />
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
                <Button
                    title="Login"
                    onPress={handleLogin}
                    loading={isLoading}
                    loadingText="Logging in..."
                />

                <Text style={styles.createAccount} onPress={() => router.push('/SendResetPassword')}>
                    Forgot your password ?
                </Text>

                {Platform.OS === 'ios' && (
                    <>
                        <Separator text="or" style={{ marginVertical: 30 }} />
                        <ButtonAppleConnect onClick={handleAppleLogin} />
                    </>
                )}
                <Text style={styles.createAccount} onPress={() => router.push('/Register')}>
                    No NamSecure account yet ?
                </Text>
            </View>

        </SafeAreaView>
    );
};
