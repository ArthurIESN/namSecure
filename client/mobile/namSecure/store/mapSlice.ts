import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Region} from "react-native-maps";

export interface MapMarker{
    id :string,
    latitude: number,
    longitude: number,
    title?: string,
    description?: string,
}

export interface MapState {
    userRegion: Region | null;
    viewRegion : Region | null;
    markers: MapMarker[];
}

const initialState: MapState = {
    userRegion: null,
    viewRegion: null,
    markers: [],
}

const mapSlice = createSlice({
    name: "map",
    initialState,
    reducers: {
        setUserRegion(state, action: PayloadAction<Region>) {
            state.userRegion = action.payload;
        },
        setViewRegion(state, action: PayloadAction<Region>) {
            state.viewRegion = action.payload;
            console.log(`je suis ici dans le redux ${action.payload}`);
        },
        addMarker : (state, action: PayloadAction<MapMarker>) => {
            const exists = state.markers.some(m => m.id === action.payload.id);
            if(!exists){
                state.markers.push(action.payload);
            }
        },
        updateMarker : (state, action: PayloadAction<MapMarker>) => {
            const index = state.markers.findIndex(m => m.id === action.payload.id);
            if(index !== -1){
                state.markers[index] = action.payload;
            }
        },
        removeMarker: (state, action: PayloadAction<string>) => {
            state.markers = state.markers.filter(m => m.id !== action.payload);
        },
        clearMarkers: (state) => {
            state.markers = [];
        },
        resetMapState: () => {
            return initialState;
        },
    },
});

export const {
    setUserRegion,
    setViewRegion,
    addMarker,
    updateMarker,
    removeMarker,
    clearMarkers,
} = mapSlice.actions;

export default mapSlice.reducer;