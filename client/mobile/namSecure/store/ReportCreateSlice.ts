import { createSlice } from "@reduxjs/toolkit";


const reportCreationSlice = createSlice({
    name: "reportCreation",
    initialState: {
        step: 1,
        event: {
            privacy: "private",
            category: "",
            level: 1,
            police: false,
        },

    },
    reducers: {
        nextStep: (state) => {
            state.step++;
        },
        pastStep: (state) => {
            state.step--;
        },
        updateEvent: (state, action) => {
            state.event = { ...state.event, ...action.payload };
        },
    },
});

export const { nextStep, updateEvent, pastStep } = reportCreationSlice.actions;
export default reportCreationSlice.reducer;