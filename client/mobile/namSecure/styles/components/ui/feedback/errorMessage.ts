import { IErrorMessageStyle } from "@/types/components/ui/feedback/errorMessage";
import { StyleSheet } from "react-native";

const colors = {
    light: {
        background: '#ffe6e6',
        text: '#d32f2f',
    },
    dark: {
        background: '#3a1a1a',
        text: '#ff6b6b',
    }
};

export const styles = (theme: 'light' | 'dark'): IErrorMessageStyle => {
    const c = colors[theme];
    return StyleSheet.create({
        container: {
            backgroundColor: c.background,
            borderRadius: 8,
            overflow: 'hidden',
            marginBottom: 20,
        },
        emptyContainer: {
            backgroundColor: 'transparent',
        },
        errorText: {
            color: c.text,
            fontSize: 14,
            textAlign: 'center',
            padding: 10,
        },
    });
};
