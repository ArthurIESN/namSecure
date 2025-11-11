import {ReactNode} from "react";
import {ViewStyle} from "react-native";

export interface IBubblePopUp
{
    bubbleText: String;
    children: ReactNode;
}

export interface IBubblePopUpStyle
{
    bubble: ViewStyle;
    box: ViewStyle;
    overlay: ViewStyle;
    buttonGrid: ViewStyle;
}