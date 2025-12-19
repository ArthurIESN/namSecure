import {type FormEvent, type ReactElement, useEffect, useState} from "react";
import {
    EDashboardFormMode,
    ETableColumnType,
    type IDashboardState,
    type ITableColumnData,
    type ITableData,
    type IDashboardFormProps
} from "@/types/components/dashboard/dashboard.ts";
import {useAppDispatch, useAppSelector} from "@/hooks/redux.ts";
import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {useErrorDialog} from "@/context/ErrorDialogContext.tsx";
import tables from "@/tableData/tables.ts";
import {api} from "@/utils/api/api.ts";
import {updateDashboardState} from "@/store/slices/dashboardSlice.ts";
import {MultipleForeignFields} from "@/components/dashboard/fields/multipleForeignField/MultipleForeignFields.tsx";
import {FormField} from "@/components/dashboard/FormField.tsx";
import {formatDateForInput, getColumnName} from "@/utils/dashboard/dashboard.ts";

export function DashboardForm(props: IDashboardFormProps): ReactElement
{
    const dashboard: IDashboardState = useAppSelector(state => state.dashboard);
    const dispatch = useAppDispatch();
    const { showError } = useErrorDialog();

    const [formData, setFormData] = useState<Record<string, any>>({});
    const multipleForeignKeyItems = dashboard.multipleForeignKeyItems;

    const currentRowData: any = dashboard.formMode === EDashboardFormMode.EDIT && dashboard.currentRowId != null
        ? dashboard.data[dashboard.currentRowId]
        : null;

    useEffect(() =>
    {
        //@todo refactor this
        const newFormData: Record<string, any> = {};
        const table = tables[dashboard.tableIndex].table;

        const columnsToProcess = dashboard.formMode === EDashboardFormMode.ADD
            ? table.columns.slice(1)
            : table.columns;

        columnsToProcess.forEach((column: ITableColumnData) =>
        {

            if(column.secret)
            {
                return;
            }

            if (column.multipleForeignKeyTableData) {
                // Handle multiple foreign keys separately
                return;
            }

            const columnName = getColumnName(column);

            if (currentRowData) {
                if (column.foreignKeyTableData)
                {
                    const fkValue = currentRowData[column.name];
                    newFormData[columnName] = fkValue?.id ?? null;
                }
                else
                {
                    let value = currentRowData[column.name];
                    value = formatDateForInput(value, column.type);
                    newFormData[columnName] = value ?? "";
                }
            } else {
                newFormData[columnName] = "";
            }
        });

        setFormData(newFormData);

        // Initialize multiple foreign key items
        const items: Record<string, any[]> = {};
        table.columns.forEach((column: ITableColumnData) => {
            if (column.multipleForeignKeyTableData) {
                if (currentRowData) {
                    const data = currentRowData[column.name];
                    const dataArray = Array.isArray(data) ? data : (data ? [data] : []);

                    items[column.name] = dataArray.map((item: any) =>
                    {
                        const transformedItem: Record<string, any> = {};
                        const fkColumns = column.multipleForeignKeyTableData!.foreignKeyTableData.columns;

                        fkColumns.forEach((fkColumn) =>
                        {
                            const columnName = getColumnName(fkColumn);
                            transformedItem[columnName] = item[columnName] ?? null;
                        });

                        return transformedItem;
                    });
                } else {
                    items[column.name] = [];
                }
            }
        });
        dispatch(updateDashboardState({ multipleForeignKeyItems: items }));
    }, [currentRowData, dashboard.tableIndex, dashboard.formMode]);

    const handleFormFieldChange = (columnName: string, value: any): void =>
    {
        setFormData(prev => (
        {

            ...prev,
            [columnName]: value === "" ? "" : value
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const submitObject: Record<string, any> = {};
        const table = tables[dashboard.tableIndex].table;

        table.columns.forEach((column: ITableColumnData) => {
            if (column.multipleForeignKeyTableData) {
                submitObject[column.name] = multipleForeignKeyItems[column.name] || [];
            } else {
                const columnName = getColumnName(column);
                const value = formData[columnName];

                if (column.foreignKeyTableData) {
                    submitObject[columnName] = value !== null ? Number(value) : null;
                } else if (column.type === ETableColumnType.NUMBER) {
                    submitObject[columnName] = value !== "" ? Number(value) : null;
                } else if (column.type === ETableColumnType.FLOAT) {
                    submitObject[columnName] = value !== "" ? parseFloat(value) : null;
                } else if (column.type === ETableColumnType.BOOLEAN) {
                    submitObject[columnName] = value === true || value === "true";
                } else {
                    submitObject[columnName] = (column.editable && value === "") ? null : value;
                }
            }
        });
        try {
            console.log(submitObject);
            dashboard.formMode === EDashboardFormMode.ADD
                ? await api.post(table.url, submitObject)
                : await api.put(table.url, submitObject);

            dispatch(updateDashboardState({ formOpen: false }));
            await props.updateTableData(dashboard.tableIndex);
        } catch (error: any) {
            const statusCode = error.response?.status
            showError(
              error.response?.data?.error || "An error occurred while submitting the form",
              undefined,
              statusCode,
              () => handleSubmit({ preventDefault: () => {} } as any)
            );
        }
    };

    const renderInputField = (column: ITableColumnData): ReactElement => {
        const columnName = getColumnName(column);
        const value = formData[columnName] ?? (column.type === ETableColumnType.BOOLEAN ? false : "");

        return <FormField
            key={column.name}
            columnName={columnName}
            column={column}
            value={value}
            onChange={(val: any) => handleFormFieldChange(columnName, val)}
            disabled={!column.editable}
        />;
    };

    const renderMultipleForeignKeyField = (column: ITableColumnData): ReactElement => {
        const items = multipleForeignKeyItems[column.name] || [];

        return (
            <MultipleForeignFields
                key={column.name}
                column={column}
                items={items}
            />
        );
    };

    function close(): void
    {
        dispatch(updateDashboardState({
            formOpen: false,
            multipleForeignKeyItems: {}
        }));
    }

    const table: ITableData = tables[dashboard.tableIndex].table;

    // if we are in ADD mode, skip the first column (ID column)
    const columnsToRender: ITableColumnData[] = dashboard.formMode === EDashboardFormMode.ADD
        ? table.columns.slice(1)
        : table.columns;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-md mx-auto shadow-2xl border-">
                <CardHeader>
                    <div className="flex items-center space-x-2 justify-between">
                        <CardTitle>{dashboard.formMode === EDashboardFormMode.ADD ? "ADD" : "UPDATE"} {table.friendlyName.toUpperCase()}</CardTitle>
                        <button
                            className="top-4 right-4 text-2xl text-gray-500 hover:text-gray-700 z-50"
                            onClick={close}
                        >
                            &times;
                        </button>
                    </div>
                </CardHeader>
                <CardContent className="overflow-auto max-h-[70vh]">
                    <form onSubmit={handleSubmit} className="space-y-4 p-4">
                        {columnsToRender.map((column: ITableColumnData) =>
                        {
                            if (column.multipleForeignKeyTableData)
                            {
                                return renderMultipleForeignKeyField(column);
                            }
                            else
                            {
                                return renderInputField(column);
                            }
                        })}

                        <Button type="submit" className="w-full">
                            {dashboard.formMode === EDashboardFormMode.ADD ? "ADD" : "UPDATE"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
