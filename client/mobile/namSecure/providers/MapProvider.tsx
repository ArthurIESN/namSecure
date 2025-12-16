import { createContext, useContext, useState } from "react";
import type { MemberLocation, Report, UserPosition } from "@/types/components/map";

interface MapContextType {
    userPosition: UserPosition | null;
    memberLocations: { [memberId: number]: MemberLocation };
    reports: { [reportId: number]: Report };
    setUserPosition: (position: UserPosition | null) => void;
    setMemberLocations: (locations: { [memberId: number]: MemberLocation }) => void;
    setReports: (reports: { [reportId: number]: Report }) => void;
}

// Création du contexte
const MapContext = createContext<MapContextType | undefined>(undefined);

// Provider

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userPosition, setUserPosition] = useState<UserPosition | null>(null);
    const [memberLocations, setMemberLocations] = useState<{ [memberId: number]: MemberLocation }>({});
    const [reports, setReports] = useState<{ [reportId: number]: Report }>({});

    const value: MapContextType = {
        userPosition,
        memberLocations,
        reports,
        setUserPosition,
        setMemberLocations,
        setReports,
    };

    return (
        <MapContext.Provider value={value}>
            {children}
        </MapContext.Provider>
    );
};


export const useMap = () => {
    const context = useContext(MapContext);
    if (!context) {
        throw new Error("useMap must be used within a MapProvider");
    }
    return context;
};

