import { TextStyle, ViewStyle } from "react-native";

export interface IErrorMessageProps {
    message: string | null;
}

export interface IErrorMessageStyle {
    container: ViewStyle;
    emptyContainer: ViewStyle;
    errorText: TextStyle;
}
