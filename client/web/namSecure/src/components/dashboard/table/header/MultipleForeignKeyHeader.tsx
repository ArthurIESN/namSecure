import type { ReactElement } from "react";
import type {IMultipleForeignKeyHeaderProps, ITableColumnData} from "@/types/components/dashboard/dashboard.ts";
import { DefaultHeader } from "./DefaultHeader.tsx";

export function MultipleForeignKeyHeader(props: IMultipleForeignKeyHeaderProps): ReactElement[]
{
    const { column, onlyShowFirstColumn } = props;

    const foreignKeyColumns: ITableColumnData[] = column.multipleForeignKeyTableData!.foreignKeyTableData.columns;
    const headers: ReactElement[] = [];

    for (let i: number = 1; i <= column.multipleForeignKeyTableData!.max; i++)
    {
        if (onlyShowFirstColumn)
        {
            headers.push(
                <DefaultHeader
                    key={`${column.name}-${i}`}
                    columnName={`${column.friendlyName} ${i}`}
                />
            );
        }
        else
        {
            foreignKeyColumns.forEach((fkColumn) =>
            {
                headers.push(
                    <DefaultHeader
                        key={`${column.name}-${i}-${fkColumn.name}`}
                        columnName={`${column.friendlyName} ${i} ${fkColumn.friendlyName}`}
                    />
                );
            });
        }
    }

    return headers;
}
