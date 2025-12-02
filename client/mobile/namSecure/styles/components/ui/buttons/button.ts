import {IButtonStyle} from "@/types/components/ui/button/button";
import {StyleSheet} from "react-native";

export const nativeStyles: IButtonStyle = StyleSheet.create({
    button:
        {
            borderRadius: 8,
            paddingHorizontal: 24,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 60,
        },
    text:
        {
            fontSize: 16,
            paddingVertical: 4,
            bottom: 10
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

export const styles: IButtonStyle = StyleSheet.create({
    button:
    {
        borderRadius: 8,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 40,
    },
    text:
    {
        fontSize: 16,
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