import {IButtonStyle} from "@/types/components/ui/button/button";
import {StyleSheet} from "react-native";

export const styles: IButtonStyle = StyleSheet.create({
    button:
    {
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text:
    {
        fontSize: 16,
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