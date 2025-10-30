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

export function DashboardTable()
{
    const dashboard: IDashboardState = useAppSelector((state) => state.dashboard);
    const table: ITableData = tables[dashboard.tableIndex].table;

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
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {table.columns.map((column: ITableColumnData): ReactElement |  ReactElement[] => renderHead(column))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dashboard.data.map((row, rowIndex) => (
                        <TableRow key={rowIndex} className="even:bg-muted">
                            {table.columns.map((column: ITableColumnData) =>
                                renderCell(row, column, rowIndex)
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
