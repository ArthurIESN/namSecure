import React, {ReactElement, useState} from "react";
import {Platform, StyleSheet, Text, View, Alert} from "react-native";
import TextInputField from "@/components/ui/fields/TextInputField";
import Button from "@/components/ui/buttons/Button";
import Separator from "@/components/ui/separators/Separator";
import ButtonAppleConnect from "@/components/ui/buttons/ButtonAppleConnect";
import {api, EAPI_METHODS, IApiResponse} from "@/utils/api/api";
import {IRegisterScreenStyle} from "@/types/screens/auth/registerScreen";
import {router} from "expo-router";
import {isBiometricAvailable, enableBiometric} from "@/utils/biometric/biometricAuth";
import {useAuth} from "@/provider/AuthProvider";

export default function RegisterScreen(): ReactElement
{
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [registerError, setRegisterError] = useState<string | null>(null);

    const { refreshUser } = useAuth();

    const handleRegister = async (): Promise<void> =>
    {
        const response = await api('auth/register', EAPI_METHODS.POST , { email, password, address, password_confirmation: confirmPassword })

            if (response.error)
            {
                setRegisterError(response.errorMessage || 'Registration failed');
                return;
            }
            setRegisterError(null);
            console.debug(response);

            // Check if biometric is available and show alert
            const biometricAvailable = await isBiometricAvailable();

            console.log(biometricAvailable);
            if (biometricAvailable)
            {
                Alert.alert
                (
                    'Biometric Authentication',
                    'Enable biometric authentication',
                    [
                        {
                            text: 'Not Now',
                            onPress: async () => { void refreshUser(); },
                            style: 'cancel',
                        },
                        {
                            text: 'Enable',
                            onPress: async () =>
                            {
                                await enableBiometric(email, password);
                                await new Promise(resolve => setTimeout(resolve, 1000));
                                void refreshUser();
                            },
                            style: 'default',
                        },
                    ]
                );
            }
            else
            {
                void refreshUser();
            }
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.namSecure}>NamSecure</Text>
            </View>
            <View style={styles.loginContainer}>
                {registerError && (
                    <Text style={styles.errorText}>{registerError}</Text>
                )}
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
                <Button title="Create an account" onPress={handleRegister} />
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
        </View>
    );
};

const styles: IRegisterScreenStyle = StyleSheet.create({
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
        marginBottom: 40,
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