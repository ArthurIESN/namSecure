import { createContext, useContext, useState, useRef, ReactNode } from "react";
import type { MemberLocation, Report, UserPosition } from "@/types/components/map";
import { Region } from "react-native-maps";
import ViewShot from "react-native-view-shot";

interface MapContextType {
    userPosition: UserPosition | null;
    memberLocations: { [memberId: number]: MemberLocation };
    reports: { [reportId: number]: Report };
    cameraPositionRef: React.MutableRefObject<Region | null>;
    mapZoomRef: React.MutableRefObject<number>;
    altitudeRef: React.MutableRefObject<number>;
    setUserPosition: (position: UserPosition | null) => void;
    setMemberLocations: (locations: { [memberId: number]: MemberLocation }) => void;
    setReports: (reports: { [reportId: number]: Report }) => void;
    removeMembersFromTeam: (memberIds: number[]) => void;
    mapScreenshotRef: React.MutableRefObject<any>;
    mapScreenshot: string | null;
    setMapScreenshot: (uri: string | null) => void;
    captureMapScreenshot: () => Promise<void>;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userPosition, setUserPosition] = useState<UserPosition | null>(null);
    const [memberLocations, setMemberLocations] = useState<{ [memberId: number]: MemberLocation }>({});
    const [reports, setReports] = useState<{ [reportId: number]: Report }>({});
    const [mapScreenshot, setMapScreenshot] = useState<string | null>(null);

    const cameraPositionRef = useRef<Region | null>(null);
    const mapZoomRef = useRef<number>(15);
    const altitudeRef = useRef<number>(1000);
    const mapScreenshotRef = useRef<any>(null);

    const captureMapScreenshot = async () => {
        try {
            if (mapScreenshotRef.current) {
                const uri = await mapScreenshotRef.current.capture();
                setMapScreenshot(uri);
            }
        } catch (error) {
            console.error('Error capturing map screenshot:', error);
        }
    };

    const removeMembersFromTeam = (memberIds: number[]) => {
        setMemberLocations(prev => {
            const updated = { ...prev };
            memberIds.forEach(memberId => {
                delete updated[memberId];
            });
            return updated;
        });
    };

    const value: MapContextType = {
        userPosition,
        memberLocations,
        reports,
        cameraPositionRef,
        mapZoomRef,
        altitudeRef,
        setUserPosition,
        setMemberLocations,
        setReports,
        removeMembersFromTeam,
        mapScreenshotRef,
        mapScreenshot,
        setMapScreenshot,
        captureMapScreenshot,
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

