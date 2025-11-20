import tables from "@/tableData/tables";
import {DashboardSideBar} from "@/components/dashboard/DashboardSideBar.tsx";
import {DashboardTable} from "@/components/dashboard/DashboardTable.tsx";
import {DashboardTopBar} from "@/components/dashboard/DashboardTopBar.tsx";
import {useEffect, useState} from "react";
import type { IDashboardState } from "@/types/components/dashboard/dashboard";
import { api } from "@/utils/api/api.ts";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { updateDashboardState } from "@/store/slices/dashboardSlice.ts";
import {DashboardForm} from "@/components/dashboard/DashboardForm.tsx";
import "@/styles/dashboard/animations.css";

export function Dashboard()
{
    const dashboard: IDashboardState = useAppSelector((state) => state.dashboard);
    const dispatch = useAppDispatch();
    const [isAnimating, setIsAnimating] = useState(false);

    const updateTableData = async (index: number): Promise<void> =>
    {
        const fullUrl: string = tables[index].table.url + `?limit=${dashboard.limit}&offset=${dashboard.offset}&search=${encodeURIComponent(dashboard.search)}`;
        const response = await api.get(fullUrl);

        dispatch(updateDashboardState(
        {
            tableIndex: index,
            data: response.data.slice(0, dashboard.limit),
            hasMoreData: response.data.length === dashboard.limit
        }));
    };

    const updateWithAnimation = async (index: number): Promise<void> =>
    {
        setIsAnimating(true);
        await updateTableData(index);
        setTimeout(() => setIsAnimating(false), 500);
    }

    useEffect(() =>
    {
        void updateWithAnimation(dashboard.tableIndex);
    }, [dashboard.tableIndex, dashboard.limit, dashboard.offset, dashboard.search]);


    return(
        <div className="flex h-screen">
            <DashboardSideBar
                updateTableData={updateTableData}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardTopBar/>
                <div className={`h-full ${isAnimating ? 'fade-in' : ''}`}>
                    <DashboardTable />
                </div>

            </div>
            {dashboard.formOpen && <DashboardForm updateTableData={updateTableData} />}

        </div>
    )
}