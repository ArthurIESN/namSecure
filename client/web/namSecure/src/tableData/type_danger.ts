import { ETableColumnType } from "@/types/components/dashboard/dashboard.ts";
import type { ITableColumnData, ITableData } from "@/types/components/dashboard/dashboard.ts";

const typeDangerTableColumnsData: ITableColumnData[] =
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
    },
    {
        name: "is_used",
        friendlyName: "Is Used",
        editable: true,
        optional: false,
        type: ETableColumnType.BOOLEAN
    }
];

const typeDangerTableData: ITableData =
{
    name: "type_danger",
    friendlyName: "Type Danger",
    columns: typeDangerTableColumnsData,
    url: "/typeDanger",
    selectName: "$id -  $name - $is_used"
}

export default typeDangerTableData;