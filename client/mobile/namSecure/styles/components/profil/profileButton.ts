import { StyleSheet } from 'react-native';

const colors = {
    light: {
        primaryBg: 'rgba(0, 136, 255, 0.15)',
        primaryBorder: 'rgba(0, 136, 255, 0.4)',
        primaryText: '#0088FF',
        secondaryBg: 'rgba(255, 255, 255, 0.15)',
        secondaryBorder: 'rgba(0, 0, 0, 0.1)',
        secondaryText: '#000000',
        dangerBg: 'rgba(255, 71, 87, 0.15)',
        dangerBorder: 'rgba(255, 71, 87, 0.4)',
        dangerText: '#FF4757',
        successBg: 'rgba(0, 184, 148, 0.15)',
        successBorder: 'rgba(0, 184, 148, 0.4)',
        successText: '#00B894',
        shadowColor: '#000000',
    },
    dark: {
        primaryBg: 'rgba(0, 136, 255, 0.2)',
        primaryBorder: 'rgba(0, 136, 255, 0.5)',
        primaryText: '#0088FF',
        secondaryBg: 'rgba(255, 255, 255, 0.1)',
        secondaryBorder: 'rgba(255, 255, 255, 0.2)',
        secondaryText: '#FFFFFF',
        dangerBg: 'rgba(255, 71, 87, 0.2)',
        dangerBorder: 'rgba(255, 71, 87, 0.5)',
        dangerText: '#FF6B6B',
        successBg: 'rgba(0, 184, 148, 0.2)',
        successBorder: 'rgba(0, 184, 148, 0.5)',
        successText: '#00D084',
        shadowColor: '#000000',
    }
};

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';

export const styles = (theme: 'light' | 'dark') => {
    const c = colors[theme];

    return StyleSheet.create({
        container: {
            marginVertical: 8,
            marginHorizontal: 20,
        },
        button: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 14,
            paddingHorizontal: 18,
            borderRadius: 12,
            borderWidth: 1.5,
            gap: 10,
            minHeight: 48,
            shadowColor: c.shadowColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 5,
        },
        buttonPrimary: {
            backgroundColor: c.primaryBg,
            borderColor: c.primaryBorder,
        },
        buttonSecondary: {
            backgroundColor: c.secondaryBg,
            borderColor: c.secondaryBorder,
        },
        buttonDanger: {
            backgroundColor: c.dangerBg,
            borderColor: c.dangerBorder,
        },
        buttonSuccess: {
            backgroundColor: c.successBg,
            borderColor: c.successBorder,
        },
        buttonDisabled: {
            opacity: 0.5,
        },
        textPrimary: {
            color: c.primaryText,
            fontSize: 15,
            fontWeight: '600',
        },
        textSecondary: {
            color: c.secondaryText,
            fontSize: 15,
            fontWeight: '600',
        },
        textDanger: {
            color: c.dangerText,
            fontSize: 15,
            fontWeight: '600',
        },
        textSuccess: {
            color: c.successText,
            fontSize: 15,
            fontWeight: '600',
        },
        icon: {
            width: 20,
            height: 20,
        },
    });
};

export { colors as profileButtonColors };
