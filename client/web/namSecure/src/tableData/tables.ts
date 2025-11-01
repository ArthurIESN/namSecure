import type {ITableData} from "@/types/components/dashboard/dashboard.ts";
import memberTableData from "@/tableData/member";
import memberRoleTableData from "@/tableData/member_role.ts";
import memberValidationCodeTableData from "@/tableData/validation_code.ts";
import type { ITable } from "@/types/components/dashboard/dashboard";

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
    ];

export default tables;
