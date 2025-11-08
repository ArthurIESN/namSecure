import { IErrorMessageStyle } from "@/types/components/ui/feedback/errorMessage";
import { StyleSheet } from "react-native";

export const styles: IErrorMessageStyle = StyleSheet.create({
    container: {
        backgroundColor: '#ffe6e6',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 20,
    },
    emptyContainer: {
        backgroundColor: 'transparent',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        textAlign: 'center',
        padding: 10,
    },
});
