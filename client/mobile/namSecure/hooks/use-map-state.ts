import {useSelector, useDispatch} from "react-redux";
import {useCallback} from "react";
import {RootState,AppDispatch} from "@/store/store";
import {
    setUserRegion,
    addMarker,
    updateMarker,
    removeMarker,
    clearMarkers,
    MapMarker, setViewRegion
} from "@/store/mapSlice";
import {Region} from "react-native-maps";

export const useMapState = () => {
    const region = useSelector((state : RootState) => state.map.userRegion);
    const viewRegion = useSelector((state : RootState) => state.map.viewRegion);
    const markers = useSelector((state : RootState) => state.map.markers);
    const dispatch : AppDispatch = useDispatch();

    const setUserMapRegion = useCallback((region: Region) => {
        dispatch(setUserRegion(region));
    }, [dispatch]);

    const setMapViewRegion = useCallback((region: Region) => {
        dispatch(setViewRegion(region));
    }, [dispatch]);

    const addMapMarker = useCallback((marker: MapMarker) => {
        dispatch(addMarker(marker));
    }, [dispatch]);

    const updateMapMarker = useCallback((marker: MapMarker) => {
        dispatch(updateMarker(marker));
    }, [dispatch]);

    const removeMapMarker = useCallback((id: string) => {
        dispatch(removeMarker(id));
    }, [dispatch]);

    const clearMapMarkers = useCallback(() => {
        dispatch(clearMarkers());
    }, [dispatch]);

    return {
        region,
        viewRegion,
        markers,
        setUserMapRegion,
        setMapViewRegion,
        addMapMarker,
        updateMapMarker,
        removeMapMarker,
        clearMapMarkers,
    };
}
