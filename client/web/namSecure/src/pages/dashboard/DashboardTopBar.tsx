import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {useEffect, useRef, useState} from "react";
import type {IDashboardState} from "@/types/components/dashboard/dashboard";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {updateDashboardState} from "@/store/slices/dashboardSlice";
import tables from "@/tableData/tables.ts";

export function DashboardTopBar()
{
    const dashboard: IDashboardState = useAppSelector(state => state.dashboard)
    const dispatch = useAppDispatch();

    const searchTimer = useRef<NodeJS.Timeout | null>(null);

    async function updatePage(newValue: number): Promise<void>
    {
        if(newValue + 1 < 1) return;
        dispatch(updateDashboardState({offset: newValue}));
    }

    async function updateLimit(newValue: number): Promise<void>
    {
        if(newValue < 1) return;
        dispatch(updateDashboardState({limit: newValue, offset: 0}));
    }

    function add(): void
    {
        dispatch(updateDashboardState({formOpen: true}));
    }

    function search(search: string): void
    {
        if (searchTimer.current)
        {
            clearTimeout(searchTimer.current);
        }

        searchTimer.current = setTimeout(() =>
        {
            dispatch(updateDashboardState({search: search}));
        }, 200);
    }

    function toggleForeignKeyColumn(onlyFirst: boolean): void
    {
        dispatch(updateDashboardState({onlyShowFirstColumnOfForeignKey: onlyFirst}));
    }

    return (
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-4">
                <span className={"uppercase"}>{tables[dashboard.tableIndex].name} list</span>

                <div className="flex space-x-2">
                    {[1, 5, 10, 25, 50].map((limit) => (
                        <Button key={limit} variant="outline" size="sm" onClick={() => updateLimit(limit)}>
                            {limit}
                        </Button>
                    ))}
                </div>

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

            <div>
                <input type={"checkbox"} onChange={() => toggleForeignKeyColumn(!dashboard.onlyShowFirstColumnOfForeignKey)} checked={dashboard.onlyShowFirstColumnOfForeignKey} className="mr-2" />Only first FK column
                <input placeholder="Search..." className="border rounded-md px-2 py-1 mr-5" onInput={() => search((event.target as HTMLInputElement).value)} />
                <Button variant="default" onClick={add}>ADD {tables[dashboard.tableIndex].table.name.toUpperCase()}</Button>
            </div>

        </div>
    );
}
