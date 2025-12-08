import {StyleSheet} from "react-native";
import {IChangePasswordStyle} from "@/types/components/profil/changePassword";

export const styles: IChangePasswordStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 24,
        textAlign: 'center',
    },
    formContainer: {
        gap: 16,
    },
});
