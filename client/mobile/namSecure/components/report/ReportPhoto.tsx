import GlassButton from "@/components/ui/buttons/GlassButton";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateReport, nextStep } from "@/store/ReportCreateSlice";
import { View, Image, StyleSheet, Text } from "react-native";
import GlassedView from "@/components/glass/GlassedView";
import * as ImagePicker from "expo-image-picker";
import {ImagePickerResult} from "expo-image-picker";

export default function ReportPhoto() {
    const dispatch = useDispatch();
    const [error, setError] = useState<string | null>(null);

    const takePhoto = async () =>
    {
        console.log('🎥 takePhoto called');

        const hasPermission: boolean = await cameraPermission();
        console.log('📸 hasPermission:', hasPermission);
        if (!hasPermission) {
            console.log('❌ Camera permission denied');
            return;
        }

        try
        {
            console.log('📱 Launching camera...');
            const result: ImagePickerResult = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            console.log('✅ Camera result:', result);

            if (!result.canceled)
            {
                const uri: string = result.assets[0].uri;
                console.log('🖼️ Image URI:', uri);
                dispatch(updateReport({ photoPath: uri }));
                dispatch(nextStep("finalStep"));
            } else {
                console.log('⚠️ Camera cancelled by user');
            }
        } catch (err: any)
        {
            console.log('💥 Error in takePhoto:', err.message);
            setError(err.message);
            console.error(err);
        }
    };

    const cameraPermission = async () =>
    {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted')
        {
            setError("Camera permission is required to take a photo.");
            return false;
        }
        return true;
    }

    const handleImageError = () => {
        setError("Failed to load image");
    };

    return(
        <View style={styles.container}>
            {error && (
                <GlassedView
                    color={"FF3B3090"}
                    isInteractive={true}
                    glassEffectStyle={"clear"}
                    intensity={50}
                    tint={"default"}
                    style={styles.errorContainer}
                >
                    <Text style={styles.errorText}>{error}</Text>
                </GlassedView>
            )}

            <View style={styles.buttonRow}>
                <GlassButton
                    icon="xmark"
                    label="Skip"
                    onPress={() =>
                    {
                        dispatch(nextStep("finalStep"));
                    }}
                    height={290}
                    width={"48%"}
                    iconSize={40}
                    iconColor={"FF232390"}
                />

                <GlassButton
                    icon="camera"
                    label="Take Photo"
                    onPress={() => {
                        takePhoto();
                    }}
                    height={290}
                    width={"48%"}
                    iconSize={40}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 0,
        width: "100%",
        marginTop: 10,
    },
    errorContainer: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        width: "100%",
        alignItems: "center",
    },
    errorText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center",
    },
    imageContainer: {
        borderRadius: 20,
        paddingHorizontal: 20,
        borderWidth: 1.5,
        borderColor: "rgba(218,218,218)",
        marginBottom: 20,
        height: 300,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 16,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 16,
        marginTop: 20,
    },
});
