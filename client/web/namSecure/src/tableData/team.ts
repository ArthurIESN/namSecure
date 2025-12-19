import { ETableColumnType } from "@/types/components/dashboard/dashboard.ts";
import type { ITableColumnData, ITableData } from "@/types/components/dashboard/dashboard.ts";
import memberTableData from "@/tableData/member.ts";
import reportTableData from "@/tableData/report.ts";
import teamMemberTableData from "@/tableData/team_member.ts";

const teamTableColumnsData: ITableColumnData[] = [
    {
        name: "id",
        friendlyName: "ID",
        editable: false,
        optional: false,
        type: ETableColumnType.NUMBER
    },
    {
        name: "name",
        friendlyName: "Team Name",
        editable: true,
        optional: false,
        type: ETableColumnType.STRING
    },
    {
        name: "admin",
        friendlyName: "Admin ID",
        editable: true,
        optional: false,
        type: ETableColumnType.NUMBER,
        foreignKeyTableData: memberTableData
    },
    {
        name: "report",
        friendlyName: "Report ID",
        editable: true,
        optional: true,
        type: ETableColumnType.NUMBER,
        foreignKeyTableData: reportTableData
    },
    {
        name: "team_member",
        friendlyName : "Team Members",
        editable: true,
        optional : true,
        type: ETableColumnType.NUMBER,
        multipleForeignKeyTableData:
        {
            min: 0,
            max: 5,
            allowDuplicates: false,
            get foreignKeyTableData(): ITableData
            {
                return teamMemberTableData;
            }
        }
    }
];

const teamTableData: ITableData = {
    name: "team",
    friendlyName: "Team",
    columns: teamTableColumnsData,
    url: "/team",
    selectName: "$id - $name"
}

export default teamTableData;
