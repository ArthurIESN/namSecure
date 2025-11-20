import type { ReactElement } from "react";
import type {IMultipleForeignKeyCellProps, ITableColumnData} from "@/types/components/dashboard/dashboard.ts";
import { DefaultCell } from "./DefaultCell.tsx";

export function MultipleForeignKeyCell(props: IMultipleForeignKeyCellProps): ReactElement[]
{
    const { columnData, rowData, rowIndex, onlyShowFirstColumn } = props;

    const multipleForeignKeyData: any = rowData[columnData.name];
    const dataArray = Array.isArray(multipleForeignKeyData)
        ? multipleForeignKeyData
        : multipleForeignKeyData
          ? [multipleForeignKeyData]
          : [];
    const max: number = columnData.multipleForeignKeyTableData!.max;
    const foreignKeyColumns: ITableColumnData[] = columnData.multipleForeignKeyTableData!.foreignKeyTableData.columns;

    const cells: ReactElement[] = [];

    for (let i: number = 0; i < max; i++)
    {
        const item = dataArray[i];

        if (onlyShowFirstColumn)
        {
            const firstColumn: ITableColumnData = foreignKeyColumns[0];
            const cellValue: any = item === undefined || item[firstColumn.name] === null ? "null" : item[firstColumn.name];

            cells.push(
                <DefaultCell
                    key={`${columnData.name}-${i}-${rowIndex}`}
                    cellKey={`${columnData.name}-${i}-${rowIndex}`}
                    value={cellValue}
                    type={firstColumn.type}
                />
            );
        }
        else
        {
            foreignKeyColumns.forEach((fkColumn: ITableColumnData): void =>
            {
                const cellValue: any = item === undefined || item[fkColumn.name] === null ? "null" : item[fkColumn.name];

                cells.push(
                    <DefaultCell
                        key={`${columnData.name}-${i}-${fkColumn.name}-${rowIndex}`}
                        cellKey={`${columnData.name}-${i}-${fkColumn.name}-${rowIndex}`}
                        value={cellValue}
                        type={fkColumn.type}
                    />
                );
            });
        }
    }

    return cells;
}
