import React, {ReactElement} from 'react';
import { GlassContainer, isLiquidGlassAvailable } from 'expo-glass-effect';
import { GlassedContainerProps } from "@/types/components/glass/glass";
import { View } from "react-native";

export default function GlassedContainer(props: GlassedContainerProps): ReactElement
{
    const {...rest} = props;

    function renderGlassContainer(): ReactElement
    {
        return (
            <GlassContainer
                {...rest}
            >
                {props.children}
            </GlassContainer>
        );
    }

    function renderBlurContainer(): ReactElement
    {
        return (
            <View
                {...rest}
            >
                {props.children}
            </View>
        );
    }

    return isLiquidGlassAvailable() ? renderGlassContainer() : renderBlurContainer();
}