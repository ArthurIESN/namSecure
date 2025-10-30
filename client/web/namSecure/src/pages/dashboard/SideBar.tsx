import tables from "@/tableData/tables";
import type { ITable } from "@/tableData/tables"
import type { ISideBarProps } from "@/types/components/dashboard/sideBar"


import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

import {type ReactElement, useEffect, useState} from "react";
import type {IDashboardState} from "@/types/components/dashboard/dashboard.ts";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { updateDashboardState } from "@/store/slices/dashboardSlice";
import {api} from "@/utils/api/api.ts";

export function SideBar(): ReactElement
{
    const dashboard: IDashboardState = useAppSelector(state => state.dashboard)
    const dispatch = useAppDispatch();

    const switchTable = async (index: number): Promise<void> =>
    {
        dispatch(updateDashboardState(
            {
                offset: 0,
                search: "",
            }));

        await dashboard.updateTableData(index);
    }


    return (
        <div className="pb-12 w-80 border-r h-screen">
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-2xl font-semibold">Tables</h2>
                    <ScrollArea className="h-[calc(100vh-6rem)]">
                        <div className="space-y-1">
                            {tables.map((table: ITable, index: number) =>
                                (
                                    <Button
                                        key={index}
                                        variant={dashboard.tableIndex === index ? "secondary" : "ghost"}
                                        className="w-full justify-start "
                                        onClick={() => { void switchTable(index)}}
                                    >
                                        {table.name}
                                    </Button>
                                ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}