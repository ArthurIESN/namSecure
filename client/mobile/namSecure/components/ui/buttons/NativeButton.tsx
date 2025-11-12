
import React, { ReactElement, useMemo } from 'react';
import { Button, Host } from '@expo/ui/swift-ui';
import { Text, View, Animated } from 'react-native';
import { IButtonProps } from "@/types/components/ui/button/button";
import { styles } from "@/styles/components/ui/buttons/button";

export default function NativeButton(props: IButtonProps): ReactElement {
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

    const buttonContent = useMemo(() => props.loading ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Animated.View
                style={[
                    {
                        width: 18,
                        height: 18,
                        borderWidth: 2.5,
                        borderRadius: 9,
                        borderColor: '#999',
                        borderTopColor: '#333',
                    },
                    animatedStyle
                ]}
            />
            <Text style={[styles.text, { color: '#666' }]}>
                {props.loadingText || 'Loading...'}
            </Text>
        </View>
    ) : (
        <Text
            style={[
                styles.text,
                { color: props.textColor ? props.textColor : '#fff' },
                props.disabled && styles.textDisabled
            ]}
        >{props.title}</Text>
    ), [props.loading, props.title, props.textColor, props.disabled, props.loadingText, animatedStyle, styles.text, styles.textDisabled]);

    const handlePress = React.useCallback(() => {
        if (!props.disabled && !props.loading && props.onPress) {
            props.onPress();
        }
    }, [props.onPress, props.disabled, props.loading]);

    return (
        <Host>
            <Button onPress={handlePress}>
                <View
                    style={[
                        styles.button,
                        { backgroundColor: props.backgroundColor ? props.backgroundColor : '#000' },
                        (props.disabled || props.loading) && styles.buttonDisabled,
                        props.style
                    ]}
                >
                    {buttonContent}
                </View>
            </Button>
        </Host>
    );
}
