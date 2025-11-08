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
        borderWidth: 4,
        borderRadius: 100,
        borderColor: '#e0e0e0',
        borderTopColor: '#007AFF',
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
        color: '#666',
        textAlign: 'center',
    },
});
