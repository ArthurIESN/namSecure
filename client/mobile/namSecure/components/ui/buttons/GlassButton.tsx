import React, {ReactElement} from "react";
import {DimensionValue, ScrollView, TouchableOpacity, View} from "react-native";
import Text from '@/components/ui/Text';
import {styles as createStyles, glassButtonColors} from "@/styles/components/ui/buttons/glassButton";
import GlassedView from "@/components/glass/GlassedView";
import {Ionicons} from "@expo/vector-icons";
import {IGlassButton} from "@/types/components/ui/button/glassButton";
import {IconSymbol} from "@/components/ui/symbols/IconSymbol";
import {string} from "zod";
import {useTheme} from "@/providers/ThemeProvider";

export default function GlassButton(props: IGlassButton): ReactElement {
    const { colorScheme } = useTheme();
    const styles = createStyles(colorScheme);
    const colors = glassButtonColors[colorScheme];

    const glassColor: string = props.color || colors.glassColor;
    const buttonHeight: DimensionValue | null = props.height || 104;
    const buttonWidth: DimensionValue | null = props.width || "48%";
    const iconSize: number = props.iconSize || 40;
    const iconColor: string = props.iconColor || colors.icon;

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
                <TouchableOpacity style={styles.button} onPress={props.onPress}>
                    <IconSymbol name={props.icon} style={{alignSelf: 'center'}} size={iconSize} color={iconColor} />
                    <Text style={styles.buttonLabel}>{props.label}</Text>
                </TouchableOpacity>
            </GlassedView>
        </View>
    );
}