import React, {ReactElement} from 'react';
import {View, TextInput, StyleSheet, TextInputProps} from 'react-native';
import { styles as createStyles, textInputFieldColors } from "@/styles/components/ui/fields/textInputField";
import {useTheme} from "@/providers/ThemeProvider";


export default function TextInputField(props: TextInputProps): ReactElement
{
    const { colorScheme } = useTheme();
    const styles = createStyles(colorScheme);
    const colors = textInputFieldColors[colorScheme];

    return (
        <View style={styles.input}>
            <TextInput
                {...props}
                style={styles.textInput}
                placeholderTextColor={colors.placeholder}
            />
        </View>
    );
}