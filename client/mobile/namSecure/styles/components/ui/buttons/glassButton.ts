import {StyleSheet} from "react-native";
import {IGlassButtonStyle} from "@/types/components/ui/button/glassButton";

export const styles: IGlassButtonStyle = StyleSheet.create({
    outerBorder: {
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: 'rgba(218,218,218,0.5)',
        width: '48%',
        height: 104,
        marginVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    glass: {
        //backgroundColor: 'rgba(225,225,225,0.7)',
        borderRadius: 16,
        width: '100%', // 2 par ligne
        height: '100%',
        marginVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',

    },
    buttonLabel: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '500',
        alignSelf: 'center'
    },
});