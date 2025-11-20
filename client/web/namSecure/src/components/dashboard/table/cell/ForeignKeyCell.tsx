import type { ReactElement } from "react";
import type {IForeignKeyCellProps, ITableColumnData} from "@/types/components/dashboard/dashboard.ts";
import { DefaultCell } from "./DefaultCell.tsx";

export function ForeignKeyCell(props: IForeignKeyCellProps): ReactElement | ReactElement[]
{
    const { columnData, rowData, rowIndex, onlyShowFirstColumn } = props;

    if (onlyShowFirstColumn)
    {
        const cellValue: any =
            rowData[columnData.name] === null
                ? "null"
                : rowData[columnData.name][columnData.foreignKeyTableData!.columns[0].name];

        return (
            <DefaultCell
                cellKey={`${columnData.name}-${rowIndex}`}
                value={cellValue}
                type={columnData.foreignKeyTableData!.columns[0].type}
            />
        );
    }

    return columnData.foreignKeyTableData!.columns.map((fkColumn: ITableColumnData): ReactElement =>
    {
        const cellValue: any =
            rowData[columnData.name] === null || rowData[columnData.name][fkColumn.name] === null
                ? "null"
                : rowData[columnData.name][fkColumn.name];

        return (
            <DefaultCell
                key={`${columnData.name}-${fkColumn.name}-${rowIndex}`}
                cellKey={`${columnData.name}-${fkColumn.name}-${rowIndex}`}
                value={cellValue}
                type={fkColumn.type}
            />
        );
    });
}
