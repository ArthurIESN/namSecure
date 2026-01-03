import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Text from '@/components/ui/Text';
import TextInputField from '@/components/ui/fields/TextInputField';
import Button from "@/components/ui/buttons/Button";
import {api, EAPI_METHODS} from "@/utils/api/api";
import { useRouter, useLocalSearchParams } from 'expo-router';
import {useTheme} from "@/providers/ThemeProvider";
import {styles as createStyles} from "@/styles/screens/auth/resetPassword";

export default function ResetPassword() {
    const { colorScheme } = useTheme();
    const styles = createStyles(colorScheme);

    const router = useRouter();
    const searchParams = useLocalSearchParams();
    const token = searchParams.token as string | undefined;

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetSent, setResetSent] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setError('Invalid token');
        }
    }, [token]);

    const handleResetPassword = async (): Promise<void> => {
        setError('');

        if (!newPassword || !confirmPassword) {
            setError('You must fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 3) {
            setError('Password must be at least 3 characters long');
            return;
        }

        const response = await api('member/password/reset/confirm', EAPI_METHODS.POST,
        {
            token,
            newPassword
        });

        if (response.error) {
            setError(response.errorMessage || 'Erreur lors de la réinitialisation du mot de passe');
            return;
        }

        setResetSent(true);
    };

    if (error && !resetSent) {
        return (
            <View style={styles.container}>
                <View style={styles.resetContainer}>
                    <Text style={styles.resetText}>Erreur</Text>
                    <Text style={styles.errorText}>{error}</Text>
                    <Button title="Back to Login" onPress={() => router.push('/Login')} />
                </View>
            </View>
        );
    }

    if (resetSent) {
        return (
            <View style={styles.container}>
                <View style={styles.resetContainer}>
                    <Text style={styles.resetText}>Mot de passe réinitialisé !</Text>
                    <Text style={styles.successMessage}>Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.</Text>
                    <Button title="Back to Login" onPress={() => router.push('/Login')} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.resetContainer}>
                <Text style={styles.resetText}>Reset Password</Text>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <TextInputField
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder={"New Password"}
                    secureTextEntry={true}
                    autoCapitalize={"none"}
                />

                <TextInputField
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder={"Confirm Password"}
                    secureTextEntry={true}
                    autoCapitalize={"none"}
                />

                <Button title="Reset Password" onPress={handleResetPassword} />
            </View>
        </View>
    );
};
