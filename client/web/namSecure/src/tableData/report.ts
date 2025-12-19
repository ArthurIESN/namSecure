import { ETableColumnType } from "@/types/components/dashboard/dashboard.ts";
import type { ITableColumnData, ITableData } from "@/types/components/dashboard/dashboard.ts";
import memberTableData from "@/tableData/member.ts";
import typeDangerTableData from "@/tableData/type_danger.ts";


const reportTableColumnsData: ITableColumnData[] =
[
    {
        name: "id",
        friendlyName: "ID",
        editable: false,
        optional: false,
        type: ETableColumnType.NUMBER
    },
    {
        name: "date",
        friendlyName: "Date",
        editable: true,
        optional: false,
        type: ETableColumnType.DATETIME
    },
    {
        name: "lat",
        friendlyName: "Latitude",
        editable: true,
        optional: false,
        type: ETableColumnType.FLOAT
    },
    {
        name: "lng",
        friendlyName: "Longitude",
        editable: true,
        optional: false,
        type: ETableColumnType.FLOAT
    },
    {
        name: "street",
        friendlyName: "Street",
        editable: true,
        optional: false,
        type: ETableColumnType.STRING
    },
    {
        name: "level",
        friendlyName: "Level",
        editable: true,
        optional: false,
        type: ETableColumnType.NUMBER
    },
    {
        name: "is_public",
        friendlyName: "Is Public",
        editable: true,
        optional: false,
        type: ETableColumnType.BOOLEAN
    },
    {
        name: "for_police",
        friendlyName: "For Police",
        editable: true,
        optional: false,
        type: ETableColumnType.BOOLEAN
    },
    {
        name: "photo_path",
        friendlyName: "Photo",
        editable: true,
        optional: true,
        type: ETableColumnType.STRING
    },
    {
        name: "member",
        friendlyName: "ID Member",
        editable: true,
        optional: false,
        type: ETableColumnType.NUMBER,
        foreignKeyTableData : memberTableData
    },
    {
        name: "type_danger",
        friendlyName: "ID Type Danger",
        editable: true,
        optional: false,
        type: ETableColumnType.NUMBER,
        foreignKeyTableData : typeDangerTableData
    }
];

const reportTableData: ITableData =
{
    name: "report",
    friendlyName: "Report",
    columns: reportTableColumnsData,
    url: "/report",
    selectName: "$id"
}

export default reportTableData;