import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { ILoadingProps } from '@/types/components/ui/feedback/loading';
import { styles } from '@/styles/components/ui/feedback/loading';
import {SafeAreaView} from "react-native-safe-area-context";

export default function Loading({ message = 'Loading...', size = 'medium' }: ILoadingProps)
{
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            })
        ).start();
    }, [spinValue]);

    const spinInterpolation = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const animatedStyle = {
        transform: [{ rotate: spinInterpolation }],
    };

    const spinnerSize = size === 'small' ? styles.spinnerSmall : size === 'large' ? styles.spinnerLarge : styles.spinnerMedium;

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={[styles.spinner, spinnerSize, animatedStyle]} />
            {message && <Text style={styles.messageText}>{message}</Text>}
        </SafeAreaView>
    );
}
