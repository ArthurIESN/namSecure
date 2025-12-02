import { StyleSheet, TextStyle, ViewStyle } from "react-native";

interface ILoadingStyle {
    container: ViewStyle;
    spinner: ViewStyle;
    spinnerSmall: ViewStyle;
    spinnerMedium: ViewStyle;
    spinnerLarge: ViewStyle;
    messageText: TextStyle;
}

export const styles: ILoadingStyle = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    spinner: {
        borderWidth: 3,
        borderRadius: 100,
        borderColor: '#E5E7EB',
        borderTopColor: '#6B7280',
    },
    spinnerSmall: {
        width: 40,
        height: 40,
    },
    spinnerMedium: {
        width: 60,
        height: 60,
    },
    spinnerLarge: {
        width: 80,
        height: 80,
    },
    messageText: {
        marginTop: 15,
        fontSize: 14,
        fontWeight: '500',
        color: '#9CA3AF',
        textAlign: 'center',
    },
});
