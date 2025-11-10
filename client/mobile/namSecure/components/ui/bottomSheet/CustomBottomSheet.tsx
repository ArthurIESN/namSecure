/*
import React, { ReactNode } from 'react';
import {View, useWindowDimensions, StyleSheet, Modal, Pressable} from 'react-native';
import Animated, {
    FadeIn,
    FadeOut,
    SlideInDown,
    SlideOutDown,
    useAnimatedStyle,
    useSharedValue, withSpring, withTiming, runOnJS
} from 'react-native-reanimated';
import GlassedView from '@/components/glass/GlassedView';
import GlassedContainer from '@/components/glass/GlassedContainer';
import {Gesture, GestureDetector} from "react-native-gesture-handler";

interface ICustomBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const OVERDRAG = 100;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function CustomBottomSheet({ isOpen, onClose, children }: ICustomBottomSheetProps) {
    const { height } = useWindowDimensions();
    const offset = useSharedValue(0);

    const pan = Gesture.Pan().onChange((event) =>
    {
        const offsetDelta = offset.value + event.changeY;
        const clampValue = Math.max(-OVERDRAG, offsetDelta);
        offset.value = offsetDelta > 0 ? offsetDelta : withSpring(clampValue);
    }).onFinalize(() =>
    {
        if(offset.value < height / 3)
        {
            offset.value = withSpring(0);
        }
        else
        {
            offset.value = withTiming(height, {}, () =>
            {
                runOnJS(onClose)();
            });
        }
    })

    const translateY = useAnimatedStyle(() =>
        ({
        transform: [{ translateY: offset.value }]
    }));

    return (
        <>
            {isOpen && (
                <AnimatedPressable
                    style={styles.backdrop}
                    entering={FadeIn}
                    exiting={FadeOut}
                    onPress={onClose}
                />
            )}
            <GestureDetector gesture={pan}>
                <Animated.View
                    style={[styles.container, translateY]}
                    entering={SlideInDown.springify().damping(150)}
                    exiting={SlideInDown}
                >
                    {isOpen && (
                        <GlassedContainer style={styles.glassContainer}>
                            <View style={styles.topBorder} />
                            <GlassedView
                                color={"00000060"}
                                isInteractive={false}
                                glassEffectStyle={"regular"}
                                intensity={0}
                                tint={"transparent"}
                                >
                                {children}
                            </GlassedView>
                        </GlassedContainer>)}
                </Animated.View>
            </GestureDetector>
        </>
    );
}

const styles = StyleSheet.create(
    {
        backdrop: {
            ...StyleSheet.absoluteFillObject,
            zIndex: 1,
        },
        container: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 2,
        },
        glassContainer: {
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            overflow: 'hidden',
        },
        topBorder: {
            height: 30,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 30,
            backgroundColor: 'transparent',
        },
    });*/