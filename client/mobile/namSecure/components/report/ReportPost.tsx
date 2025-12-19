import GlassButton from "@/components/ui/buttons/GlassButton";
import {StyleSheet, ActivityIndicator, View, Text } from "react-native";
import { api, EAPI_METHODS } from "@/utils/api/api";
import type { IReport } from "@namSecure/shared/types/report/report";
import React, { useState } from "react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import {nextStep, resetReport} from "@/store/ReportCreateSlice";
import { useDispatch } from "react-redux";
import {GlassContainer} from "expo-glass-effect";
import GlassedView from "@/components/glass/GlassedView";
import { useRouter } from "expo-router";


export default function ReportPost() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const reportData = useSelector(
        (state: RootState) => state.reportCreation.report
    );
    const location = useSelector((state: RootState) => state.location);

    const handleSubmit = async () => {
        if (!location.coordinates) {
            setError("Location not available. Please retry later.");
            console.log("ERROR: No coordinates");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const reportPayload = {
                date: new Date().toISOString(),
                lat: location.coordinates.latitude,
                lng: location.coordinates.longitude,
                street: location.address || "Unknown location",
                level: reportData.level,
                is_public: reportData.isPublic,
                for_police: reportData.forPolice,
                photo_path: null,
                id_type_danger: reportData.category, // ID du type de danger
            };

            const response = await api<IReport>(
                "report",
                EAPI_METHODS.POST,
                reportPayload
            );

            if (response.error) {
                setError(response.errorMessage || "Failed to submit report");
                setSuccess(false);
            } else {
                setSuccess(true);
                dispatch(nextStep("reset"));
                setTimeout(() => {
                    router.push("/(app)/(tabs)/");
                }, 350);
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
            setSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {error && (
                <GlassedView
                    color={"FF3B3090"}
                    isInteractive={true}
                    glassEffectStyle={"clear"}
                    intensity={50}
                    tint={"default"}
                    style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </GlassedView>
            )}

            <GlassButton
                icon="trash.circle.fill"
                label={"Cancel"}
                onPress={() => dispatch(resetReport())}
                height={290}
                width={"34%"}
                iconSize={60}
                //color={"FF232350"}
                iconColor={"FF232390"}
            />
            <GlassButton
                icon="checkmark.circle.fill"
                label={isLoading ? "Submitting..." : "Finish Report"}
                onPress={handleSubmit}
                height={290}
                width={"62%"}
                iconSize={60}
                //color={"50E45B50"}
                iconColor={"50E45B90"}
            />

            {isLoading && (
                <ActivityIndicator
                    size="large"
                    color="#FFFFFF"
                    style={styles.loader}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    loader: {
        marginTop: 20,
        color: "#50e45b",
    },
    errorContainer: {
        //backgroundColor: 'rgba(255, 59, 48, 0.9)',
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
        marginBottom: 16,
        width: '100%',
        alignItems: 'center',
    },
    errorText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
});
