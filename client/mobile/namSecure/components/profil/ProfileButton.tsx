import React, { ReactElement } from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import Text from '@/components/ui/Text';
import { IconSymbol } from '@/components/ui/symbols/IconSymbol';
import { useTheme } from '@/providers/ThemeProvider';
import { styles as createStyles, ButtonVariant } from '@/styles/components/profil/profileButton';

interface ProfileButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    icon?: string;
    disabled?: boolean;
    style?: ViewStyle;
}

export default function ProfileButton({
    title,
    onPress,
    variant = 'secondary',
    icon,
    disabled = false,
    style,
}: ProfileButtonProps): ReactElement {
    const { colorScheme } = useTheme();
    const styles = createStyles(colorScheme);

    const getVariantStyle = () => {
        switch (variant) {
            case 'primary':
                return styles.buttonPrimary;
            case 'danger':
                return styles.buttonDanger;
            case 'success':
                return styles.buttonSuccess;
            case 'secondary':
            default:
                return styles.buttonSecondary;
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'primary':
                return styles.textPrimary;
            case 'danger':
                return styles.textDanger;
            case 'success':
                return styles.textSuccess;
            case 'secondary':
            default:
                return styles.textSecondary;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                style,
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <TouchableOpacity
                style={[
                    styles.button,
                    getVariantStyle(),
                    disabled && styles.buttonDisabled,
                ]}
                onPress={onPress}
                disabled={disabled}
                activeOpacity={0.7}
            >
                {icon && (
                    <IconSymbol
                        name={icon}
                        size={20}
                        color={
                            variant === 'primary'
                                ? '#0088FF'
                                : variant === 'danger'
                                ? '#FF4757'
                                : variant === 'success'
                                ? '#00B894'
                                : '#000000'
                        }
                    />
                )}
                <Text style={getTextStyle()}>{title}</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
}
