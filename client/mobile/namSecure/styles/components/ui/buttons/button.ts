import {IButtonStyle} from "@/types/components/ui/button/button";
import {StyleSheet} from "react-native";

const colors = {
    light: {
        primary: '#000',
        primaryText: '#fff',
        disabled: '#ccc',
        disabledText: '#999',
        spinnerBg: '#999',
        spinnerFg: '#333',
        loadingText: '#666',
    },
    dark: {
        primary: '#3b3b3b',
        primaryText: '#fff',
        disabled: '#3a3a3a',
        disabledText: '#666',
        spinnerBg: '#666',
        spinnerFg: '#ddd',
        loadingText: '#999',
    }
};

export const nativeStyles = (theme: 'light' | 'dark'): IButtonStyle => {
    const c = colors[theme];
    return StyleSheet.create({
        button: {
            borderRadius: 8,
            paddingHorizontal: 24,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 60,
        },
        text: {
            fontSize: 16,
            paddingVertical: 4,
        },
        buttonDisabled: {
            backgroundColor: c.disabled,
            opacity: 0.6,
        },
        textDisabled: {
            color: c.disabledText,
        },
        buttonContent: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
        },
        loadingContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },
        spinner: {
            width: 18,
            height: 18,
            borderWidth: 2.5,
            borderRadius: 9,
            borderColor: c.spinnerBg,
            borderTopColor: c.spinnerFg,
        },
        loadingText: {
            color: c.loadingText,
        },
        nativeButtonInnerContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
        }
    });
};

export const styles = (theme: 'light' | 'dark'): IButtonStyle => {
    const c = colors[theme];
    return StyleSheet.create({
        button: {
            borderRadius: 8,
            paddingHorizontal: 24,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 40,
        },
        text: {
            fontSize: 16,
            paddingVertical: 4,
        },
        buttonDisabled: {
            backgroundColor: c.disabled,
            opacity: 0.6,
        },
        textDisabled: {
            color: c.disabledText,
        },
        buttonContent: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
        },
        loadingContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },
        spinner: {
            width: 18,
            height: 18,
            borderWidth: 2.5,
            borderRadius: 9,
            borderColor: c.spinnerBg,
            borderTopColor: c.spinnerFg,
        },
        loadingText: {
            color: c.loadingText,
        }
    });
};

export { colors as buttonColors };