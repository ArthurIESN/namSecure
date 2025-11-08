import {StyleSheet} from "react-native";
import {IRegisterStyle} from "@/types/screens/auth/register";

export const styles: IRegisterStyle = StyleSheet.create({
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
    },
    loginText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 40,
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
    errorText: {
        fontSize: 14,
        color: '#ff0000',
    }
});
