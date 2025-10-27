import {TextStyle, ViewStyle} from "react-native";

export interface ICodeFieldProps
{
    length: number;
    onComplete: (code: string) => void;
}

export interface ICodeFieldStyle
{
    codeFieldRoot: ViewStyle;
    cell: TextStyle;
    focusedCell: ViewStyle;
    cellText: TextStyle;
}