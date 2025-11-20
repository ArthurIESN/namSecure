import type {ITableColumnData} from "@/types/components/dashboard/dashboard.ts";

export interface IFormFieldProps
{
    columnName: string;
    column: ITableColumnData;
    value: any;
    onChange: (value: any) => void;
    disabled: boolean;
}

export interface ITextInputFieldProps
{
    columnName: string,
    label: string,
    value: any,
    inputType: string,
    disabled: boolean,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    step?: string
}

export interface IForeignSearchProps
{
    placeholder?: string,
    column: ITableColumnData,
    defaultValue: number | null, //@todo implement default value
    onChange?: (value: number | null) => void
}

export interface IForeignFieldProps
{
    columnName: string,
    column: ITableColumnData,
    value: any,
    onChange: (value: any) => void
}

export interface IBooleanFieldProps
{
    columnName: string,
    label: string,
    value: any,
    disabled: boolean,
    onChange: (checked: boolean) => void
}

export interface IMultipleForeignFieldProps
{
    index: number,
    column: ITableColumnData,
    item: any,
    disabled: boolean,
    handleRemoveItem: (index: number) => void,
    handleItemChange: (index: number, fkColumn: ITableColumnData, value: any) => void,
    foreignKeyColumns: ITableColumnData[],
}

export interface IMultipleForeignFieldsProps
{
    column: ITableColumnData;
    items: any[];
}

export interface IOptionsResponse
{
    id: number;
    label: string;
}

