import {ButtonProps, TextStyle, ViewStyle} from "react-native";

export interface IButtonProps extends ButtonProps
{
    backgroundColor?: string;
    textColor?: string;
}

export interface IButtonStyle
{
    button: ViewStyle;
    text: TextStyle;
}