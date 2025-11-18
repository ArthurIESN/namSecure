import GlassButton from "@/components/ui/buttons/GlassButton";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateReport, nextStep } from "@/store/ReportCreateSlice";
import { api, EAPI_METHODS } from "@/utils/api/api";
import type { ITypeDanger } from "@namSecure/shared/types/type_danger/type_danger";
import {View, Text } from "react-native";

export default function ReportCategory() {
    const dispatch = useDispatch();
    const [typeDangers, setTypeDangers] = useState<ITypeDanger[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTypeDangers = async () => {
            try {
                const response = await api<ITypeDanger[]>('typeDanger?limit=10&offset=0', EAPI_METHODS.GET);

                if (response.error) {
                    setError(response.errorMessage || "Erreur lors du chargement des catégories");
                } else if (response.data) {
                    setTypeDangers(response.data);
                }
            } catch (err) {
                setError("Erreur lors du chargement des catégories");
                console.error(err);
            }
        };
        fetchTypeDangers();
    }, []);
    if (error) {
        return (
            <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: 'red' }}>{error}</Text>
            </View>
        );
    }

    return (
        <>
            {typeDangers.map((typeDanger) => (
                <GlassButton
                    key={typeDanger.id}
                    icon={typeDanger.icon}
                    label={typeDanger.name}
                    onPress={() => {
                        dispatch(updateReport({ category: typeDanger }));
                        dispatch(nextStep("policeStep"));
                    }}
                />
            ))}
        </>
    );
}
