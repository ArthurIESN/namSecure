import {ReactNode} from "react";
import {DimensionValue, TextStyle, ViewStyle} from "react-native";

export interface IGlassButton
{
    icon: string,
    label: string,
    onPress: () => void,
    color?: string,
    height?: DimensionValue | null,
    width?: DimensionValue | null,
    iconSize?: number,
}

export interface IGlassButtonStyle
{
    outerBorder: ViewStyle;
    button: ViewStyle;
    buttonLabel: TextStyle;
    glass: ViewStyle;
}