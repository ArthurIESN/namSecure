import { ETableColumnType } from "@/types/components/dashboard/dashboard.ts";
import type { ITableColumnData, ITableData } from "@/types/components/dashboard/dashboard.ts";

const memberTwoFATableColumnsData: ITableColumnData[] =
[
    {
        name: "id",
        friendlyName: "ID",
        editable: false,
        optional: false,
        type: ETableColumnType.NUMBER
    },
    {
        name: "secret_key",
        friendlyName: "Secret Key",
        editable: true,
        optional: false,
        type: ETableColumnType.STRING
    },
    {
        name: "is_enabled",
        friendlyName: "Enabled",
        editable: true,
        optional: false,
        type: ETableColumnType.BOOLEAN
    },
    {
        name: "created_at",
        friendlyName: "Created At",
        editable: false,
        optional: false,
        type: ETableColumnType.DATE
    },
];

const memberTwoFATableData: ITableData =
{
    name: "2fa",
    friendlyName: "Two Factor",
    columns: memberTwoFATableColumnsData,
    url: "/two-factor"
}

export default memberTwoFATableData;