import tables from "@/tableData/tables";
import {SideBar} from "@/pages/dashboard/SideBar.tsx";
import {DashboardTable} from "@/pages/dashboard/Table";
import {DashboardTopBar} from "@/pages/dashboard/DashboardTopBar";
import {useEffect, useState} from "react";
import type { IDashboardState } from "@/types/components/dashboard/dashboard";
import { api } from "@/utils/api/api.ts";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { updateDashboardState } from "@/store/slices/dashboardSlice.ts";
import {AddForm} from "@/pages/dashboard/AddForm.tsx";


export function Dashboard()
{
    const dashboard: IDashboardState = useAppSelector((state) => state.dashboard);
    const dispatch = useAppDispatch();


    const updateTableData = async (index: number): Promise<void> =>
    {
        const fullUrl: string = tables[index].table.url + `?limit=${dashboard.limit}&offset=${dashboard.offset}&search=${dashboard.search}`;
        const response = await api.get(fullUrl);

        dispatch(updateDashboardState(
            {
                tableIndex: index,
                data: response.data,
            }));
    };

    useEffect(() =>
    {
        void updateTableData(dashboard.tableIndex);

        dispatch(updateDashboardState(
        {
            updateTableData
        }));
    }, []);

    return(
        <div className="flex h-screen">
            <SideBar/>
            <div className="flex-1 p-6">
                <DashboardTopBar/>
                <DashboardTable />
            </div>

        </div>
    )
}