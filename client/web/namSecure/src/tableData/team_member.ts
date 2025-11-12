import { ETableColumnType } from "@/types/components/dashboard/dashboard.ts";
import type { ITableColumnData, ITableData } from "@/types/components/dashboard/dashboard.ts";
import memberTableData from "@/tableData/member.ts";
import teamTableData from "@/tableData/team.ts";

const teamMemberTableColumnsData: ITableColumnData[] = [
    {
        name: "id",
        friendlyName: "ID",
        editable: false,
        optional: false,
        type: ETableColumnType.NUMBER
    },
    {
        name: "accepted",
        friendlyName: "Accepted",
        editable: true,
        optional: false,
        type: ETableColumnType.BOOLEAN
    },
    {
        name: "team",
        friendlyName: "Team ID",
        editable: true,
        editableFromForeignKey: false,
        optional: false,
        type: ETableColumnType.NUMBER,
        get foreignKeyTableData(): ITableData
        {
            return teamTableData;
        }
    },
    {
        name: "member",
        friendlyName: "Member ID",
        editable: true,
        optional: false,
        type: ETableColumnType.NUMBER,
        foreignKeyTableData: memberTableData
    }
];

const teamMemberTableData: ITableData = {
    name: "team_member",
    friendlyName: "Team Member",
    columns: teamMemberTableColumnsData,
    url: "/team_member",
    selectName: "$id - Team: $team - Member: $member"
}

export default teamMemberTableData;
