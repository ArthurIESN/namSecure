import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TextInputField from '@/components/ui/fields/TextInputField';
import Button from "@/components/ui/buttons/Button";
import {api, EAPI_METHODS} from "@/utils/api/api";
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ResetPassword() {
    const router = useRouter();
    const searchParams = useLocalSearchParams();
    const token = searchParams.token as string | undefined;

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetSent, setResetSent] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setError('Token invalide');
        }
    }, [token]);

    const handleResetPassword = async (): Promise<void> => {
        setError('');

        if (!newPassword || !confirmPassword) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (newPassword.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères');
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: 16,
        marginHorizontal: 8,
    },
    resetContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    resetText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center'
    },
    errorText: {
        fontSize: 14,
        color: '#d32f2f',
        marginBottom: 15,
        textAlign: 'center'
    },
    successMessage: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center'
    }
});
