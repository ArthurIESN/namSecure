import React, { ReactElement, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { IRegisterScreenStyle } from "@/types/screens/auth/register";
import {router} from "expo-router";
import ButtonAppleConnect from "@/components/ui/buttons/ButtonAppleConnect";
import TextInputField from "@/components/ui/fields/TextInputField";
import {api, EAPI_METHODS} from "@/utils/api/api";
import * as AppleAuthentication from 'expo-apple-authentication';
import {useAuth} from "@/provider/AuthProvider";

export default function RegisterAppleScreen(): ReactElement {
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [address, setAddress] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { refreshUser} = useAuth();

    const handleAppleRegister = async (): Promise<void> =>
    {
        try {
            setIsLoading(true);
            setRegisterError(null);

            // Récupérer le credential Apple
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            // Envoyer les infos au backend
            const response = await api(
                'auth/apple',
                EAPI_METHODS.POST,
                {
                    identityToken: credential.identityToken,
                    address: address
                }
            );

            if (response.error) {
                setRegisterError(response.errorMessage || 'Registration failed');
                setIsLoading(false);
                return;
            }

            setRegisterError(null);
            void refreshUser();
            setIsLoading(false);
        } catch (e: any) {
            if (e.code === 'ERR_CANCELED') {
                setRegisterError(null);
            } else {
                setRegisterError(e.message || 'Apple registration failed');
            }
            setIsLoading(false);
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

                <Text style={styles.loginText}>Create an account with Apple</Text>

                <TextInputField
                    value={address}
                    onChangeText={setAddress}
                    placeholder={"Address"}
                />
                <ButtonAppleConnect
                    onClick={() => handleAppleRegister()}
                />

            </View>
        </View>
    );
}

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