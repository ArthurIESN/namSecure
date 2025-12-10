
import React, { ReactElement, useMemo } from 'react';
import { Button, Host } from '@expo/ui/swift-ui';
import {View, Animated, GestureResponderEvent} from 'react-native';
import Text from '@/components/ui/Text';
import { IButtonProps } from "@/types/components/ui/button/button";
import { nativeStyles as createStyles, buttonColors } from "@/styles/components/ui/buttons/button";
import {useTheme} from "@/providers/ThemeProvider";
import GestureHandlerButton from "react-native-gesture-handler/src/components/GestureHandlerButton";

export default function NativeButton(props: IButtonProps): ReactElement {
    const { colorScheme } = useTheme();
    const styles = createStyles(colorScheme);
    const colors = buttonColors[colorScheme];

    const spinValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() =>
    {
        if (props.loading)
        {
            Animated.loop(
                Animated.timing(spinValue,
                {
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

    const buttonContent = useMemo(() => props.loading ? (
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
    ), [props.loading, props.title, props.textColor, props.disabled, props.loadingText, animatedStyle, styles, colors]);

    const handlePress = React.useCallback(() =>
    {
        if (!props.disabled && !props.loading && props.onPress)
        {
            const event: GestureResponderEvent = {} as GestureResponderEvent;
            props.onPress(event);
        }
    }, [props.onPress, props.disabled, props.loading]);

    return (
        <Host>
            <Button onPress={handlePress}>
                <View
                    style={[
                        styles.button,
                        { backgroundColor: props.backgroundColor || colors.primary },
                        (props.disabled || props.loading) && styles.buttonDisabled,
                    ]}
                >
                    <View style={styles.nativeButtonInnerContainer}>
                        {buttonContent}
                    </View>
                </View>
            </Button>
        </Host>
    );
}
