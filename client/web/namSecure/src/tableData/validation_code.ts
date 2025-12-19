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
            name: "code_hash",
            friendlyName: "Code Hashed",
            editable: true,
            optional: false,
            secret: true,
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
        name: "validation_code",
        friendlyName: "Validation Code",
        columns: memberValidationCodeTableColumnsData,
        url: "/validation-code"
    }

export default memberValidationCodeTableData;