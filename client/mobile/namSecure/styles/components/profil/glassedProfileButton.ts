import { StyleSheet } from 'react-native';

const colors = {
    light: {
        border: 'rgba(218,218,218,0.5)',
    },
    dark: {
        border: 'rgba(255,255,255,0.1)',
    }
};

export const styles = (theme: 'light' | 'dark') => {
    const c = colors[theme];
    return StyleSheet.create({
        container: {
            marginVertical: 4,
        },
        outerBorder: {
            borderRadius: 12,
            overflow: 'hidden',
        },
        glass: {
            borderRadius: 12,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 14,
        },
        button: {
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 16,
        },
        buttonLabel: {
            fontSize: 15,
            fontWeight: '600',
        },
        disabled: {
            opacity: 0.5,
        },
    });
};
