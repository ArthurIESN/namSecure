import {StyleSheet} from "react-native";

const colors = {
    light: {
        glassColor: '00000010',
        gradientStart: '#ffffff10',
        gradientEnd: '#ffffff05',
        iconColor: 'black',
    },
    dark: {
        glassColor: '00000020',
        gradientStart: '#00000010',
        gradientEnd: '#00000005',
        iconColor: 'white',
    }
};

export const styles = (theme: 'light' | 'dark') => {
    const c = colors[theme];
    return StyleSheet.create({
        glassContainer: {
            position: 'absolute',
            top: 50,
            left: 0,
            width: '100%',
            alignItems: 'center',
            zIndex: 9999,
        },
        glassBox: {
            width: 353,
            height: 66,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
        },
        viewContent: {
            display: 'flex',
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            height: '100%',
            alignSelf: 'flex-start',
            paddingHorizontal: 16,
        },
        profilButton: {
            zIndex: 10,
            marginLeft: 'auto',
        },
        profileImage: {
            width: 48,
            height: 48,
            borderRadius: 24,
        },
    });
};

export { colors as bubbleMapColors };
