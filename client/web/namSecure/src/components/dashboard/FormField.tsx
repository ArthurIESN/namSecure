import {ETableColumnType} from "@/types/components/dashboard/dashboard.ts";
import {ForeignField} from "@/components/dashboard/fields/ForeignField.tsx";
import {BooleanField} from "@/components/dashboard/fields/BooleanField.tsx";
import {TextInputField} from "@/components/dashboard/fields/TextInputField.tsx";
import { formatDateForInput } from "@/utils/dashboard/dashboard.ts";
import type {IFormFieldProps} from "@/types/components/dashboard/fields.ts";
import type {ChangeEvent, ReactElement} from "react";

export const inputMapping: Record<ETableColumnType, string> =
{
    [ETableColumnType.EMAIL]: "email",
    [ETableColumnType.NUMBER]: "number",
    [ETableColumnType.FLOAT]: "number",
    [ETableColumnType.STRING]: "text",
    [ETableColumnType.DATE]: "date",
    [ETableColumnType.DATETIME]: "datetime-local",
    [ETableColumnType.PASSWORD]: "password",
    [ETableColumnType.BOOLEAN]: "checkbox",
};

export const FormField = (props: IFormFieldProps): ReactElement =>
{
    const { columnName, column, value, onChange, disabled } = props;

    const inputTypeValue: any = inputMapping[column.type];

    if (column.foreignKeyTableData)
    {
        return <ForeignField
            key={columnName}
            columnName={columnName}
            column={column}
            value={value}
            onChange={onChange}
        />;
    }

    if (column.type === ETableColumnType.BOOLEAN)
    {
        return <BooleanField
            key={columnName}
            columnName={columnName}
            label={column.friendlyName}
            value={value}
            disabled={disabled}
            onChange={onChange}
        />;
    }

    return <TextInputField
        key={columnName}
        columnName={columnName}
        label={column.friendlyName}
        value={formatDateForInput(value, column.type)}
        inputType={inputTypeValue}
        disabled={disabled}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.type === 'number' ? (e.target.valueAsNumber || 0) : e.target.value)}
        step={column.type === ETableColumnType.FLOAT ? "any" : undefined}
    />;
}