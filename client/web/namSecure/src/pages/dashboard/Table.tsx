import tables from "@/tableData/tables";
import type { IDashboardTableProps } from "@/types/components/dashboard/table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    ETableColumnType,
    type IDashboardState,
    type ITableColumnData,
    type ITableData
} from "@/types/components/dashboard/dashboard";
import type {ReactElement} from "react";
import {Checkbox} from "@radix-ui/react-checkbox";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import {Pencil, Trash2} from "lucide-react";
import {api} from "@/utils/api/api.ts";
import { updateDashboardState } from "@/store/slices/dashboardSlice.ts";

export function DashboardTable()
{
    const dashboard: IDashboardState = useAppSelector((state) => state.dashboard);
    const table: ITableData = tables[dashboard.tableIndex].table;
    const dispatch = useAppDispatch();

    const renderColumnHeader = (name: string): ReactElement =>
    {
        return (
                <TableHead key={name}>
                    {name}
                </TableHead>
        )
    }

    const renderHead = (column: ITableColumnData): ReactElement | ReactElement[] => {
        if(column.foreignKeyTableData && !dashboard.onlyShowFirstColumnOfForeignKey)
        {
            return column.foreignKeyTableData!.columns.map(fkColumn =>
            (
                renderColumnHeader(`${column.foreignKeyTableData?.name} ${fkColumn.friendlyName}`)
            ));
        }
        return renderColumnHeader(column.friendlyName);
    };

    const renderColumnCell = (name: string,  value: string, index: number, type: ETableColumnType): ReactElement => (
        <TableCell
            key={`${name}-${index}`}
            className={'font-medium'}
        >
            {type === ETableColumnType.BOOLEAN ?
                <Checkbox checked={value} />
                : value
            }
        </TableCell>
    );

    const handleEdit = (rowIndex: number): void =>
    {
        // @todo implement edit functionality
        console.log(`Edit row at index: ${rowIndex}`);
    }

    const handleDelete = async (rowIndex: number): Promise<void> =>
    {
        const confirmDelete = window.confirm("Are you sure you want to delete this row?");

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


    const renderCell = (row: any, column: ITableColumnData, rowIndex: number): ReactElement | ReactElement[] => {
        if (column.foreignKeyTableData)
        {
           if(dashboard.onlyShowFirstColumnOfForeignKey)
           {
               return renderColumnCell(`${column.name}`, row[column.name] === null ? "null" : row[column.name][column.foreignKeyTableData!.columns[0].name], rowIndex, column.foreignKeyTableData!.columns[0].type);
           }
           else
           {
                return column.foreignKeyTableData!.columns.map(fkColumn =>
                    renderColumnCell(`${column.name}-${[fkColumn.name]}`, row[column.name] === null ? "null" : row[column.name][fkColumn.name], rowIndex, fkColumn.type)
                );
           }
        }
        else
        {
            return renderColumnCell(column.name, row[column.name], rowIndex, column.type);
        }
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
                            <TableCell className="sticky right-0 even:bg-muted w-20">
                                <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity group-hover:bg-white/90 rounded p-1">
                                    <button
                                        onClick={() => handleEdit(rowIndex)}
                                        className="p-1 hover:bg-blue-100 rounded"
                                        title="Edit"
                                    >
                                        <Pencil size={16} className="text-blue-600" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(rowIndex)}
                                        className="p-1 hover:bg-red-100 rounded"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} className="text-red-600" />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
