import React, {ReactElement, useState, useEffect} from 'react';
import {View} from 'react-native';
import Text from '@/components/ui/Text';
import TextInputField from '@/components/ui/fields/TextInputField';
import Button from '@/components/ui/buttons/Button';
import ErrorMessageContainer from '@/components/ui/error/ErrorMessageContainer';
import {styles as createStyles} from '@/styles/components/profil/changePassword';
import {api, EAPI_METHODS} from "@/utils/api/api";
import {useTheme} from "@/providers/ThemeProvider";
import {useRouter} from 'expo-router';

export default function ChangePassword(): ReactElement
{
    const {colorScheme} = useTheme();
    const styles = createStyles(colorScheme);
    const router = useRouter();

    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    const handleChangePassword = async (): Promise<void> =>
    {
        setError(null);

        if (!currentPassword || !newPassword || !confirmPassword)
        {
            setError('All fields are required');
            return;
        }

        if (newPassword !== confirmPassword)
        {
            setError('New passwords do not match');
            return;
        }

        if (newPassword.length < 3)
        {
            setError('New password must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        const response = await api('member/password/change', EAPI_METHODS.POST,
            {
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPassword,
            });

        if (response.error) {
            setError(response.errorMessage || 'Failed to change password');
            setIsLoading(false);
            return;
        }

        setSuccess(true);
        setIsLoading(false);
    };

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                router.push('/(app)/(tabs)');
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [success, router]);

    if (success)
    {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Password Updated!</Text>
                    <Text style={{textAlign: 'center', marginTop: 16}}>
                        Your password has been changed successfully.
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Change Password</Text>

                <View style={styles.formContainer}>
                    <TextInputField
                        placeholder="Current Password"
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />

                    <TextInputField
                        placeholder="New Password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />

                    <TextInputField
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />

                    {error && <ErrorMessageContainer message={error} />}

                    <Button
                        title="Update Password"
                        onPress={handleChangePassword}
                        disabled={isLoading}
                        loading={isLoading}
                    />
                </View>
            </View>
        </View>
    );
}
