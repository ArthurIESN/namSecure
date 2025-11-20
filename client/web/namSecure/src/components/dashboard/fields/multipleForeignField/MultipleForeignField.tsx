import {Button} from "@/components/ui/button.tsx";
import {getColumnName} from "@/utils/dashboard/dashboard.ts";
import {FormField} from "@/components/dashboard/FormField.tsx";
import type {IMultipleForeignFieldProps} from "@/types/components/dashboard/fields.ts";
import type {ITableColumnData} from "@/types/components/dashboard/dashboard.ts";
import type {ReactElement} from "react";

export const MultipleForeignField = (props: IMultipleForeignFieldProps): ReactElement =>
{
    const { index, column, disabled, item, handleRemoveItem, handleItemChange, foreignKeyColumns } = props;

    return (
        <div key={index} className="space-y-3 border-t pt-3">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">{column.friendlyName} #{index + 1}</span>
                <Button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    disabled={disabled}
                    className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white"
                >
                    Remove
                </Button>
            </div>

            {foreignKeyColumns.map((fkColumn: ITableColumnData): ReactElement =>
            {
                const columnName: string = getColumnName(fkColumn);
                const fieldValue: any = item[columnName];
                const key: string = `${column.name}-${index}-${fkColumn.name}`;

                return <FormField
                    key={key}
                    columnName={columnName}
                    column={fkColumn}
                    value={fieldValue}
                    onChange={(value: any) => handleItemChange(index, fkColumn, value)}
                    disabled={false}
                />;
            })}
        </div>
    )
}