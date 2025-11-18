import { createSlice } from "@reduxjs/toolkit";

interface IReportCreationState {
    step: "privacyStep" | "categoryStep" | "levelStep" | "policeStep" | "finalStep" | "reset";
    report: {
        isPublic: boolean;
        forPolice: boolean;
        category: number;
        level: number;
        police: boolean;
    }
}
const initialReportState: IReportCreationState = {
    step: "privacyStep",
    report: {
        isPublic: false,
        forPolice: false,
        category: 0,
        level: 1,
        police: false,
    },
}

const reportCreationSlice = createSlice({
    name: "reportCreation",
    initialState: initialReportState,
    reducers: {
        nextStep: (state, action) => {
            state.step = action.payload;
        },
        updateReport: (state, action) => {
            state.report = { ...state.report, ...action.payload };
        },
        resetReport: (state) => {
            state.step = "privacyStep";
        }
    },
});

export const { nextStep, updateReport ,resetReport} = reportCreationSlice.actions;
export default reportCreationSlice.reducer;