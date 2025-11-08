import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface ISeparatorProps {
    text?: string;
    style?: object;
    textStyle?: object;
}

export default function Separator(props: ISeparatorProps) {
    return (
        <View style={[styles.container, props.style]}>
            <View style={styles.line} />
            {props.text ? <Text style={[styles.text, props.textStyle]}>{props.text}</Text> : null}
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
