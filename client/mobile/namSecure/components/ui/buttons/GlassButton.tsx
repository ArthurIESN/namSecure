import React, {ReactElement} from "react";
import {DimensionValue, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {styles} from "@/styles/components/ui/buttons/glassButton";
import GlassedView from "@/components/glass/GlassedView";
import {Ionicons} from "@expo/vector-icons";
import {IGlassButton} from "@/types/components/ui/button/glassButton";
import {IconSymbol} from "@/components/ui/symbols/IconSymbol";

export default function GlassButton(props: IGlassButton): ReactElement {
    const glassColor: string = props.color || "FFFFFF50";
    const buttonHeight: DimensionValue | null = props.height || 104;
    const buttonWidth: DimensionValue | null = props.width || "48%";
    const iconSize: number = props.iconSize || 40;

    return (
        <View style={[styles.outerBorder, {height: buttonHeight, width: buttonWidth}]}>
            <GlassedView
                color={glassColor} // 8 digits
                isInteractive={true}
                glassEffectStyle={"regular"}
                intensity={50}
                tint={"default"}
                style={styles.glass}
            >
                <TouchableOpacity style={styles.button}>
                    <IconSymbol name={props.icon} style={{alignSelf: 'center'}} size={iconSize} color="#333" />
                    <Text style={styles.buttonLabel}>{props.label}</Text>
                </TouchableOpacity>
            </GlassedView>
        </View>
    );
}