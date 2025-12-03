import GlassButton from "@/components/ui/buttons/GlassButton";
import {StyleSheet, ActivityIndicator } from "react-native";
import { api, EAPI_METHODS } from "@/utils/api/api";
import type { IReport } from "@namSecure/shared/types/report/report";
import React, { useState } from "react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import {nextStep, resetReport} from "@/store/ReportCreateSlice";
import { useDispatch } from "react-redux";


export default function ReportPost() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const dispatch = useDispatch();

    const reportData = useSelector(
        (state: RootState) => state.reportCreation.report
    );
    const location = useSelector((state: RootState) => state.location);

    const handleSubmit = async () => {
        if (!location.coordinates) {
            setError("Location not available. Please enable GPS.");
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
                id_type_danger: reportData.category?.id, // ID du type de danger
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
            <GlassButton
                icon="trash.circle.fill"
                label={"Cancel"}
                onPress={() => dispatch(resetReport())}
                height={290}
                width={"34%"}
                iconSize={60}
                color={"FF232350"}
            />
            <GlassButton
                icon="checkmark.circle.fill"
                label={isLoading ? "Submitting..." : "Finish Report"}
                onPress={handleSubmit}
                height={290}
                width={"62%"}
                iconSize={60}
                color={"50E45B50"}
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
});
