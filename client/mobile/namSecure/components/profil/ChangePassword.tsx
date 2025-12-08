import React, {ReactElement, useState} from 'react';
import {Text, View} from 'react-native';
import TextInputField from '@/components/ui/fields/TextInputField';
import Button from '@/components/ui/buttons/Button';
import ErrorMessageContainer from '@/components/ui/error/ErrorMessageContainer';
import {styles} from '@/styles/components/profil/changePassword';
import {api, EAPI_METHODS} from "@/utils/api/api";

export default function ChangePassword(): ReactElement
{
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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

        if (newPassword.length < 8)
        {
            setError('New password must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        const response = await api('member/password/change', EAPI_METHODS.POST,
            {
                currentPassword,
                newPassword,
                confirmPassword,
            });

        // @todo implement in profil



        setIsLoading(false);
    };

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
