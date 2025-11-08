import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TextInputField from '@/components/ui/fields/TextInputField';
import Button from "@/components/ui/buttons/Button";
import {api, EAPI_METHODS} from "@/utils/api/api";
import { useRouter } from 'expo-router';

export default function ResetPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [resetSent, setResetSent] = useState(false);

    const handleResetPassword = async (): Promise<void> =>
    {
        const response = await api('member/password/reset', EAPI_METHODS.POST, { email });
        if (response.error)
        {
            console.error(response.errorMessage || 'Password reset failed');
            return;
        }
        setResetSent(true);
    };

    if (resetSent)
    {
        return (
            <View style={styles.container}>
                <View style={styles.resetContainer}>
                    <Text style={styles.resetText}>A password reset link has been sent to your email.</Text>
                    <Button title="Back to Login" onPress={() => router.push('/Login')} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.resetContainer}>
                <Text style={styles.resetText}>Reset Password</Text>
                <TextInputField
                    value={email}
                    onChangeText={setEmail}
                    placeholder={"Address Email"}
                    keyboardType={"email-address"}
                    autoCapitalize={"none"}
                    autoComplete={"email"}
                />
                <Button title="Reset" onPress={handleResetPassword} />
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
    }
});