import type { ReactElement } from "react";
import type { IForeignKeyHeaderProps } from "@/types/components/dashboard/dashboard.ts";
import { DefaultHeader } from "./DefaultHeader.tsx";

export function ForeignKeyHeader(props:  IForeignKeyHeaderProps): ReactElement | ReactElement[]
{
    const { column, onlyShowFirstColumn } = props;

    if (onlyShowFirstColumn)
    {
        return <DefaultHeader columnName={column.friendlyName} />;
    }

    return column.foreignKeyTableData!.columns.map(fkColumn => (
        <DefaultHeader
            key={`${column.name}-${fkColumn.name}`}
            columnName={`${column.foreignKeyTableData?.friendlyName} ${fkColumn.friendlyName}`}
        />
    ));
}
