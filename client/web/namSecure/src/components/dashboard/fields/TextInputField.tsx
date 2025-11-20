import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import type {ITextInputFieldProps} from "@/types/components/dashboard/fields.ts";
import type {ReactElement} from "react";

export const TextInputField = (props: ITextInputFieldProps): ReactElement =>
{
    const { columnName, label, value, inputType, disabled, onChange, step } = props;

    return (
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
    )
}