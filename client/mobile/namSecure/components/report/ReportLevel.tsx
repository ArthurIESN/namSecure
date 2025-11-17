import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { nextStep, updateEvent } from "@/store/ReportCreateSlice";
import {useDispatch} from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import Slider from '@react-native-community/slider';
import GlassButton from "@/components/ui/buttons/GlassButton";

export default function ReportLevel() {
    const dispatch = useDispatch();
    const [sliderValue, setSliderValue] = useState(1);

    const getColorForValue = (value: number) => {
        if (value <= 1.33) {
            const ratio = value / 1.33;
            return interpolateColor("#FFD700", "#FF8C00", ratio);
        } else {
            const ratio = (value - 1.33) / 1.67;
            return interpolateColor("#FF8C00", "#FF0000", ratio);
        }
    };

    const interpolateColor = (color1: string, color2: string, ratio: number) => {
        const hex = (x: string) => parseInt(x, 16);
        const r1 = hex(color1.substring(1, 3));
        const g1 = hex(color1.substring(3, 5));
        const b1 = hex(color1.substring(5, 7));
        const r2 = hex(color2.substring(1, 3));
        const g2 = hex(color2.substring(3, 5));
        const b2 = hex(color2.substring(5, 7));

        const r = Math.round(r1 + (r2 - r1) * ratio);
        const g = Math.round(g1 + (g2 - g1) * ratio);
        const b = Math.round(b1 + (b2 - b1) * ratio);

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    const getLabelForValue = (value: number) => {
        if (value <= 1.33) return "Low";
        if (value <= 2.66) return "Medium";
        return "High";
    };

    const handleSlidingComplete = (value: number) => {
        const level = Math.round(value);
        dispatch(updateEvent({ level }));
        dispatch(nextStep());
    };

    return (
        <View style={styles.container}>
            <View style={styles.sliderContainer}>
                <LinearGradient
                    colors={["#FFD700", "#FF8C00", "#FF0000"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientTrack}
                />
                <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={3}
                    step={1}
                    value={sliderValue}
                    onValueChange={setSliderValue}
                    minimumTrackTintColor="transparent"
                    maximumTrackTintColor="transparent"
                    thumbTintColor={getColorForValue(sliderValue)}
                />
            </View>
            <Text style={styles.label}>
                {getLabelForValue(sliderValue)}
            </Text>
            <GlassButton
                icon=""
                label="validate"
                onPress={() => {handleSlidingComplete(sliderValue)}}
                height={60}
                iconSize={0}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 40,
        paddingHorizontal: 20,
        alignItems: "center",
        width: "100%",
    },
    sliderContainer: {
        width: "90%",
        position: "relative",
        marginBottom: 20,
    },
    gradientTrack: {
        height: 8,
        borderRadius: 4,
        position: "absolute",
        width: "100%",
        top: 20,
    },
    slider: {
        width: "100%",
        height: 40,
    },
    label: {
        fontSize: 18,
        fontWeight: "700",
        color: "#000",
        marginTop: 10,
    },
});
