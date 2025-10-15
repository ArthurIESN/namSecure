import {GlassView, isLiquidGlassAvailable} from 'expo-glass-effect';
import {BlurView} from 'expo-blur';
import React, {ReactElement} from "react";
import { GlassedViewProps } from "@/types/components/glass/glass";


export default function GlassedView(props: GlassedViewProps): ReactElement
{
    const { glassEffectStyle, isInteractive, style, color, intensity, tint, children, ...rest } = props;

    // Render a glassed view
    // ONLY AVAILABLE ON IOS26 AND ABOVE
    function renderGlassView(): ReactElement
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

    function renderBlurView(): ReactElement
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