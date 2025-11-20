import { Pencil, Trash2 } from "lucide-react";
import { TableCell } from "@/components/ui/table.tsx";
import type { ITableRowActionsProps } from "@/types/components/dashboard/dashboard.ts";
import type {ReactElement} from "react";

export function TableRowActions(props: ITableRowActionsProps) : ReactElement
{
    const { rowIndex, onEdit, onDelete } = props;

    return (
        <TableCell className="sticky right-0 p-0">
            <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-transparent group-hover:bg-white/90 rounded p-1 h-full w-full">
                <button
                    onClick={() => onEdit(rowIndex)}
                    className="p-1 hover:bg-blue-100 rounded"
                    title="Edit"
                >
                    <Pencil size={16} className="text-blue-600" />
                </button>
                <button
                    onClick={() => onDelete(rowIndex)}
                    className="p-1 hover:bg-red-100 rounded"
                    title="Delete"
                >
                    <Trash2 size={16} className="text-red-600" />
                </button>
            </div>
        </TableCell>
    );
}
