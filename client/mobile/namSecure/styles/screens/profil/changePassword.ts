import { StyleSheet } from 'react-native';
import { ILoginStyle } from '@/types/screens/auth/login';

const colors = {
  light: {
    background: '#fff',
    text: '#000',
  },
  dark: {
    background: '#151718',
    text: '#ECEDEE',
  },
};

export const styles = (theme: 'light' | 'dark'): ILoginStyle => {
  const c = colors[theme];
  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: c.background,
      width: '100%',
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
      marginBottom: 20,
      textAlign: 'center',
      color: c.text,
    },
    createAccount: {
      fontSize: 14,
      color: c.text,
      textAlign: 'center',
      marginTop: 40,
      textDecorationLine: 'underline',
      cursor: 'pointer',
    },
  });
};
