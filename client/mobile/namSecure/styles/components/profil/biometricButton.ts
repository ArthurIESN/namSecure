import {StyleSheet} from "react-native";

const colors = {
    light: {
        activeBg: '#F5F5F5',
        activeBorder: '#CCCCCC',
        inactiveBg: '#FFF5F5',
        inactiveBorder: '#FF6B6B',
        activeText: '#333333',
        inactiveText: '#FF6B6B',
    },
    dark: {
        activeBg: '#2A2A2A',
        activeBorder: '#555555',
        inactiveBg: '#3A2020',
        inactiveBorder: '#FF6B6B',
        activeText: '#FFFFFF',
        inactiveText: '#FF6B6B',
    }
};

export const styles = (theme: 'light' | 'dark') => {
    const c = colors[theme];
    return StyleSheet.create({
        button: {
            width: '100%',
            borderRadius: 8,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 16,
            marginTop: 10,
            borderWidth: 1.5,
        },
        activeButton: {
            backgroundColor: c.activeBg,
            borderColor: c.activeBorder,
        },
        inactiveButton: {
            backgroundColor: c.inactiveBg,
            borderColor: c.inactiveBorder,
        },
        text: {
            fontWeight: '600',
            fontSize: 16,
            letterSpacing: 0.5,
        },
        activeText: {
            color: c.activeText,
        },
        inactiveText: {
            color: c.inactiveText,
        },
    });
};

export { colors as biometricButtonColors };
