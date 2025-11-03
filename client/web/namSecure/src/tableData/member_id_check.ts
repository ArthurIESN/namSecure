import { ETableColumnType } from "@/types/components/dashboard/dashboard.ts";
import type { ITableColumnData, ITableData } from "@/types/components/dashboard/dashboard.ts";

const memberIdCheckTableColumnsData: ITableColumnData[] =
    [
        {
            name: "id",
            friendlyName: "ID",
            editable: false,
            optional: false,
            type: ETableColumnType.NUMBER
        },
        {
            name: "card_photo_id",
            friendlyName: "Card Photo ID",
            editable: false,
            optional: false,
            type: ETableColumnType.STRING
        },
        {
            name: "reject_reason",
            friendlyName: "Reject Reason",
            editable: true,
            optional: true,
            type: ETableColumnType.STRING
        },
    ];

const memberIdCheckTableData: ITableData =
    {
        name: "id_check",
        friendlyName: "ID Check",
        columns: memberIdCheckTableColumnsData,
        url: "/" // @ todo add endpoint (not implemented yet)
    }

export default memberIdCheckTableData;