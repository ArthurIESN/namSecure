import { createContext, useContext, useState, useRef } from "react";
import type { MemberLocation, Report, UserPosition } from "@/types/components/map";
import { Region } from "react-native-maps";

interface MapContextType {
    userPosition: UserPosition | null;
    memberLocations: { [memberId: number]: MemberLocation };
    reports: { [reportId: number]: Report };
    cameraPositionRef: React.MutableRefObject<Region | null>;
    mapZoomRef: React.MutableRefObject<number>;
    mapCenterRef: React.MutableRefObject<{ lat: number; lng: number } | null>;
    altitudeRef: React.MutableRefObject<number>;
    setUserPosition: (position: UserPosition | null) => void;
    setMemberLocations: (locations: { [memberId: number]: MemberLocation }) => void;
    setReports: (reports: { [reportId: number]: Report }) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userPosition, setUserPosition] = useState<UserPosition | null>(null);
    const [memberLocations, setMemberLocations] = useState<{ [memberId: number]: MemberLocation }>({});
    const [reports, setReports] = useState<{ [reportId: number]: Report }>({});

    const cameraPositionRef = useRef<Region | null>(null);
    const mapZoomRef = useRef<number>(15);
    const mapCenterRef = useRef<{ lat: number; lng: number } | null>(null);
    const altitudeRef = useRef<number>(1000);

    const value: MapContextType = {
        userPosition,
        memberLocations,
        reports,
        cameraPositionRef,
        mapZoomRef,
        mapCenterRef,
        altitudeRef,
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
