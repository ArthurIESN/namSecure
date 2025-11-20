import { TableCell } from "@/components/ui/table.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { ETableColumnType } from "@/types/components/dashboard/dashboard.ts";
import type { CheckedState } from "@radix-ui/react-checkbox";
import type { ReactElement } from "react";
import type { IDefaultCellProps } from "@/types/components/dashboard/dashboard.ts";

export function DefaultCell(props: IDefaultCellProps): ReactElement
{
    const { cellKey, value, type } = props;

    return (
        <TableCell key={cellKey} className="font-medium px-8 py-3">
            {type === ETableColumnType.BOOLEAN ? (
                <Checkbox
                    checked={value as CheckedState}
                    className="w-4 h-4 data-[state=checked]:bg-[rgb(242,178,62)] data-[state=checked]:border-[rgb(242,178,62)]"
                />
            ) : (
                value
            )}
        </TableCell>
    );
}
