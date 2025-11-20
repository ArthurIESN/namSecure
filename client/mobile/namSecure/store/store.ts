import { configureStore } from "@reduxjs/toolkit";
import locationReducer from './locationSlice'
import reportCreation from './ReportCreateSlice'
import mapReducer from './mapSlice'


export const store = configureStore({
    reducer:{
        location:locationReducer,
        reportCreation:reportCreation,
        map : mapReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

