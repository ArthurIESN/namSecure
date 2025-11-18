import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import GlassButton from "@/components/ui/buttons/GlassButton";
import {nextStep, updateReport} from "@/store/ReportCreateSlice";
import { useDispatch } from "react-redux";
import GlassedView from "@/components/glass/GlassedView";

export default function ReportLevel() {
    const dispatch = useDispatch();
    const [sliderValue, setSliderValue] = useState<number>(0);

    const getSeverityLevel = (value: number):number => {
        if (value < 0.33) return 1;
        if (value < 0.66) return 2;
        return 3;
    };

    const severityLevel = getSeverityLevel(sliderValue);

    const getSeverityLabel = (value: number):string => {
        if(severityLevel <= 1) {
            return "Moderate";
        } else if (severityLevel === 2) {
            return "High";
        } else {
            return "Very High";
        }
    }


    return (
        <View style={styles.container}>
    <GlassedView
        color={"FFFFFF50"} // 8 digits
        isInteractive={true}
        glassEffectStyle={"regular"}
        intensity={50}
        tint={"default"}
        style={styles.glassedView}
        >

            <View style={styles.sliderContainer}>
                {/* Gradient de fond (invisible) */}
                <View style={styles.gradientTrack}>
                    <LinearGradient
                        colors={["#fffb00", "#ff9900", "#FF0000"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradient}
                    />
                    <View
                        style={[
                            styles.gradientMask,
                            { width: `${(1 - sliderValue) * 100}%` }
                        ]}
                    />
                </View>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={1}
                        value={sliderValue}
                        onValueChange={setSliderValue}
                        minimumTrackTintColor="transparent"
                        maximumTrackTintColor="transparent"
                        thumbTintColor="#FFFFFF"
                    />
            </View>
    </GlassedView>
            <GlassButton
                icon="checkmark"
                label={getSeverityLabel(sliderValue)}
                onPress={() => {
                    dispatch(updateReport({ level: severityLevel }));
                    dispatch(nextStep("categoryStep"));
                }}
                height={80}
                width={330}
                iconSize={0}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    glassedView:{
        borderRadius:20,
        paddingHorizontal:20,
        borderWidth: 1.5,
        borderColor: 'rgba(218,218,218)',
    },
    container: {
        padding: 20,
        width: "100%",
        marginTop:10,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#FFFFFF",
        marginBottom: 30,
        textAlign: "center",
    },
    sliderContainer: {
        position: "relative",
        height: 60,
        justifyContent: "center",
    },
    gradientTrack: {
        position: "absolute",
        width: "100%",
        height: 8,
        borderRadius: 4,
        overflow: "hidden",
        alignSelf: "center",
    },
    gradient: {
        width: "100%",
        height: "100%",
    },
    gradientMask: {
        position: "absolute",
        right: 0,
        top: 0,
        height: "100%",
        backgroundColor: "#333333",
    },
    slider: {
        width: "100%",
        height: 60,
    },
    labelsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30,
        paddingHorizontal: 5,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#888888",
        textTransform: "capitalize",
    },
    activeLabel: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 16,
    },
    selectedContainer: {
        alignItems: "center",
        marginTop: 20,
        padding: 15,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 12,
    },
    selectedLabel: {
        fontSize: 14,
        color: "#AAAAAA",
        marginBottom: 5,
    },
    selectedValue: {
        fontSize: 20,
        fontWeight: "700",
    },
});
