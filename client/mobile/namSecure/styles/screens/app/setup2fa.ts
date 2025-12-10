import { StyleSheet } from 'react-native';

const colors = {
    light: {
        descriptionText: '#666',
        successText: 'green',
        loadingText: '#666',
        orText: '#999',
        secretBorder: '#e0e0e0',
        secretText: '#333',
        cancelText: '#888',
    },
    dark: {
        descriptionText: '#aaa',
        successText: '#4ade80',
        loadingText: '#aaa',
        orText: '#666',
        secretBorder: '#444',
        secretText: '#e0e0e0',
        cancelText: '#999',
    }
};

export const styles = (theme: 'light' | 'dark') => {
    const c = colors[theme];
    return StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            padding: 0,
            marginHorizontal: 0,
            backgroundColor: 'transparent'
        },
        namSecure: {
            fontSize: 30,
            fontWeight: '600',
            textAlign: 'center',
            top: 0,
            alignSelf: 'center'
        },
        scrollContent: {
            flexGrow: 1,
            justifyContent: 'flex-start',
            paddingTop: 0,
            paddingBottom: 40,
            backgroundColor: 'transparent'
        },
        setupContainer: {
            flex: 1,
            justifyContent: 'flex-start',
            marginTop: -50,
            paddingHorizontal: 30,
            backgroundColor: 'transparent'
        },
        titleText: {
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 0,
            textAlign: 'center'
        },
        descriptionText: {
            fontSize: 14,
            color: c.descriptionText,
            textAlign: 'center',
            marginBottom: 40,
            lineHeight: 20,
        },
        successText: {
            fontSize: 18,
            fontWeight: '600',
            color: c.successText,
            textAlign: 'center',
            marginBottom: 20
        },
        qrContainer: {
            alignItems: 'center',
            marginVertical: 30,
            padding: 20,
            backgroundColor: 'transparent',
            borderRadius: 8
        },
        qrCode: {
            width: 250,
            height: 250,
            borderRadius: 8
        },
        openAuthButton: {
            marginTop: 15
        },
        codeFieldContainer: {
            marginVertical: 30,
            paddingHorizontal: 10
        },
        loadingContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 15,
            gap: 10
        },
        loadingText: {
            fontSize: 14,
            color: c.loadingText
        },
        orContainer: {
            alignItems: 'center',
            marginVertical: 20
        },
        orText: {
            fontSize: 14,
            color: c.orText,
            fontWeight: '600'
        },
        secretContainer: {
            padding: 15,
            backgroundColor: 'transparent',
            borderRadius: 8,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: c.secretBorder
        },
        secretText: {
            fontSize: 14,
            fontWeight: '600',
            textAlign: 'center',
            color: c.secretText,
            fontFamily: 'monospace',
            letterSpacing: 2
        },
        cancelText: {
            fontSize: 14,
            color: c.cancelText,
            textAlign: 'center',
            marginTop: 20,
            textDecorationLine: 'underline',
            cursor: 'pointer'
        }
    });
};
