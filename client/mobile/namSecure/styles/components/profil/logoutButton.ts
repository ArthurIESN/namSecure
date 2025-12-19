import {StyleSheet} from "react-native";

const colors = {
    light: {
        buttonBg: '#EE5C63',
    },
    dark: {
        buttonBg: '#FF6B73',
    }
};

export const styles = (theme: 'light' | 'dark') => {
    const c = colors[theme];
    return StyleSheet.create({
        button: {
            width: 'auto',
            borderRadius: 5,
            height: 35,
            justifyContent: 'center',
            backgroundColor: c.buttonBg,
            opacity: 0.85,
            marginTop: 10,
        },
        text: {
            paddingLeft: 10,
        }
    });
};

export { colors as logoutButtonColors };
