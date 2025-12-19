import {StyleSheet} from "react-native";

const colors = {
    light: {
        background: '#fff',
        errorText: '#d32f2f',
        successMessage: '#666',
    },
    dark: {
        background: '#151718',
        errorText: '#ff6b6b',
        successMessage: '#999',
    }
};

export const styles = (theme: 'light' | 'dark') => {
    const c = colors[theme];
    return StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            padding: 16,
            marginHorizontal: 8,
            backgroundColor: c.background,
        },
        resetContainer: {
            flex: 1,
            justifyContent: 'center',
        },
        resetText: {
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 20,
            textAlign: 'center'
        },
        errorText: {
            fontSize: 14,
            color: c.errorText,
            marginBottom: 15,
            textAlign: 'center'
        },
        successMessage: {
            fontSize: 14,
            color: c.successMessage,
            marginBottom: 20,
            textAlign: 'center'
        }
    });
};
