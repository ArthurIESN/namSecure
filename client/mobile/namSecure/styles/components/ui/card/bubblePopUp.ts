import {StyleSheet} from "react-native";
import {IBubblePopUpStyle} from "@/types/components/ui/card/bubblePopUp";

export const styles: IBubblePopUpStyle = StyleSheet.create({
    bubble: {
        position: 'absolute',
        padding: 15,
        borderRadius: 25,
        bottom: 15,
        alignSelf: 'center',
        opacity: 1,
    },
    box: {
        borderRadius: 25,
        height: 700,
        padding: 0,
        position: 'absolute',
        overflow: 'hidden',
        width: '100%',
    },
    overlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 430,
        paddingTop: 16,
    }
});