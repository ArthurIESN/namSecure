import {IButtonStyle} from "@/types/components/ui/button/button";
import {StyleSheet} from "react-native";

export const styles: IButtonStyle = StyleSheet.create({
    button:
    {
        borderRadius: 8,
        paddingVertical: 22,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 40,
    },
    text:
    {
        fontSize: 16,
        bottom: 10,
        lineHeight: 20,
        textAlign: 'center',
        textAlignVertical: 'center',
        includeFontPadding: false,
        paddingVertical: 4,
    },
    buttonDisabled:
    {
        backgroundColor: '#ccc',
        opacity: 0.6,
    },
    textDisabled:
    {
        color: '#999',
    },
    buttonContent:
    {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    }
});