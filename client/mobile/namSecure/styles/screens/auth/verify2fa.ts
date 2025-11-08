import {StyleSheet} from "react-native";
import {IVerify2FAStyle} from "@/types/screens/auth/verify2fa";

export const styles: IVerify2FAStyle = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        marginHorizontal: 8,
        bottom: 80
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
    },
});
