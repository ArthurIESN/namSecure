import tables from "@/tableData/tables.ts";
import {Table, TableBody, TableHeader, TableRow,} from "@/components/ui/table.tsx"
import {
    EDashboardFormMode,
    type IDashboardState,
    type ITableColumnData,
    type ITableData
} from "@/types/components/dashboard/dashboard.ts";
import type {ReactElement} from "react";
import {useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/redux.ts";
import {api} from "@/utils/api/api.ts";
import {updateDashboardState} from "@/store/slices/dashboardSlice.ts";
import {useErrorDialog} from "@/context/ErrorDialogContext.tsx";
import {DeleteConfirmDialog} from "@/components/ui/delete-confirm-dialog.tsx";
import { DefaultHeader } from "./table/header/DefaultHeader.tsx";
import { ForeignKeyHeader } from "./table/header/ForeignKeyHeader.tsx";
import { MultipleForeignKeyHeader } from "./table/header/MultipleForeignKeyHeader.tsx";
import { DefaultCell } from "./table/cell/DefaultCell.tsx";
import { ForeignKeyCell } from "./table/cell/ForeignKeyCell.tsx";
import { MultipleForeignKeyCell } from "./table/cell/MultipleForeignKeyCell.tsx";
import { TableRowActions } from "./table/TableRowActions.tsx";

interface DashboardTableProps {
    updateTableData?: (index: number) => Promise<void>;
}

export function DashboardTable({ updateTableData }: DashboardTableProps): ReactElement
{
    const dashboard: IDashboardState = useAppSelector((state) => state.dashboard);
    const table: ITableData = tables[dashboard.tableIndex].table;
    const dispatch = useAppDispatch();
    const { showError } = useErrorDialog();
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteRowIndex, setDeleteRowIndex] = useState<number | null>(null);

    const renderHead = (column: ITableColumnData): ReactElement | ReactElement[]  | undefined =>
    {

        if(column.secret) return;

        if (column.multipleForeignKeyTableData)
        {
            return <MultipleForeignKeyHeader
                key={column.name}
                column={column}
                onlyShowFirstColumn={dashboard.onlyShowFirstColumnOfForeignKey}
            />;
        }
        if (column.foreignKeyTableData)
        {
            return <ForeignKeyHeader
                key={column.name}
                column={column}
                onlyShowFirstColumn={dashboard.onlyShowFirstColumnOfForeignKey}
            />;
        }
        return <DefaultHeader
            key={column.name}
            columnName={column.friendlyName}
        />;
    };

    const handleEdit = (rowIndex: number): void =>
    {
        dispatch(updateDashboardState({
            formOpen: true,
            currentRowId: rowIndex,
            formMode: EDashboardFormMode.EDIT
        }));
    }

    const getItemDisplay = (rowIndex: number | null): string => {
        if (rowIndex === null) return "";
        const item = dashboard.data[rowIndex];
        const selectName = (table as any).selectName || "$id";
        let label = selectName;
        const matches = label.match(/\$\w+/g) || [];

        matches.forEach(match => {
            const key = match.slice(1);
            label = label.replace(match, String(item[key] ?? ""));
        });

        return label;
    };

    const handleDelete = async (rowIndex: number): Promise<void> =>
    {
        setDeleteRowIndex(rowIndex);
        setDeleteConfirmOpen(true);
    }

    const confirmDelete = async (): Promise<void> =>
    {
        if (deleteRowIndex === null) return;

        const id: number = Object.values(dashboard.data[deleteRowIndex])[0] as number;

        try {
            console.log(id);

            const response = await api.delete(tables[dashboard.tableIndex].table.url + `/${id}`);
            if(response.status === 204)
            {
                console.log(`Deleted row at index: ${deleteRowIndex}`);
                setDeleteConfirmOpen(false);
                setDeleteRowIndex(null);
                if (updateTableData) {
                    await updateTableData(dashboard.tableIndex);
                }
                return;
            }
        } catch (error: any) {
            const statusCode = error.response?.status
            showError(
              error.response?.data?.error || `Failed to delete the ${tables[dashboard.tableIndex].table.friendlyName}`,
              undefined,
              statusCode,
              () => confirmDelete()
            );
        }
    }


    const renderCell = (row: any, column: ITableColumnData, rowIndex: number): ReactElement | ReactElement[]  | undefined =>
    {
        if(column.secret) return;

        if (column.foreignKeyTableData)
        {
            return <ForeignKeyCell
                key={column.name}
                columnData={column}
                rowData={row}
                rowIndex={rowIndex}
                onlyShowFirstColumn={dashboard.onlyShowFirstColumnOfForeignKey}
            />;
        }
        if (column.multipleForeignKeyTableData)
        {
            return <MultipleForeignKeyCell
                key={column.name}
                columnData={column}
                rowData={row}
                rowIndex={rowIndex}
                onlyShowFirstColumn={dashboard.onlyShowFirstColumnOfForeignKey}
            />;
        }

        return <DefaultCell
            key={column.name}
            cellKey={column.name}
            value={row[column.name]}
            type={column.type}
        />;
    };

    if(!dashboard.data || dashboard.data.length === 0)
    {
        return (
            <div className="rounded-md border p-4 text-center">
                No data available.
            </div>
        )
    }

    return (
        <div className="rounded-md borde h-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        {table.columns.map((column: ITableColumnData): ReactElement |  ReactElement[] | undefined => renderHead(column))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dashboard.data.map((row, rowIndex) => (
                        <TableRow key={rowIndex} className="even:bg-muted group">
                            {table.columns.map((column: ITableColumnData) =>
                                renderCell(row, column, rowIndex)
                            )}
                            <TableRowActions
                                rowIndex={rowIndex}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {deleteConfirmOpen && (
                <DeleteConfirmDialog
                    open={deleteConfirmOpen}
                    onOpenChange={setDeleteConfirmOpen}
                    title="Delete item"
                    message={`Are you sure you want to delete: ${getItemDisplay(deleteRowIndex)}? This action cannot be undone.`}
                    onConfirm={confirmDelete}
                />
            )}
        </div>
    )
}
