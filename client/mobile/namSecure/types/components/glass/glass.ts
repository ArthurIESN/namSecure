import React, { ReactNode } from "react";
import { BlurTint, BlurView } from "expo-blur";
import { GlassStyle, GlassView } from "expo-glass-effect";

type BlurNativeProps = React.ComponentProps<typeof BlurView>;
type GlassNativeProps = React.ComponentProps<typeof GlassView>;

export interface GlassedViewProps  extends Omit<BlurNativeProps & GlassNativeProps, 'intensity' | 'tint'>
{
    color: string;
    children: ReactNode;

    // Glass specific
    // Only set when mounted, cannot be changed after.
    isInteractive: boolean;

    // Glass specific
    glassEffectStyle: GlassStyle;

    // Blur specific
    intensity: number;

    // Blur specific
    tint: BlurTint;
}

export interface GlassedContainerProps
{
    children: ReactNode;
}