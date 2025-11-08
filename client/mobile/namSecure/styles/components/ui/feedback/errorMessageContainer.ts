import { StyleSheet, ViewStyle } from "react-native";

interface IErrorMessageContainerStyle {
    container: ViewStyle;
}

export const styles: IErrorMessageContainerStyle = StyleSheet.create({
    container: {
        height: 80,
        marginBottom: 10,
        justifyContent: 'flex-start',
    },
});
