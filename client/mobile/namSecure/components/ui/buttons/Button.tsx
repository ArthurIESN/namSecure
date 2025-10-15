import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export interface ButtonProps {
    title: string;
    onPress: () => void;
    style?: object;
}

export default function Button({ title, onPress, style }: ButtonProps) {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#000',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 16,
    },
});
