import {ButtonProps, TextStyle, ViewStyle} from "react-native";

export interface IButtonProps extends ButtonProps
{
    backgroundColor?: string;
    textColor?: string;
    loading?: boolean;
    loadingText?: string;
}

export interface IButtonStyle
{
    button: ViewStyle;
    text: TextStyle;
    buttonDisabled: ViewStyle;
    textDisabled: TextStyle;
    buttonContent: ViewStyle;
}