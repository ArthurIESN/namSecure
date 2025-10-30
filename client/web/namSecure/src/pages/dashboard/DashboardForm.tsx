import type {IDashboardState, ITableColumnData} from "@/types/components/dashboard/dashboard.ts";
import {useAppDispatch, useAppSelector} from "@/hooks/redux.ts";
import {type ReactElement, useState} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import tables from "@/tableData/tables";
import { ETableColumnType } from "@/types/components/dashboard/dashboard.ts";
import {ForeignSearch} from "@/pages/dashboard/ForeignSearch.tsx";
import {api} from "@/utils/api/api";
import { updateDashboardState } from "@/store/slices/dashboardSlice";

const inputMapping: { [key: ETableColumnType]: string } =
    {
        [ETableColumnType.EMAIL]: "email",
        [ETableColumnType.NUMBER]: "number",
        [ETableColumnType.STRING]: "text",
        [ETableColumnType.DATE]: "date",
        [ETableColumnType.PASSWORD]: "password",
        [ETableColumnType.BOOLEAN]: "checkbox",
    }

export function DashboardForm() {
    const dashboard: IDashboardState = useAppSelector(state => state.dashboard);
    const dispatch = useAppDispatch();

    const handleSubmit = async (e: React.FormEvent) =>
    {
        e.preventDefault();

        const formObject: Record<string, any> = {};

        tables[dashboard.tableIndex].table.columns.forEach((column: ITableColumnData) =>
        {
            const columnName = column.foreignKeyTableData ? (column.foreignKeyTableData.columns[0].name + "_" + column.foreignKeyTableData.name) : column.name;
            const input = document.getElementById(columnName) as HTMLInputElement;
            let value = input?.value;

            if (column.type === ETableColumnType.NUMBER) { // NUMBER
                value = value ? Number(value) : null;
            } else if (column.type === ETableColumnType.BOOLEAN) { // BOOLEAN
                value = input?.checked;
            }

            formObject[columnName] = value;
        })


        const response = await api.post(tables[dashboard.tableIndex].table.url, formObject);

        if(response.status === 201)
        {
            dispatch(updateDashboardState(
                {
                    formOpen: false,
                    tableIndex: dashboard.tableIndex,
                }));
        }
        else
        {
            console.error("Failed to add record:", response);
        }

    };

    const renderInputField = (columnType: ETableColumnType, value: any, name: string, friendlyName: string) =>
    {
        const inputType = inputMapping[columnType];
        return (
            <div className="space-y-2" key={name}>
                <Label htmlFor={name}>{friendlyName}</Label>
                <Input
                    name={name}
                    id={name}
                    type={inputType}
                    defaultValue={value}
                    placeholder={`Enter your ${name}`}
                />
            </div>
        );
    }

    const renderForeignKeyField = (column: ITableColumnData) =>
    {
        return (
            <div className="space-y-2" key={column.name}>
                    <Label htmlFor={column.name}>{column.friendlyName}</Label>
                    <ForeignSearch column={column} placeholder={`Select ${column.friendlyName}`} />
            </div>
        );
    }

    function close(): void
    {
        dispatch(updateDashboardState({formOpen: false}));
    }

    function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>): void
    {
        if (e.target === e.currentTarget)
        {
            close();
        }
    }


    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <Card className="w-full max-w-md mx-auto shadow-2xl border-0">
                <CardHeader>
                    <CardTitle>ADD A {tables[dashboard.tableIndex].name.toUpperCase()}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {tables[dashboard.tableIndex].table.columns.map((column: ITableColumnData) =>
                            (column.foreignKeyTableData) ? renderForeignKeyField(column) : renderInputField(column.type, "", column.name, column.friendlyName)
                        )}
                        <Button type="submit" className="w-full">
                            Soumettre
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}