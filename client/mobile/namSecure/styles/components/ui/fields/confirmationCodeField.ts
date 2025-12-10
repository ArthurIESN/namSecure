import {StyleSheet} from "react-native";
import {IConfirmationCodeFieldStyle } from "@/types/components/ui/fields/confirmationCodeField";

const colors = {
    light: {
        cellBorder: '#00000030',
        cellBorderFocused: '#000',
        cellText: '#000',
    },
    dark: {
        cellBorder: '#ffffff30',
        cellBorderFocused: '#fff',
        cellText: '#fff',
    }
};

export const styles = (theme: 'light' | 'dark'): IConfirmationCodeFieldStyle => {
    const c = colors[theme];
    return StyleSheet.create({
        codeFieldRoot: {
            marginTop: 20,
            width: 280,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        cell: {
            width: 40,
            height: 50,
            lineHeight: 38,
            fontSize: 24,
            borderWidth: 1,
            borderColor: c.cellBorder,
            borderRadius: 8,
            margin: 0,
            justifyContent: 'center',
            alignItems: 'center',
        },
        focusedCell: {
            borderColor: c.cellBorderFocused,
        },
        cellText: {
            fontSize: 24,
            textAlign: 'center',
            color: c.cellText,
        },
    });
};