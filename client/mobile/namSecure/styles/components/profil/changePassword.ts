import {StyleSheet} from "react-native";
import {IChangePasswordStyle} from "@/types/components/profil/changePassword";

const colors = {
    light: {
        title: '#1F2937',
    },
    dark: {
        title: '#ECEDEE',
    },
};

export const styles = (theme: 'light' | 'dark' = 'light'): IChangePasswordStyle => {
    const c = colors[theme as keyof typeof colors];
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'transparent',
        },
        content: {
            padding: 20,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: c.title,
            marginBottom: 24,
            textAlign: 'center',
        },
        formContainer: {
            gap: 16,
        },
    });
};
