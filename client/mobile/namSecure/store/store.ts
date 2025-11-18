import { configureStore } from "@reduxjs/toolkit";
import locationReducer from './locationSlice'
import reportCreation from './ReportCreateSlice'

export const store = configureStore({
    reducer:{
        location:locationReducer,
        reportCreation:reportCreation,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

