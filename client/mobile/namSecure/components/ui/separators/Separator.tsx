import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface SeparatorProps {
    text?: string;
    style?: object;
    textStyle?: object;
}

export default function Separator({ text, style, textStyle }: SeparatorProps) {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.line} />
            {text ? <Text style={[styles.text, textStyle]}>{text}</Text> : null}
            <View style={styles.line} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    text: {
        marginHorizontal: 8,
        color: '#888',
        fontSize: 14,
    },
});
