import React, {ReactElement} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import Text from '@/components/ui/Text';
import {GlassContainer} from 'expo-glass-effect';
import {LinearGradient} from 'expo-linear-gradient';
import GlassedView from "@/components/glass/GlassedView";
import {IconSymbol} from "@/components/ui/symbols/IconSymbol";
import {router} from "expo-router";
import {useTheme} from "@/providers/ThemeProvider";
import {styles as createStyles, bubbleMapColors} from "@/styles/components/map/bubbleMap";

interface BubbleMapProps {
    address?: string | null;
}

export default function BubbleMap({address}: BubbleMapProps): ReactElement {
    const {colorScheme} = useTheme();
    const styles = createStyles(colorScheme);
    const colors = bubbleMapColors[colorScheme];

    return (
        <GlassContainer spacing={16} style={styles.glassContainer}>
            <GlassedView
                glassEffectStyle="clear"
                isInteractive={true}
                color={colors.glassColor}
                intensity={12}
                tint={"default"}
                style={[styles.glassBox, {marginTop: 16}]}
            >
                <LinearGradient
                    colors={[colors.gradientStart, colors.gradientEnd]}
                    style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.viewContent}>
                    <IconSymbol name="mappin" size={24} color={colors.iconColor}/>
                    <Text>{address || "Chargement de l'adresse..."}</Text>
                    <Pressable
                        onPress={() => router.push('/(app)/(profil)/profil')}
                        style={styles.profilButton}
                    >
                        <IconSymbol name="person.circle" size={48} color={colors.iconColor}/>
                    </Pressable>
                </View>
            </GlassedView>
        </GlassContainer>
    );
}
