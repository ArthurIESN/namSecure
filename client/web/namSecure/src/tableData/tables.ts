import memberTableData from "@/tableData/member";
import memberRoleTableData from "@/tableData/member_role.ts";
import memberValidationCodeTableData from "@/tableData/validation_code.ts";
import type { ITable } from "@/types/components/dashboard/dashboard";
import typeDangerTableData from "@/tableData/type_danger.ts";
import reportTableData from "@/tableData/report.ts";
import teamTableData from "@/tableData/team.ts";
import memberTwoFATableData from "@/tableData/member_2fa.ts";
import teamMemberTableData from "./team_member";

const tables: ITable[] =
    [
        {
            name: "Members",
            table: memberTableData
        },
        {
            name: "Member Roles",
            table: memberRoleTableData
        },
        {
            name: "Validation Codes",
            table: memberValidationCodeTableData
        },
        {
            name: "Type Dangers",
            table: typeDangerTableData
        },
        {
          name: "Two Factor",
          table: memberTwoFATableData
        },
        {
            name: "Reports",
            table: reportTableData
        },
        {
            name: "Teams",
            table: teamTableData
        },
        {
            name: "Team member",
            table: teamMemberTableData
        }
    ];

export default tables;
