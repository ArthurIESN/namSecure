import {Label} from "@/components/ui/label.tsx";
import {ForeignSearchField} from "@/components/dashboard/fields/ForeignSearchField.tsx";
import type {IForeignFieldProps} from "@/types/components/dashboard/fields.ts";
import type {ReactElement} from "react";

export const ForeignField = (props: IForeignFieldProps): ReactElement =>
{
    const { columnName, column, value, onChange } =  props;

    return (
        <div className="space-y-2">
            <Label htmlFor={columnName}>{column.friendlyName}</Label>
            <ForeignSearchField
                column={column}
                placeholder={`Select ${column.friendlyName}`}
                defaultValue={value}
                onChange={onChange}
            />
        </div>
    );
}