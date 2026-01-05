import React, { ReactElement } from 'react';
import { View } from 'react-native';
import Text from '@/components/ui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/providers/ThemeProvider';
import { Colors } from '@/constants/theme';
import { styles as createStyles } from '@/styles/screens/profil/changePassword';
import ChangePassword from '@/components/profil/changePassword/ChangePassword';

export default function ChangePasswordPage(): ReactElement {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const styles = createStyles(colorScheme);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.namSecure}>NamSecure</Text>
      </View>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Change Password</Text>
        <ChangePassword />
      </View>
    </SafeAreaView>
  );
}
