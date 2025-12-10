import React, { ReactElement } from 'react';
import {TouchableOpacity, View, Animated} from 'react-native';
import Text from '@/components/ui/Text';
import {IButtonProps} from "@/types/components/ui/button/button";
import {styles as createStyles, buttonColors} from "@/styles/components/ui/buttons/button";
import {useTheme} from "@/providers/ThemeProvider";

export default function Button(props: IButtonProps): ReactElement
{
    const { colorScheme } = useTheme();
    const styles = createStyles(colorScheme);
    const colors = buttonColors[colorScheme];

    const spinValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (props.loading) {
            Animated.loop(
                Animated.timing(spinValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ).start();
        }
    }, [props.loading, spinValue]);

    const spinInterpolation = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const animatedStyle = {
        transform: [{ rotate: spinInterpolation }],
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: props.backgroundColor || colors.primary },
                (props.disabled || props.loading) && styles.buttonDisabled
            ]}
            onPress={props.disabled || props.loading ? undefined : props.onPress}
            disabled={props.disabled || props.loading}
        >
            {props.loading ? (
                <View style={styles.loadingContainer}>
                    <Animated.View style={[styles.spinner, animatedStyle]} />
                    <Text style={[styles.text, styles.loadingText]}>
                        {props.loadingText || 'Loading...'}
                    </Text>
                </View>
            ) : (
                <Text
                    style={[
                        styles.text,
                        { color: props.textColor || colors.primaryText },
                        props.disabled && styles.textDisabled
                    ]}
                >{props.title}</Text>
            )}
        </TouchableOpacity>
    );
}

