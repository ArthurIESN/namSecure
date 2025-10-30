import React, {ReactElement} from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { IconSymbol } from "@/components/ui/symbols/IconSymbol";
import { styles } from "@/styles/components/ui/buttons/buttonApple";

export default function AppleButton(): ReactElement
{
    return (
        <TouchableOpacity style={styles.button}>
            <View style={styles.content}>
                <IconSymbol name="apple.logo" size={20} color="black" style={styles.icon} />
                <Text style={styles.text}>Continue with Apple</Text>
            </View>
        </TouchableOpacity>
    );
}
