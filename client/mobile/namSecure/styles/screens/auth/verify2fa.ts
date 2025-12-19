import {StyleSheet} from "react-native";
import {IVerify2FAStyle} from "@/types/screens/auth/verify2fa";

const colors = {
    light: {
        background: '#fff',
        subtitle: '#666',
    },
    dark: {
        background: '#151718',
        subtitle: '#999',
    }
};

export const styles = (theme: 'light' | 'dark'): IVerify2FAStyle => {
    const c = colors[theme];
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
            marginHorizontal: 8,
            bottom: 80,
            backgroundColor: c.background,
        },
        content: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 16,
        },
        title: {
            fontSize: 24,
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: 16,
        },
        subtitle: {
            fontSize: 14,
            color: c.subtitle,
            textAlign: 'center',
            marginBottom: 32,
        },
    });
};
