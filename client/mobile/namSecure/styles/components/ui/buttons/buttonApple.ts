import {IAppleButtonStyle} from "@/types/components/ui/button/appleButton";
import {StyleSheet} from "react-native";

const colors = {
    light: {
        background: '#F0F0F0',
        text: '#000',
        icon: '#000',
    },
    dark: {
        background: '#333333',
        text: '#fff',
        icon: '#fff',
    }
};

export const styles = (theme: 'light' | 'dark'): IAppleButtonStyle => {
    const c = colors[theme];
    return StyleSheet.create({
        button: {
            backgroundColor: c.background,
            paddingVertical: 14,
            paddingHorizontal: 24,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
        },
        content: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        icon: {
            marginRight: 8,
        },
        text: {
            fontSize: 16,
            color: c.text,
        },
    });
};

export const buttonAppleColors = colors;