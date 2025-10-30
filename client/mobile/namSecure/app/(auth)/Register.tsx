import React, {ReactElement, useState} from "react";
import {Platform, StyleSheet, Text, View} from "react-native";
import TextInputField from "@/components/ui/fields/TextInputField";
import Button from "@/components/ui/buttons/Button";
import Separator from "@/components/ui/separators/Separator";
import ButtonAppleConnect from "@/components/ui/buttons/ButtonAppleConnect";
import {api, EAPI_METHODS, IApiResponse} from "@/utils/api/api";
import {IRegisterScreenStyle} from "@/types/screens/auth/registerScreen";
import {router} from "expo-router";

export default function RegisterScreen(): ReactElement
{
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [registerError, setRegisterError] = useState<string | null>(null);

    const handleRegister = async (): Promise<void> =>
    {
        const registerResponse: Promise<IApiResponse<void>> = api('auth/register', EAPI_METHODS.POST , { email, password, address, password_confirmation: confirmPassword })

        registerResponse.then(async response =>
        {
            if (response.error)
            {
                setRegisterError(response.errorMessage || 'Registration failed');
                return;
            }
            setRegisterError(null);
            console.debug(response);
        });
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
                        <ButtonAppleConnect />
                    </>
                )}
                <Text style={styles.createAccount} onPress={() => router.push('/login')}>Already have an account ?</Text>
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