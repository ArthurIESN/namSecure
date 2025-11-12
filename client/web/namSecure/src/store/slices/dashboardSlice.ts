import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {EDashboardFormMode, type IDashboardState} from "@/types/components/dashboard/dashboard";

const initialState: IDashboardState =
{
    tableIndex: 0,
    data: [],
    onlyShowFirstColumnOfForeignKey: true,
    limit: 10,
    offset: 0,
    formOpen: false,
    formMode: EDashboardFormMode.ADD,
    currentRowId: null,
    multipleForeignKeyItems: {}
};

const dashboardSlice = createSlice(
    {
        name: "dashboard",
        initialState,
        reducers:
            {
                updateDashboardState: (state: IDashboardState, action: PayloadAction<Partial<IDashboardState>>) =>
                {
                    Object.assign(state, action.payload);
                }

            }
    });
export const { updateDashboardState } = dashboardSlice.actions;
export default dashboardSlice.reducer;