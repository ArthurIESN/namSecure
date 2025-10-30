import type {ITableData} from "@/types/components/dashboard/dashboard.ts";
import memberTableData from "@/tableData/member";
import memberRoleTableData from "@/tableData/member_role.ts";

export interface ITable
{
    name: string,
    table: ITableData
}

const tables: ITable[] =
    [
        {
            name: "Member",
            table: memberTableData
        },
        {
            name: "Member Roles",
            table: memberRoleTableData
        }
    ];

export default tables;
