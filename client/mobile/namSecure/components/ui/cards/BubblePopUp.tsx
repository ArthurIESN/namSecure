import React, {ReactElement} from "react";
import GlassedView from "@/components/glass/GlassedView";
import GlassedContainer from "@/components/glass/GlassedContainer";
import {View, ScrollView} from "react-native";
import Text from "@/components/ui/Text";
import {IBubblePopUp} from "@/types/components/ui/card/bubblePopUp";
import {styles} from "@/styles/components/ui/card/bubblePopUp";

export default function BubblePopUp(props: IBubblePopUp): ReactElement {
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
                        {props.children}
                    </ScrollView>
                </GlassedView>
            </View>
        </View>
    );
}