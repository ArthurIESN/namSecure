import {StyleSheet} from "react-native";
import { ICodeFieldStyle } from "@/types/components/ui/fields/codeField";

export const styles: ICodeFieldStyle = StyleSheet.create(
    {
        codeFieldRoot: {
            marginTop: 20,
            width: 280,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        cell: {
            width: 40,
            height: 50,
            lineHeight: 38,
            fontSize: 24,
            borderWidth: 1,
            borderColor: '#00000030',
            textAlign: 'center',
            borderRadius: 8,
            margin: 0,
            justifyContent: 'center',
            alignItems: 'center',
        },
        focusedCell: {
            borderColor: '#000',
        },
        cellText: {
            fontSize: 24,
            textAlign: 'center',
        },
    });