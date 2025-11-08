import {IAppleButtonStyle} from "@/types/components/ui/button/appleButton";
import {StyleSheet} from "react-native";

export const styles: IAppleButtonStyle = StyleSheet.create({
    button: {
        backgroundColor: '#F0F0F0',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginRight: 8,
    },
    text: {
        fontSize: 16,
        color: '#000',
    },
});