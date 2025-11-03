import { ETableColumnType } from "@/types/components/dashboard/dashboard.ts";
import type { ITableColumnData, ITableData } from "@/types/components/dashboard/dashboard.ts";
import memberRoleTableData from "@/tableData/member_role.ts";
import memberTwoFATableData from "@/tableData/member_2fa.ts";
import memberIdCheckTableData from "@/tableData/member_id_check.ts";
import memberValidationCodeTableData from "@/tableData/validation_code.ts";

const memberTableColumnsData: ITableColumnData[] =
    [
        {
            name: "id",
            friendlyName: "ID",
            editable: false,
            optional: false,
            type: ETableColumnType.NUMBER
        },
        {
            name: "first_name",
            friendlyName: "Fist Name",
            editable: true,
            optional: true,
            type: ETableColumnType.STRING
        },
        {
            name: "last_name",
            friendlyName: "Last Name",
            editable: true,
            optional: true,
            type: ETableColumnType.STRING
        },
        {
            name: "email",
            friendlyName: "Email Address",
            editable: true,
            optional: false,
            type: ETableColumnType.EMAIL
        },
        {
            name: "email_checked",
            friendlyName: "Email Verified",
            editable: true,
            optional: false,
            type: ETableColumnType.BOOLEAN
        },
        {
            name: "id_checked",
            friendlyName: "ID Verified",
            editable: true,
            optional: false,
            type: ETableColumnType.BOOLEAN
        },
        {
            name: "password",
            friendlyName: "Password",
            editable: true,
            optional: false,
            type: ETableColumnType.PASSWORD
        },
        {
            name: "password_last_update",
            friendlyName: "Password Last Update",
            editable: true,
            optional: false,
            type: ETableColumnType.DATETIME
        },
        {
            name: "address",
            friendlyName: "Address",
            editable: true,
            optional: false,
            type: ETableColumnType.STRING
        },
        {
            name: "birthday",
            friendlyName: "Birthday",
            editable: true,
            optional: true,
            type: ETableColumnType.DATE
        },
        {
            name: "national_registry",
            friendlyName: "National Registry",
            editable: true,
            optional: true,
            type: ETableColumnType.STRING
        },
        {
            name: "created_at",
            friendlyName: "Created At",
            editable: true,
            optional: false,
            type: ETableColumnType.DATE
        },
        {
            name: "role",
            friendlyName: "Role ID",
            editable: true,
            optional: false,
            type: ETableColumnType.NUMBER,
            foreignKeyTableData: memberRoleTableData
        },
        {
            name: "twoFA",
            friendlyName: "2FA ID",
            editable: true,
            optional: true,
            type: ETableColumnType.NUMBER,
            foreignKeyTableData: memberTwoFATableData
        },
        {
            name: "id_check",
            friendlyName: "ID Check ID",
            editable: true,
            optional: true,
            type: ETableColumnType.NUMBER,
            foreignKeyTableData: memberIdCheckTableData
        },
        {
            name: "validation_code",
            friendlyName: "Validation Code ID",
            editable: true,
            optional: true,
            type: ETableColumnType.NUMBER,
            foreignKeyTableData: memberValidationCodeTableData
        }
    ];

const memberTableData: ITableData =
    {
        name: "member",
        friendlyName: "Member",
        columns: memberTableColumnsData,
        url: "/member",
        selectName: "$id - $email - $address",
    }

export default memberTableData;