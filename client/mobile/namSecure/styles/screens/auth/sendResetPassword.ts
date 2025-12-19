import {StyleSheet} from "react-native";

const colors = {
    light: {
        background: '#fff',
    },
    dark: {
        background: '#151718',
    }
};

export const styles = (theme: 'light' | 'dark') => {
    const c = colors[theme];
    return StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            padding: 16,
            marginHorizontal: 8,
            backgroundColor: c.background,
        },
        resetContainer: {
            flex: 1,
            justifyContent: 'center',
        },
        resetText: {
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 20,
            textAlign: 'center'
        }
    });
};
