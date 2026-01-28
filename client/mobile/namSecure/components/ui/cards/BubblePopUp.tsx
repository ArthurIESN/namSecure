import React, {ReactElement, useEffect, useRef} from "react";
import GlassedView from "@/components/glass/GlassedView";
import GlassedContainer from "@/components/glass/GlassedContainer";
import {View, ScrollView, Animated} from "react-native";
import Text from "@/components/ui/Text";
import {IBubblePopUp} from "@/types/components/ui/card/bubblePopUp";
import {styles} from "@/styles/components/ui/card/bubblePopUp";

export default function BubblePopUp(props: IBubblePopUp): ReactElement {
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [props.bubbleText, props.children]);

    return (
        <View style={styles.overlay}>
            <View>
                <GlassedView
                    color={"00000010"}
                    isInteractive={true}
                    glassEffectStyle={"clear"}
                    intensity={50}
                    tint={"default"}
                    style={styles.bubble}
                >
                    <Text>{props.bubbleText}</Text>
                </GlassedView>
                <GlassedView
                    color={"00000010"} // 8 digits
                    isInteractive={false}
                    glassEffectStyle={"clear"}
                    intensity={50}
                    tint={"default"}
                    style={styles.box}
                >
                    <ScrollView
                        contentContainerStyle={styles.buttonGrid}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}>
                        <Animated.View style={{ opacity: fadeAnim, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginHorizontal: 16, paddingBottom: 100 }}>
                            {props.children}
                        </Animated.View>
                    </ScrollView>
                </GlassedView>
            </View>
        </View>
    );
}