import { TableHead } from "@/components/ui/table.tsx";
import type { ReactElement } from "react";
import type { IDefaultHeaderProps } from "@/types/components/dashboard/dashboard.ts";

export function DefaultHeader(props : IDefaultHeaderProps): ReactElement
{
    const { columnName } = props;

    return (
        <TableHead className="px-8 py-3 font-bold text-gray-400">
            {columnName}
        </TableHead>
    );
}
