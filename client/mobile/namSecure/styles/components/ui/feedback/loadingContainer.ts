import { StyleSheet, ViewStyle } from "react-native";

interface ILoadingContainerStyle {
    container: ViewStyle;
}

export const styles: ILoadingContainerStyle = StyleSheet.create({
    container: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
