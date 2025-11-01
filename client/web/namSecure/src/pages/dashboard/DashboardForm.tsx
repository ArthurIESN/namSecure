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
import {api} from "@/utils/api/api";
import {updateDashboardState} from "@/store/slices/dashboardSlice";

const inputMapping: { [key: ETableColumnType]: string } =
    {
        [ETableColumnType.EMAIL]: "email",
        [ETableColumnType.NUMBER]: "number",
        [ETableColumnType.STRING]: "text",
        [ETableColumnType.DATE]: "date",
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

    const currentRowData = dashboard.formMode === EDashboardFormMode.EDIT && dashboard.currentRowId !== undefined
        ? dashboard.data[dashboard.currentRowId]
        : null;

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



        const response = dashboard.formMode === EDashboardFormMode.ADD ? await api.post(tables[dashboard.tableIndex].table.url, formObject) : await api.put(tables[dashboard.tableIndex].table.url, formObject);

        if(response.status === 201 || response.status === 204)
        {
            dispatch(updateDashboardState(
                {
                    formOpen: false
                }));

            await props.updateTableData(dashboard.tableIndex);
        }
        else
        {
            console.error("Failed to add record:", response);
        }

    };

    const renderInputField = (column: ITableColumnData, value: any) =>
    {
        const inputType = inputMapping[column.type];
        const fieldValue = currentRowData ? currentRowData[column.name] : value;
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
        //const foreignKeyValue = currentRowData ? currentRowData[column.name] : null;
        const foreignKeyValue = currentRowData ? 1 : null;


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
                        {(dashboard.formMode === EDashboardFormMode.ADD
                                ? tables[dashboard.tableIndex].table.columns.slice(1)
                                : tables[dashboard.tableIndex].table.columns
                        ).map((column: ITableColumnData) =>
                            (column.foreignKeyTableData) ? renderForeignKeyField(column) : renderInputField(column, "")
                        )}

                        <Button type="submit" className="w-full">
                            { dashboard.formMode === EDashboardFormMode.ADD ? "ADD" : "UPDATE" }
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}