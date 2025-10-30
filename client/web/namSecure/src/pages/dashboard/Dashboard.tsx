import tables from "@/tableData/tables";
import {SideBar} from "@/pages/dashboard/SideBar.tsx";
import {DashboardTable} from "@/pages/dashboard/Table";
import {DashboardTopBar} from "@/pages/dashboard/DashboardTopBar";
import {useEffect} from "react";
import type { IDashboardState } from "@/types/components/dashboard/dashboard";
import { api } from "@/utils/api/api.ts";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { updateDashboardState } from "@/store/slices/dashboardSlice.ts";
import {DashboardForm} from "@/pages/dashboard/DashboardForm.tsx";
//import {AddForm} from "@/pages/dashboard/AddForm.tsx";


export function Dashboard()
{
    const dashboard: IDashboardState = useAppSelector((state) => state.dashboard);
    const dispatch = useAppDispatch();


    const updateTableData = async (index: number): Promise<void> =>
    {
        const fullUrl: string = tables[index].table.url + `?limit=${dashboard.limit}&offset=${dashboard.offset}&search=${encodeURIComponent(dashboard.search)}`;
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
    }, [dashboard.tableIndex, dashboard.limit, dashboard.offset, dashboard.search]);



    return(
        <div className="flex h-screen">
            <SideBar
                updateTableData={updateTableData}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardTopBar/>
                <div className="h-full">
                    <DashboardTable />
                </div>

            </div>
            {dashboard.formOpen && <DashboardForm/>}

        </div>
    )
}