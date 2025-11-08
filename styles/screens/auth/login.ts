import {StyleSheet} from "react-native";
import {ILoginScreenStyle} from "@/types/screens/auth/login";

export const loginStyles: ILoginScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: 16,
        marginHorizontal: 8,
    },
    namSecure: {
        fontSize: 30,
        fontWeight: '600',
        textAlign: 'center',
        alignSelf: 'center'
    },
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        top: 20,
    },
    loginText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center'
    },
    createAccount: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginTop: 40,
        textDecorationLine: 'underline',
        cursor: 'pointer',
    },
});
