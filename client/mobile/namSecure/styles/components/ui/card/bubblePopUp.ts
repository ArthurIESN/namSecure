import {StyleSheet} from "react-native";
import {IBubblePopUpStyle} from "@/types/components/ui/card/bubblePopUp";

export const styles: IBubblePopUpStyle = StyleSheet.create({
    bubble: {
        position: 'absolute',
        padding: 15,
        borderRadius: 25,
        bottom: 15,
        alignSelf: 'center',

    },
    box: {
        borderRadius: 25,
        height: 350,
        padding: 0,
        position: 'absolute',
        overflow: 'hidden',
        width: '100%',
    },
    buttonGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        paddingBottom: 130,
    },
    overlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 300,
        paddingTop: 16,
    }
});