import {ETableColumnType, type ITableColumnData} from "@/types/components/dashboard/dashboard.ts";

export const formatDateForInput = (value: any, type: ETableColumnType): string =>
{
    if (!value) return "";

    if (type === ETableColumnType.DATE)
    {
        return new Date(value).toISOString().split('T')[0];
    }
    else if (type === ETableColumnType.DATETIME)
    {
        return new Date(value).toISOString().slice(0, 16);
    }
    return value;
};

export const getColumnName = (column: ITableColumnData): string =>
{
    return column.foreignKeyTableData
        ? (column.foreignKeyTableData.columns[0].name + "_" + column.foreignKeyTableData.name)
        : column.name;
};