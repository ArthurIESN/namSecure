import React from "react";
import {
    EDashboardFormMode,
    ETableColumnType,
    type IDashboardState,
    type ITableColumnData
} from "@/types/components/dashboard/dashboard.ts";
import {useAppDispatch, useAppSelector} from "@/hooks/redux.ts";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import tables from "@/tableData/tables";
import {ForeignSearch} from "@/pages/dashboard/ForeignSearch.tsx";
import {api, type IApiResponse} from "@/utils/api/api";
import {updateDashboardState} from "@/store/slices/dashboardSlice";
import {Checkbox} from "@/components/ui/checkbox";

const inputMapping: { [key: ETableColumnType]: string } =
    {
        [ETableColumnType.EMAIL]: "email",
        [ETableColumnType.NUMBER]: "number",
        [ETableColumnType.STRING]: "text",
        [ETableColumnType.DATE]: "date",
        [ETableColumnType.DATETIME]: "datetime-local",
        [ETableColumnType.PASSWORD]: "password",
        [ETableColumnType.BOOLEAN]: "checkbox",
    }

interface IDashboardFormProps
{
    updateTableData: (index: number) => Promise<void>;
}

export function DashboardForm(props: IDashboardFormProps) {
    const dashboard: IDashboardState = useAppSelector(state => state.dashboard);
    const dispatch = useAppDispatch();

    const [error, setError] =  React.useState<string>("");

    const currentRowData = dashboard.formMode === EDashboardFormMode.EDIT && dashboard.currentRowId !== undefined
        ? dashboard.data[dashboard.currentRowId]
        : null;

    const handleSubmit = async (e: React.FormEvent) =>
    {
        e.preventDefault();

        const formObject: Record<string, any> = {};

        tables[dashboard.tableIndex].table.columns.forEach((column: ITableColumnData) =>
        {
            const currentColumn: ITableColumnData = column.foreignKeyTableData ? column.foreignKeyTableData.columns[0] : column;
            const columnName: string = column.foreignKeyTableData ? (currentColumn.name + "_" + column.foreignKeyTableData.name) : currentColumn.name;
            const input: HTMLInputElement = document.getElementById(columnName) as HTMLInputElement;

            if(!input) return;

            if (currentColumn.type === ETableColumnType.NUMBER)
            {
                formObject[columnName]  = input.value ? Number(input.value) : null;
            }
            else if (column.type === ETableColumnType.BOOLEAN)
            {
                const checkboxState = input.dataset.state
                formObject[columnName]  = checkboxState === "checked";
            }
            else
            {
                if(currentColumn.editable && input.value === "")
                {
                    formObject[columnName]  = null;
                }
                else
                {
                    formObject[columnName]  = input.value;
                }
            }
        });


        try
        {
            dashboard.formMode === EDashboardFormMode.ADD ? await api.post(tables[dashboard.tableIndex].table.url, formObject) : await api.put(tables[dashboard.tableIndex].table.url, formObject);

            dispatch(updateDashboardState(
                {
                    formOpen: false
                }));

            await props.updateTableData(dashboard.tableIndex);
        }
        catch (error: any)
        {
            setError(error.response.data.error || "An error occurred while submitting the form.");
        }

    };

    const renderInputField = (column: ITableColumnData, value: any) =>
    {
        const inputType = inputMapping[column.type];
        let fieldValue = currentRowData ? currentRowData[column.name] : value;

        if(column.type === ETableColumnType.DATE)
        {
            fieldValue = fieldValue ? new Date(fieldValue).toISOString().split('T')[0] : "";
        }
        else if (column.type === ETableColumnType.DATETIME)
        {
            fieldValue = fieldValue ? new Date(fieldValue).toISOString().slice(0,16) : "";
        }

        if(column.type === ETableColumnType.BOOLEAN)
        {
            return (
                <div className="flex items-center space-x-4 mt-6" key={column.name}>
                    <Checkbox
                        name={column.name}
                        id={column.name}
                        defaultChecked={fieldValue}
                        disabled={!column.editable}
                        className="w-4 h-4 data-[state=checked]:bg-[rgb(242,178,62)] data-[state=checked]:border-[rgb(242,178,62)]"
                    />
                    <Label htmlFor={column.name}>{column.friendlyName}</Label>
                </div>
            );
        }

        return (
            <div className="space-y-2" key={column.name}>
                <Label htmlFor={column.name}>{column.friendlyName}</Label>
                <Input
                    name={column.name}
                    id={column.name}
                    type={inputType}
                    defaultValue={fieldValue}
                    disabled={!column.editable}
                    placeholder={`${column.friendlyName}`}
                />
            </div>
        );
    }

    const renderForeignKeyField = (column: ITableColumnData) =>
    {
        const foreignKeyValue: number | null = currentRowData !== null ? Number(Object.values(currentRowData[column.name] ?? {})[0]) : null;

        return (
            <div className="space-y-2" key={column.name}>
                    <Label htmlFor={column.name}>{column.friendlyName}</Label>
                    <ForeignSearch column={column} placeholder={`Select ${column.friendlyName}`} defaultValue={foreignKeyValue} />
            </div>
        );
    }

    function close(): void
    {
        dispatch(updateDashboardState({formOpen: false}));
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
            <Card className="w-full max-w-md mx-auto shadow-2xl border-">
                <CardHeader>
                    <div className="flex items-center space-x-2 justify-between">
                        <CardTitle>{dashboard.formMode === EDashboardFormMode.ADD ? "ADD" : "UPDATE"} {tables[dashboard.tableIndex].table.friendlyName.toUpperCase()}</CardTitle>
                        <button
                            className=" top-4 right-4 text-2xl text-gray-500 hover:text-gray-700 z-50"
                            onClick={close}
                        >
                            &times;
                        </button>
                    </div>
                </CardHeader>
                <CardContent className="overflow-auto max-h-[70vh]">
                    <form onSubmit={handleSubmit} className="space-y-4 p-4">
                        {(dashboard.formMode === EDashboardFormMode.ADD
                                ? tables[dashboard.tableIndex].table.columns.slice(1)
                                : tables[dashboard.tableIndex].table.columns
                        ).map((column: ITableColumnData) =>
                            (column.foreignKeyTableData) ? renderForeignKeyField(column) : renderInputField(column, "")
                        )}

                        {error &&
                            <div className="flex justify-center bg-red-400 p-2 mt-4 rounded-md">
                                <span className="text-white">{error}</span>
                            </div>
                        }
                        <Button type="submit" className="w-full">
                            { dashboard.formMode === EDashboardFormMode.ADD ? "ADD" : "UPDATE" }
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}