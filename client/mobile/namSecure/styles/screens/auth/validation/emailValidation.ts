import { IEmailValidationStyle } from "@/types/screens/auth/validation/emailValidation";
import { StyleSheet } from "react-native";

export const styles: IEmailValidationStyle = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        padding: 16,
        marginHorizontal: 8,
    },
    namSecure: {
        fontSize: 30,
        fontWeight: "600",
        textAlign: "center",
        alignSelf: "center"
    },
    emailContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        bottom: 80
    },
    confirmation: {
        fontSize: 20,
        fontWeight: "600",
        marginVertical: 20,
        textAlign: "center"
    },
    emailTextContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    emailAddress: {
        fontWeight: 'bold',
    },
    emailInfoContainer: {
        justifyContent: "center",
        alignItems: "center",
        bottom: 60
    },
    emailText: {
        textAlign: "center",
        marginVertical: 5
    },
    confirmationCodeField: {
        marginTop: 0,
    },
});
