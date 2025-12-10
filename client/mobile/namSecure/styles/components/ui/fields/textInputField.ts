import { StyleSheet } from "react-native";
import { ITextInputFieldStyle } from "@/types/components/ui/fields/textInputField";

const colors = {
    light: {
        background: '#fff',
        border: '#ccc',
        text: '#000',
        placeholder: '#999',
    },
    dark: {
        background: '#1e1e1e',
        border: '#3a3a3a',
        text: '#fff',
        placeholder: '#808080',
    }
};

export const styles = (theme: 'light' | 'dark'): ITextInputFieldStyle => {
    const c = colors[theme];
    return StyleSheet.create({
        input: {
            marginBottom: 16,
        },
        textInput: {
            borderWidth: 1,
            borderColor: c.border,
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 8,
            backgroundColor: c.background,
            color: c.text,
        }
    });
};

export { colors as textInputFieldColors };