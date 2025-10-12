import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ionicons inclut le logo Apple sur iOS

export default function AppleButton() {
    return (
        <TouchableOpacity style={styles.button}>
            <View style={styles.content}>
                <Ionicons name="logo-apple" size={20} color="black" style={styles.icon} />
                <Text style={styles.text}>Continue with Apple</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#F0F0F0',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginRight: 8,
    },
    text: {
        fontSize: 16,
        color: '#000',
    },
});
