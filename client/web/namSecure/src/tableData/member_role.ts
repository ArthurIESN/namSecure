import { ETableColumnType } from "@/types/components/dashboard/dashboard.ts";
import type { ITableColumnData, ITableData } from "@/types/components/dashboard/dashboard.ts";

const memberRoleTableColumnsData: ITableColumnData[] =
[
    {
        name: "id",
        friendlyName: "ID",
        editable: false,
        optional: false,
        type: ETableColumnType.NUMBER
    },
    {
        name: "name",
        friendlyName: "Name",
        editable: true,
        optional: false,
        type: ETableColumnType.STRING
    }
];

const memberRoleTableData: ITableData =
{
    name: "role",
    columns: memberRoleTableColumnsData,
    url: "/memberRole",
    selectName: "$id -  $name"
}

export default memberRoleTableData;