import React, {ReactElement, useState} from "react";
import {Platform, Text, View, Alert} from "react-native";
import TextInputField from "@/components/ui/fields/TextInputField";
import ErrorMessageContainer from "@/components/ui/error/ErrorMessageContainer";
import Button from "@/components/ui/buttons/Button";
import Separator from "@/components/ui/separators/Separator";
import ButtonAppleConnect from "@/components/ui/buttons/ButtonAppleConnect";
import {api, EAPI_METHODS, IApiResponse} from "@/utils/api/api";
import {router} from "expo-router";
import {isBiometricAvailable, enableBiometric} from "@/utils/biometric/biometricAuth";
import {useAuth} from "@/providers/AuthProvider";
import {SafeAreaView} from "react-native-safe-area-context";
import emailValidator from 'email-validator';
import {styles} from '@/styles/screens/auth/register';

export default function RegisterScreen(): ReactElement
{
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { refreshUser } = useAuth();

    const handleRegister = async (): Promise<void> => {
        setRegisterError(null);
        setIsLoading(true);

        if (email.trim() === '') {
            setRegisterError('Email is required');
            setIsLoading(false);
            return;
        }

        if (!emailValidator.validate(email)) {
            setRegisterError('Email format is invalid');
            setIsLoading(false);
            return;
        }

        if (address.trim() === '') {
            setRegisterError('Address is required');
            setIsLoading(false);
            return;
        }

        if (password.trim() === '') {
            setRegisterError('Password is required');
            setIsLoading(false);
            return;
        }

        if (confirmPassword.trim() === '') {
            setRegisterError('Password confirmation is required');
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setRegisterError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        const response = await api('auth/register', EAPI_METHODS.POST, {
            email,
            password,
            address,
            password_confirmation: confirmPassword
        });

        if (response.error) {
            setRegisterError(response.errorMessage || 'Registration failed');
            setIsLoading(false);
            return;
        }

        if (response.data) {
            console.debug(response);

            // Check if biometric is available and show alert
            const biometricAvailable = await isBiometricAvailable();

            if (biometricAvailable) {
                Alert.alert(
                    'Biometric Authentication',
                    'Enable biometric authentication',
                    [
                        {
                            text: 'Not Now',
                            onPress: async () => {
                                setIsLoading(false);
                                void refreshUser();
                            },
                            style: 'cancel',
                        },
                        {
                            text: 'Enable',
                            onPress: async () => {
                                await enableBiometric(email, password);
                                await new Promise(resolve => setTimeout(resolve, 1000));
                                setIsLoading(false);
                                void refreshUser();
                            },
                            style: 'default',
                        },
                    ]
                );
            } else {
                setIsLoading(false);
                void refreshUser();
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.namSecure}>NamSecure</Text>
            </View>
            <View style={styles.loginContainer}>
                <ErrorMessageContainer message={registerError} />
                <Text style={styles.loginText}>Create an account</Text>
                <TextInputField
                    value={email}
                    onChangeText={setEmail}
                    placeholder={"Address Email"}
                    keyboardType={"email-address"}
                    autoCapitalize={"none"}
                    autoComplete={"email"}
                />
                <TextInputField
                    value={address}
                    onChangeText={setAddress}
                    placeholder={"Address"}
                />
                <TextInputField
                    value={password}
                    onChangeText={setPassword}
                    placeholder={"Password"}
                    autoCapitalize={"none"}
                    secureTextEntry={true}
                />
                <TextInputField
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder={"Confirm Password"}
                    autoCapitalize={"none"}
                    secureTextEntry={true}
                />
                <Button
                    title="Create an account"
                    onPress={handleRegister}
                    loading={isLoading}
                    loadingText="Creating account..."
                />
                {Platform.OS === 'ios' && (
                    <>
                        <Separator text="or" style={{ marginVertical: 30 }} />
                        <ButtonAppleConnect
                            onClick={() => router.push('/(auth)/RegisterApple')}
                        />
                    </>
                )}
                <Text style={styles.createAccount} onPress={() => router.push('/Login')}>Already have an account ?</Text>
            </View>
        </SafeAreaView>
    );
};