import React, { ReactElement } from 'react';
import GlassedProfileButton from '@/components/profil/GlassedProfileButton';
import { router } from 'expo-router';

export default function ChangePasswordButton(): ReactElement {
  const handleChangePassword = () => {
    router.push('/(app)/(profil)/changePassword');
  };

  return (
    <GlassedProfileButton
      label="Change Password"
      onPress={handleChangePassword}
      icon="lock.fill"
      variant="primary"
    />
  );
}
