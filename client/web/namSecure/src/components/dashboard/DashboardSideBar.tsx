import tables from "@/tableData/tables.ts";
import type { ITable } from "@/types/components/dashboard/dashboard.ts";

import { Button } from "@/components/ui/button.tsx"
import { ScrollArea } from "@/components/ui/scroll-area.tsx"

import {type ReactElement} from "react";
import type {IDashboardState, IDashboardSideBarProps} from "@/types/components/dashboard/dashboard.ts";
import { useAppSelector, useAppDispatch } from "@/hooks/redux.ts";
import { updateDashboardState } from "@/store/slices/dashboardSlice.ts";
import { useAuth } from "@/context/auth/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export function DashboardSideBar(props: IDashboardSideBarProps): ReactElement
{
    const dashboard: IDashboardState = useAppSelector(state => state.dashboard)
    const dispatch = useAppDispatch();
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const switchTable = async (index: number): Promise<void> =>
    {
        await props.updateTableData(index);
        dispatch(updateDashboardState(
        {
            tableIndex: index,
            offset: 0,
            search: "",
        }));
    }

    const handleLogout = async (): Promise<void> =>
    {
        try
        {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
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
                <div className="flex items-center justify-center">
                    <p>user.first_name user.last_name {/* user.first_name user.last_name */}</p>
                </div>
            </div>
            <div className="space-y-4 py-4 flex flex-col h-[calc(100vh-420px)]">
                <div className="px-3 py-2 flex-1 overflow-y-auto">
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
                <div className="px-3 py-2 ">
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    )
}