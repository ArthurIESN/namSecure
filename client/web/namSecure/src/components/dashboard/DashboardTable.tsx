import tables from "@/tableData/tables.ts";
import {Table, TableBody, TableHeader, TableRow,} from "@/components/ui/table.tsx"
import {
    EDashboardFormMode,
    type IDashboardState,
    type ITableColumnData,
    type ITableData
} from "@/types/components/dashboard/dashboard.ts";
import type {ReactElement} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/redux.ts";
import {api} from "@/utils/api/api.ts";
import {updateDashboardState} from "@/store/slices/dashboardSlice.ts";
import { DefaultHeader } from "./table/header/DefaultHeader.tsx";
import { ForeignKeyHeader } from "./table/header/ForeignKeyHeader.tsx";
import { MultipleForeignKeyHeader } from "./table/header/MultipleForeignKeyHeader.tsx";
import { DefaultCell } from "./table/cell/DefaultCell.tsx";
import { ForeignKeyCell } from "./table/cell/ForeignKeyCell.tsx";
import { MultipleForeignKeyCell } from "./table/cell/MultipleForeignKeyCell.tsx";
import { TableRowActions } from "./table/TableRowActions.tsx";

export function DashboardTable(): ReactElement
{
    const dashboard: IDashboardState = useAppSelector((state) => state.dashboard);
    const table: ITableData = tables[dashboard.tableIndex].table;
    const dispatch = useAppDispatch();

    const renderHead = (column: ITableColumnData): ReactElement | ReactElement[] => {
        if (column.multipleForeignKeyTableData) {
            return <MultipleForeignKeyHeader
                column={column}
                onlyShowFirstColumn={dashboard.onlyShowFirstColumnOfForeignKey}
            />;
        }
        if (column.foreignKeyTableData) {
            return <ForeignKeyHeader
                column={column}
                onlyShowFirstColumn={dashboard.onlyShowFirstColumnOfForeignKey}
            />;
        }
        return <DefaultHeader columnName={column.friendlyName} />;
    };

    const handleEdit = (rowIndex: number): void =>
    {
        dispatch(updateDashboardState({
            formOpen: true,
            currentRowId: rowIndex,
            formMode: EDashboardFormMode.EDIT
        }));
    }

    const handleDelete = async (rowIndex: number): Promise<void> =>
    {
        const confirmDelete: boolean = window.confirm(`Are you sure you want to delete this ${tables[dashboard.tableIndex].table.name} ?`);

        if(!confirmDelete) return;

        const id: number = Object.values(dashboard.data[rowIndex])[0] as number;

        const response = await api.delete(tables[dashboard.tableIndex].table.url + `/${id}`);
        if(response.status === 204)
        {
            console.log(`Deleted row at index: ${rowIndex}`);
            dispatch(updateDashboardState({
                tableIndex: dashboard.tableIndex,
            }));
            return;
        }

        //@todo show error;
    }


    const renderCell = (row: any, column: ITableColumnData, rowIndex: number): ReactElement | ReactElement[] =>
    {
        if (column.foreignKeyTableData)
        {
            return <ForeignKeyCell
                columnData={column}
                rowData={row}
                rowIndex={rowIndex}
                onlyShowFirstColumn={dashboard.onlyShowFirstColumnOfForeignKey}
            />;
        }
        if (column.multipleForeignKeyTableData)
        {
            return <MultipleForeignKeyCell
                columnData={column}
                rowData={row}
                rowIndex={rowIndex}
                onlyShowFirstColumn={dashboard.onlyShowFirstColumnOfForeignKey}
            />;
        }

        return <DefaultCell
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
                        {table.columns.map((column: ITableColumnData): ReactElement |  ReactElement[] => renderHead(column))}
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
        </div>
    )
}
