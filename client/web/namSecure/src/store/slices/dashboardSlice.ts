import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type { IDashboardState } from "@/types/components/dashboard/dashboard";

const initialState: IDashboardState =
{
    tableIndex: 0,
    data: [],
    onlyShowFirstColumnOfForeignKey: true,
    limit: 1,
    offset: 0,
    search: "",
    updateTableData: async (index: number): Promise<void> => { console.error("updateTableData function not implemented" + index); },
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