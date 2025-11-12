import React, { type ReactElement } from "react";
import {
    EDashboardFormMode,
    ETableColumnType, type IDashboardState,
    type ITableColumnData
} from "@/types/components/dashboard/dashboard.ts";
import { useAppSelector, useAppDispatch } from "@/hooks/redux.ts";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { getColumnName, renderFieldForColumn } from "@/pages/dashboard/form/DashboardFormFields.tsx";
import { updateDashboardState } from "@/store/slices/dashboardSlice.ts";

interface MultipleForeignKeyFieldProps {
    column: ITableColumnData;
    items: any[];
}

export function MultipleForeignKeyField({
    column,
    items
}: MultipleForeignKeyFieldProps): ReactElement {
    const dashboard: IDashboardState = useAppSelector(state => state.dashboard);
    const dispatch = useAppDispatch();
    const max: number = column.multipleForeignKeyTableData!.max;
    const min: number = column.multipleForeignKeyTableData!.min;
    const allForeignKeyColumns:  ITableColumnData[] = column.multipleForeignKeyTableData!.foreignKeyTableData.columns;

    const foreignKeyColumns: ITableColumnData[] = (dashboard.formMode === EDashboardFormMode.ADD
        ? allForeignKeyColumns.slice(1)
        : allForeignKeyColumns
    ).filter((column: ITableColumnData) => column.editableFromForeignKey !== false);

    const handleAddItem = () => {
        if (items.length < max) {
            const newItem: Record<string, any> = {};
            foreignKeyColumns.forEach((fkColumn) => {
                if (fkColumn.type === ETableColumnType.BOOLEAN) {
                    newItem[getColumnName(fkColumn)] = false;
                } else {
                    newItem[getColumnName(fkColumn)] = null;
                }
            });

            dispatch(updateDashboardState({
                multipleForeignKeyItems: {
                    ...dashboard.multipleForeignKeyItems,
                    [column.name]: [...items, newItem]
                }
            }));
        }
    };

    const handleRemoveItem = (index: number) => {
        if (items.length > min) {
            dispatch(updateDashboardState({
                multipleForeignKeyItems: {
                    ...dashboard.multipleForeignKeyItems,
                    [column.name]: items.filter((_, i) => i !== index)
                }
            }));
        }
    };

    const handleItemChange = (index: number, fkColumn: ITableColumnData, value: any) => {
        const newItems = [...items];
        const columnName = getColumnName(fkColumn);

        newItems[index] = { ...newItems[index], [columnName]: value };
        dispatch(updateDashboardState({
            multipleForeignKeyItems: {
                ...dashboard.multipleForeignKeyItems,
                [column.name]: newItems
            }
        }));
    };

    return (
        <div className="space-y-4 border p-4 rounded-lg" key={column.name}>
            <div className="flex justify-between items-center">
                <Label className="text-base font-semibold">{column.friendlyName}</Label>
                <Button
                    type="button"
                    onClick={handleAddItem}
                    disabled={items.length >= max}
                    className="px-3 py-1 text-sm"
                >
                    + Add
                </Button>
            </div>

            {items.map((item: any, index: number) => (
                <div key={index} className="space-y-3 border-t pt-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">{column.friendlyName} #{index + 1}</span>
                        <Button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            disabled={items.length <= min}
                            className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white"
                        >
                            Remove
                        </Button>
                    </div>

                    {foreignKeyColumns.map((fkColumn) => {
                        const columnName = getColumnName(fkColumn);
                        const fieldValue = item[columnName];
                        const key = `${column.name}-${index}-${fkColumn.name}`;

                        return (
                            <div key={key}>
                                {renderFieldForColumn(
                                    fkColumn,
                                    fieldValue ?? (fkColumn.type === ETableColumnType.BOOLEAN ? false : ""),
                                    (value) => handleItemChange(index, fkColumn, value),
                                    !fkColumn.editable
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}

            {items.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                    No items. Click "Add" to create one.
                </div>
            )}
        </div>
    );
}
