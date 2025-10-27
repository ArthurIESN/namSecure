import React, {ReactElement} from 'react';
import {View, TextInput, StyleSheet, TextInputProps} from 'react-native';
import { styles } from "@/styles/components/ui/fields/textInputField";


export default function TextInputField(props: TextInputProps): ReactElement
{
    return (
        <View style={styles.input}>
            <TextInput
                {...props}
                style={styles.textInput}
                placeholderTextColor="#999"
            />
        </View>
    );
}