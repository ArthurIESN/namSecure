import tables from "@/tableData/tables";
import type { ITable } from "@/tableData/tables"
import type { ISideBarProps } from "@/types/components/dashboard/sideBar"


import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

import {type ReactElement, useEffect, useState} from "react";
import type {IDashboardState} from "@/types/components/dashboard/dashboard.ts";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { updateDashboardState } from "@/store/slices/dashboardSlice";

export function SideBar(props: ISideBarProps): ReactElement
{
    const dashboard: IDashboardState = useAppSelector(state => state.dashboard)
    const dispatch = useAppDispatch();

    const switchTable = async (index: number): Promise<void> =>
    {
        await props.updateTableData(index);
        dispatch(updateDashboardState({
            tableIndex: index,
            offset: 0,
            search: "",
        }));


    }


    return (
        <div className="pb-12 w-80 border-r h-screen bg-[rgb(234,223,198)]">
            <div>
                <div className="flex flex-col items-center pt-4">
                    <div className="flex items-center mr-16">
                        <div className="w-1 h-8 bg-[rgb(242,178,62)] mr-2"></div>
                        <p className="text-3xl font-bold">NamSecure</p>
                    </div>
                    <p className="text-3xl font-bold mt-2 ml-28">BackOffice</p>
                </div>
                <div className="flex items-center justify-center h-72">
                    <img src="/logo.png" alt="Logo" className="h-64 w-auto" />
                </div>
            </div>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <ScrollArea className="">
                        <div className="space-y-1">
                            {tables.map((table: ITable, index: number) =>
                                (
                                    <Button
                                        key={index}
                                        variant={"ghost"}
                                        style={dashboard.tableIndex === index ? { backgroundColor: 'rgb(242,178,62)' } : undefined}
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