import React, {ReactElement} from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Text from '@/components/ui/Text';
import { IconSymbol } from "@/components/ui/symbols/IconSymbol";
import { styles as createStyles, buttonAppleColors } from "@/styles/components/ui/buttons/buttonApple";
import { useTheme } from "@/providers/ThemeProvider";

interface IAppleButtonProps
{
    onClick: () => void;
}

export default function AppleButton(props: IAppleButtonProps): ReactElement
{
    const { colorScheme } = useTheme();
    const styles = createStyles(colorScheme);
    const colors = buttonAppleColors[colorScheme];

    return (
        <TouchableOpacity style={styles.button} onPress={props.onClick}>
            <View style={styles.content}>
                <IconSymbol name="apple.logo" size={20} color={colors.icon} style={styles.icon} />
                <Text style={styles.text}>Continue with Apple</Text>
            </View>
        </TouchableOpacity>
    );
}
