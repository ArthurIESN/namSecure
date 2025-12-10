import React, { useState } from 'react';
import { View } from 'react-native';
import Text from '@/components/ui/Text';
import TextInputField from '@/components/ui/fields/TextInputField';
import Button from "@/components/ui/buttons/Button";
import {api, EAPI_METHODS} from "@/utils/api/api";
import { useRouter } from 'expo-router';
import {SafeAreaView} from "react-native-safe-area-context";
import {useTheme} from "@/providers/ThemeProvider";
import {styles as createStyles} from "@/styles/screens/auth/sendResetPassword";

export default function SendResetPassword() {
    const { colorScheme } = useTheme();
    const styles = createStyles(colorScheme);

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