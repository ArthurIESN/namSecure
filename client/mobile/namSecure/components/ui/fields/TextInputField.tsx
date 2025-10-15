import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export interface ITextInputFieldProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
}

export default function TextInputField(props: ITextInputFieldProps) {
    return (
        <View style={styles.input}>
            <TextInput
                value={props.value}
                onChangeText={props.onChange}
                placeholder={props.placeholder}
                secureTextEntry={props.secureTextEntry}
                autoCorrect={false}
                style={styles.textInput}
                placeholderTextColor="#999"
            />
        </View>
    );
}

const styles = StyleSheet.create({
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
