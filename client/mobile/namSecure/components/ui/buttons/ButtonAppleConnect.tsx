import React, {ReactElement} from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { IconSymbol } from "@/components/ui/symbols/IconSymbol";
import { styles } from "@/styles/components/ui/buttons/buttonApple";

interface IAppleButtonProps
{
    onClick: () => void;
}

export default function AppleButton(props: IAppleButtonProps): ReactElement
{
    return (
        <TouchableOpacity style={styles.button} onPress={props.onClick}>
            <View style={styles.content}>
                <IconSymbol name="apple.logo" size={20} color="black" style={styles.icon} />
                <Text style={styles.text}>Continue with Apple</Text>
            </View>
        </TouchableOpacity>
    );
}
