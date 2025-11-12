import { type ReactElement, type ChangeEvent } from "react";
import {
    ETableColumnType,
    type ITableColumnData
} from "@/types/components/dashboard/dashboard.ts";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { ForeignSearch } from "@/pages/dashboard/ForeignSearch.tsx";
import type { CheckedState } from "@radix-ui/react-checkbox";

export const inputMapping: { [key: ETableColumnType]: string } = {
    [ETableColumnType.EMAIL]: "email",
    [ETableColumnType.NUMBER]: "number",
    [ETableColumnType.FLOAT]: "number",
    [ETableColumnType.STRING]: "text",
    [ETableColumnType.DATE]: "date",
    [ETableColumnType.DATETIME]: "datetime-local",
    [ETableColumnType.PASSWORD]: "password",
    [ETableColumnType.BOOLEAN]: "checkbox",
};

export const getColumnName = (column: ITableColumnData): string =>
{
    return column.foreignKeyTableData
        ? (column.foreignKeyTableData.columns[0].name + "_" + column.foreignKeyTableData.name)
        : column.name;
};

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

export const renderBooleanField = (columnName: string, label: string, value: any, disabled: boolean, onChange: (checked: CheckedState) => void): ReactElement => (
    <div className="flex items-center space-x-4 mt-6">
        <Checkbox
            key={columnName}
            checked={value === true || value === "true"}
            onCheckedChange={onChange}
            disabled={disabled}
            className="w-4 h-4 data-[state=checked]:bg-[rgb(242,178,62)] data-[state=checked]:border-[rgb(242,178,62)]"
        />
        <Label htmlFor={columnName}>{label}</Label>
    </div>
);

export const renderTextInputField = (columnName: string, label: string, value: any, inputType: string, disabled: boolean, onChange: (e: ChangeEvent<HTMLInputElement>) => void, step?: string): ReactElement => (
    <div className="space-y-2">
        <Label htmlFor={columnName}>{label}</Label>
        <Input
            key={columnName}
            type={inputType}
            value={value}
            onChange={onChange}
            step={step}
            disabled={disabled}
            placeholder={label}
        />
    </div>
);

export const renderFieldForColumn = (column: ITableColumnData, value: any, onChange: (value: any) => void, disabled: boolean = false): ReactElement =>
{
    const columnName: string = getColumnName(column);
    const inputTypeValue: any = inputMapping[column.type];

    if (column.foreignKeyTableData)
    {
        return (
            <div className="space-y-2">
                <Label htmlFor={columnName}>{column.friendlyName}</Label>
                <ForeignSearch
                    column={column}
                    placeholder={`Select ${column.friendlyName}`}
                    defaultValue={value}
                    onChange={onChange}
                />
            </div>
        );
    }

    if (column.type === ETableColumnType.BOOLEAN)
    {
        return renderBooleanField(columnName, column.friendlyName, value, disabled, onChange);
    }

    return renderTextInputField(columnName, column.friendlyName, value, inputTypeValue, disabled, (e: ChangeEvent<HTMLInputElement>): void => onChange(e.target.value), column.type === ETableColumnType.FLOAT ? "any" : undefined);
};
