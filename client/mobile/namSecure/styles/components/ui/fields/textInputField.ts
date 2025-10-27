import { StyleSheet } from "react-native";
import { ITextInputFieldStyle } from "@/types/components/ui/fields/textInputField";

export const styles: ITextInputFieldStyle = StyleSheet.create({
    input: {
        marginBottom: 16,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
    }
});