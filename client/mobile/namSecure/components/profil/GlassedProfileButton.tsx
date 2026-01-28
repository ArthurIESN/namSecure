import React, { ReactElement } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import Text from '@/components/ui/Text';
import GlassedView from '@/components/glass/GlassedView';
import { useTheme } from '@/providers/ThemeProvider';
import { styles as createStyles } from '@/styles/components/profil/glassedProfileButton';

type ButtonVariant = 'primary' | 'danger' | 'success' | 'secondary';

interface GlassedProfileButtonProps {
    label: string;
    onPress: () => void;
    variant?: ButtonVariant;
    disabled?: boolean;
    style?: ViewStyle;
    glassStyleEffect?: 'regular' | 'clear';
}

export default function GlassedProfileButton({
    label,
    onPress,
    variant = 'secondary',
    disabled = false,
    style,
    glassStyleEffect = 'regular',
}: GlassedProfileButtonProps): ReactElement {
    const { colorScheme } = useTheme();
    const styles = createStyles(colorScheme);

    const variantStyles = {
        primary: {
            glassColor: '0088FF20',
            textColor: '#ffffff',
            borderColor: '#0088FF',
        },
        danger: {
            glassColor: 'ff001720',
            textColor: '#ff0017',
            borderColor: '#ff0017',
        },
        success: {
            glassColor: '00B89440',
            textColor: '#00B894',
            borderColor: '#00B894',
        },
        secondary: {
            glassColor: colorScheme === 'light' ? 'FFFFFF10' : '000000CC',
            textColor: colorScheme === 'light' ? '#333' : '#fff',
            borderColor: colorScheme === 'light' ? '#ddd' : '#666',
        },
    };

    const variantStyle = variantStyles[variant];

    return (
        <View style={[styles.container, style]}>
            <View style={[
                styles.outerBorder,
                { borderColor: variantStyle.borderColor },
                disabled && styles.disabled
            ]}>
                <GlassedView
                    color={variantStyle.glassColor}
                    isInteractive={true}
                    glassEffectStyle={glassStyleEffect}
                    intensity={50}
                    tint="default"
                    style={styles.glass}
                >
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onPress}
                        disabled={disabled}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.buttonLabel]}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                </GlassedView>
            </View>
        </View>
    );
}
