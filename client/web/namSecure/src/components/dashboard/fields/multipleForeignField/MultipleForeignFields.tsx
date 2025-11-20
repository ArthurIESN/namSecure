import {type ReactElement, useState} from "react";
import {
    EDashboardFormMode,
    ETableColumnType, type IDashboardState,
    type ITableColumnData
} from "@/types/components/dashboard/dashboard.ts";
import { useAppSelector, useAppDispatch } from "@/hooks/redux.ts";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { getColumnName } from "@/utils/dashboard/dashboard.ts";
import { updateDashboardState } from "@/store/slices/dashboardSlice.ts";
import {MultipleForeignField} from "@/components/dashboard/fields/multipleForeignField/MultipleForeignField.tsx";
import type { IMultipleForeignFieldsProps } from "@/types/components/dashboard/fields";

export function MultipleForeignFields(props: IMultipleForeignFieldsProps): ReactElement
{
    const dashboard: IDashboardState = useAppSelector(state => state.dashboard);
    const dispatch = useAppDispatch();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { column, items } = props;

    const max: number = column.multipleForeignKeyTableData!.max;
    const min: number = column.multipleForeignKeyTableData!.min;
    const allForeignKeyColumns:  ITableColumnData[] = column.multipleForeignKeyTableData!.foreignKeyTableData.columns;

    const foreignKeyColumns: ITableColumnData[] = (dashboard.formMode === EDashboardFormMode.ADD
        ? allForeignKeyColumns.slice(1)
        : allForeignKeyColumns
    ).filter((column: ITableColumnData) => column.editableFromForeignKey !== false);

    const handleAddItem = (): void =>
    {
        if (items.length < max)
        {
            const newItem: Record<string, any> = {};
            foreignKeyColumns.forEach((fkColumn: ITableColumnData): void =>
            {
                if (fkColumn.type === ETableColumnType.BOOLEAN)
                {
                    newItem[getColumnName(fkColumn)] = false;
                }
                else
                {
                    newItem[getColumnName(fkColumn)] = null;
                }
            });

            checkForDuplicates(items.length, [...items, newItem]);

            dispatch(updateDashboardState(
            {
                multipleForeignKeyItems:
                {
                    ...dashboard.multipleForeignKeyItems,
                    [column.name]: [...items, newItem]
                }
            }));
        }
    };

    const handleRemoveItem = (index: number): void =>
    {
        if (items.length > min)
        {
            dispatch(updateDashboardState(
            {
                multipleForeignKeyItems: {
                    ...dashboard.multipleForeignKeyItems,
                    [column.name]: items.filter((_, i) => i !== index)
            }
            }));
        }
    };

    const checkForDuplicates = (index: number, newItems: any[]): void =>
    {
        if (!column.multipleForeignKeyTableData!.allowDuplicates)
        {
            const uniqueColumns: ITableColumnData[] = foreignKeyColumns.filter(c => c.unique);

            if (uniqueColumns.length === 0)
            {
                setErrorMessage(null);
                return;
            }

            const target: any = newItems[index];

            if (!target)
            {
                setErrorMessage(null);
                return;
            }

            const duplicateIndex: number = newItems.findIndex((item, i): boolean =>
            {
                if (i === index) return false;
                if (!item) return false;

                return uniqueColumns.every((uc): boolean =>
                {
                    const name: string = getColumnName(uc);
                    const a: any = item?.[name] ?? null;
                    const b: any = target?.[name] ?? null;
                    return a === b;
                });
            });

            if (duplicateIndex !== -1)
            {
                const names: string = uniqueColumns.map(c => c.friendlyName).join(', ');
                setErrorMessage(`Duplicate values for unique fields: ${names}`);
                return;
            }

            setErrorMessage(null);
        }
    };

    const handleItemChange = (index: number, fkColumn: ITableColumnData, value: any): void =>
    {
        const newItems: any[] = [...items];
        const columnName: string = getColumnName(fkColumn);

        newItems[index] = { ...newItems[index], [columnName]: value };

        checkForDuplicates(index, newItems);

        dispatch(updateDashboardState(
        {
            multipleForeignKeyItems:
            {
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

            <div>
                {errorMessage && (
                    <div
                        role="alert"
                        aria-live="polite"
                        className="mt-2 text-sm text-red-700 bg-red-50 px-3 py-1 rounded"
                    >
                        {errorMessage}
                    </div>
                )}
            </div>

            {items.map((item: any, index: number): ReactElement =>
            (
                <MultipleForeignField
                index={index}
                column={column}
                item={item}
                disabled={items.length === min}
                handleRemoveItem={handleRemoveItem}
                handleItemChange={handleItemChange}
                foreignKeyColumns={foreignKeyColumns}
                />
            ))}

            {items.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                    No items. Click "Add" to create one.
                </div>
            )}
        </div>
    );
}
