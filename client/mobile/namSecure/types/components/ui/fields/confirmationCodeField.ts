import {TextStyle, ViewStyle} from "react-native";

export interface IConfirmationCodeFieldProps
{
    length: number;
    onComplete: (code: string) => void;
    resetTrigger?: string;
}

export interface IConfirmationCodeFieldStyle
{
    codeFieldRoot: ViewStyle;
    cell: ViewStyle;
    focusedCell: ViewStyle;
    cellText: TextStyle;
}