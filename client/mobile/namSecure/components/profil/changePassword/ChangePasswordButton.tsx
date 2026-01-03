import React, { ReactElement } from 'react';
import Button from '@/components/ui/buttons/Button';
import { router } from 'expo-router';

export default function ChangePasswordButton(): ReactElement {
  const handleChangePassword = () => {
    router.push('/(app)/(profil)/changePassword');
  };

  return (
    <Button
      title="Change Password"
      onPress={handleChangePassword}
      backgroundColor="#FFFFFF"
      textColor="#000000"
      disabled={false}
    />
  );
}
