import {GlassContainer, GlassStyle, GlassView, isLiquidGlassAvailable} from 'expo-glass-effect';
import {BlurTint, BlurView} from 'expo-blur';
import React, { ReactNode } from "react";

type BlurNativeProps = React.ComponentProps<typeof BlurView>;
type GlassNativeProps = React.ComponentProps<typeof GlassView>;

export interface GlassedViewProps  extends Omit<BlurNativeProps & GlassNativeProps, 'intensity' | 'tint'>
{
    color: string;
    children: ReactNode;

    // Glass specific
    isInteractive: boolean;

    // Glass specific
    glassEffectStyle: GlassStyle;

    // Blur specific
    intensity: number;

    // Blur specific
    tint: BlurTint;
}



export default function GlassedView({ color, isInteractive, glassEffectStyle, intensity, tint, style, children, ...rest }: React.PropsWithChildren<GlassedViewProps>) // @Todo use typescript
{
    // Render a glassed view
    // ONLY AVAILABLE ON IOS26 AND ABOVE
    function renderGlassView()
    {
        return (
            <GlassView
                glassEffectStyle={glassEffectStyle}
                isInteractive={isInteractive}
                tintColor={color}
                style={style}
                {...rest}
            >
                {children}
            </GlassView>
        );
    }

    function renderBlurView()
    {
        return(
            <BlurView
                intensity={intensity}
                tint={tint}
                {...rest}
                style={
                [
                    style,
                    { backgroundColor: "#" + color }
                ]}
            >
                {children}
            </BlurView>
        );
    }

    return isLiquidGlassAvailable() ? renderGlassView() : renderBlurView();
}