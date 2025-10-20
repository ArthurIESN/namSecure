import {IButtonStyle} from "@/types/components/ui/button/button";
import {StyleSheet} from "react-native";

export const styles: IButtonStyle = StyleSheet.create({
    button:
        {
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 24,
            alignItems: 'center',
        },
    text:
        {
            fontSize: 16,
        },
});