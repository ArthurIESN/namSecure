import React, { ReactElement, useState } from "react";
import { View } from "react-native";
import Text from "@/components/ui/Text";
import ErrorMessageContainer from "@/components/ui/error/ErrorMessageContainer";
import ButtonAppleConnect from "@/components/ui/buttons/ButtonAppleConnect";
import TextInputField from "@/components/ui/fields/TextInputField";
import { api, EAPI_METHODS } from "@/utils/api/api";
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { styles as createStyles } from '@/styles/screens/auth/registerApple';

export default function RegisterAppleScreen(): ReactElement {
    const { colorScheme } = useTheme();
    const styles = createStyles(colorScheme);

    const [registerError, setRegisterError] = useState<string | null>(null);
    const [address, setAddress] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { refreshUser } = useAuth();

    const handleAppleRegister = async (): Promise<void> =>
    {
        try {
            setIsLoading(true);
            setRegisterError(null);

            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

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
        } catch (e: any)
        {
            // show alert
            alert('Apple Sign-In is only available for payed accounts');

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
                <ErrorMessageContainer message={registerError} />

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