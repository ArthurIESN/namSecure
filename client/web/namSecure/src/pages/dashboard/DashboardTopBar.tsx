import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {useState} from "react";
import type {IDashboardState} from "@/types/components/dashboard/dashboard";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {updateDashboardState} from "@/store/slices/dashboardSlice";

export function DashboardTopBar()
{
    const dashboard: IDashboardState = useAppSelector(state => state.dashboard)
    const dispatch = useAppDispatch();

    function updatePage(newValue: number): void
    {
        if(newValue + 1 < 1) return;
        dispatch(updateDashboardState({offset: newValue}));

        void dashboard.updateTableData(dashboard.tableIndex);
    }

    return (
        <div className="flex items-center justify-between p-4 border-b">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
                {/* Table Name */}
                <span>TableName</span>

                {/* Limit Buttons */}
                <div className="flex space-x-2">
                    {[5, 10, 25, 50].map((limit) => (
                        <Button key={limit} variant="outline" size="sm">
                            {limit}
                        </Button>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => updatePage(dashboard.offset - 1)}>
                        {"<"}
                    </Button>
                    <input className="text-center" value={dashboard.offset + 1} size={String(dashboard.offset + 1).length} />
                    <Button variant="outline" size="sm" onClick={() => updatePage(dashboard.offset + 1)}>
                        {">"}
                    </Button>
                </div>
            </div>

            {/* Right Section */}
            <Button variant="default">Créer</Button>
        </div>
    );
}
