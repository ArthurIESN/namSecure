import {StyleSheet} from "react-native";
import {IGlassButtonStyle} from "@/types/components/ui/button/glassButton";

const colors = {
    light: {
        icon: '#333',
        glassColor: 'FFFFFF50',
        border: 'rgba(218,218,218,0.5)',
    },
    dark: {
        icon: '#fff',
        glassColor: '00000000',
        border: 'rgba(255,255,255,0.1)',
    }
};

export const styles = (theme: 'light' | 'dark'): IGlassButtonStyle => {
    const c = colors[theme];
    return StyleSheet.create({
        outerBorder: {
            borderRadius: 16,
            borderWidth: 1.5,
            borderColor: c.border,
            width: '48%',
            height: 104,
            marginVertical: 12,
            alignItems: 'center',
            justifyContent: 'center',
        },
        glass: {
            //backgroundColor: 'rgba(225,225,225,0.7)',
            borderRadius: 16,
            width: '100%', // 2 par ligne
            height: '100%',
            marginVertical: 12,
            justifyContent: 'center',
            alignItems: 'center',
        },
        button: {
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',

        },
        buttonLabel: {
            marginTop: 8,
            fontSize: 14,
            fontWeight: '500',
            alignSelf: 'center'
        },
    });
};

export { colors as glassButtonColors };