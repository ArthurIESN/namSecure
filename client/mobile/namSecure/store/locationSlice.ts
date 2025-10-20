import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import { LocationState } from '@/types/components/map/map'



const initialState : LocationState = {
    address : '',
    coordinates: null,
    loading: false,
    error: null
}

const locationSlice = createSlice({
    name : 'location',
    initialState,
    reducers:{
        setAddress: (state, action: PayloadAction<string>) => {
            state.address = action.payload;
        },

        setCoordinates : (state,action : PayloadAction<{latitude : number; longitude: number}>) => {
            state.coordinates = action.payload;
        },
        setError: (state,action: PayloadAction<string>) => {
            state.error = action.payload;
        }
    }
})

export const {setAddress, setCoordinates, setError} = locationSlice.actions;
export default locationSlice.reducer;