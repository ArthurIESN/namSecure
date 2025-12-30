import { StyleSheet } from 'react-native';
import { IRegisterStyle } from '@/types/screens/auth/register';

const colors = {
  light: {
    background: '#fff',
    createAccountText: '#888',
    errorText: '#ff0000',
  },
  dark: {
    background: '#151718',
    createAccountText: '#999',
    errorText: '#ff6b6b',
  },
};

export const styles = (theme: 'light' | 'dark'): IRegisterStyle => {
  const c = colors[theme];
  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      padding: 16,
      marginHorizontal: 8,
      backgroundColor: c.background,
    },
    namSecure: {
      fontSize: 30,
      fontWeight: '600',
      textAlign: 'center',
      alignSelf: 'center',
    },
    loginContainer: {
      flex: 1,
      justifyContent: 'center',
      top: 20,
    },
    loginText: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 40,
      textAlign: 'center',
    },
    createAccount: {
      fontSize: 14,
      color: c.createAccountText,
      textAlign: 'center',
      marginTop: 40,
      textDecorationLine: 'underline',
      cursor: 'pointer',
    },
    errorText: {
      fontSize: 14,
      color: c.errorText,
    },
  });
};
