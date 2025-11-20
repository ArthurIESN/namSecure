import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Label} from "@/components/ui/label.tsx";
import type {IBooleanFieldProps} from "@/types/components/dashboard/fields.ts";
import type {ReactElement} from "react";

export const BooleanField = (props: IBooleanFieldProps): ReactElement =>
{
    const { columnName, label, value, disabled, onChange } = props;

    return (
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
    )
}