import { ETableColumnType } from "@/types/components/dashboard/dashboard.ts";
import type { ITableColumnData, ITableData } from "@/types/components/dashboard/dashboard.ts";

const memberValidationCodeTableColumnsData: ITableColumnData[] =
    [
        {
            name: "id",
            friendlyName: "ID",
            editable: false,
            optional: false,
            type: ETableColumnType.NUMBER
        },
        {
            name: "hash_code",
            friendlyName: "Hash Code",
            editable: true,
            optional: false,
            type: ETableColumnType.STRING
        },
        {
            name: "expires_at",
            friendlyName: "Expires At",
            editable: true,
            optional: false,
            type: ETableColumnType.DATE
        },
        {
            name: "attempts",
            friendlyName: "Attempts",
            editable: true,
            optional: false,
            type: ETableColumnType.NUMBER
        },
    ];

const memberValidationCodeTableData: ITableData =
    {
        name: "Validation Code",
        columns: memberValidationCodeTableColumnsData,
        url: "/" // @ todo add endpoint (not implemented yet)
    }

export default memberValidationCodeTableData;