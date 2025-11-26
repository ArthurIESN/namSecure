export const ETableColumnType =
{
    STRING: 0,
    NUMBER: 1,
    FLOAT: 2,
    BOOLEAN: 3,
    DATE: 4,
    DATETIME: 5,
    EMAIL: 6,
    PASSWORD: 7,
} as const;

export type ETableColumnType = typeof ETableColumnType[keyof typeof ETableColumnType];

export const EDashboardFormMode =
{
    ADD: 0,
    EDIT: 1
} as const;

export type EDashboardFormMode = typeof EDashboardFormMode[keyof typeof EDashboardFormMode];

export interface IDashboardSideBarProps
{
    updateTableData: (index: number) => Promise<void>
}

export interface IDashboardFormProps
{
    updateTableData: (index: number) => Promise<void>;
}

export interface ITableColumnData
{
    name: string,
    friendlyName: string
    editable: boolean,
    secret?: boolean // If true, the data will be hidden (if editable is true, when adding or updating, the field will be blank but still editable)
    editableFromForeignKey?: boolean, // If the foreign key table's data can be edited from this table's form
    optional: boolean,
    type: ETableColumnType,
    unique?: boolean, // used when multipleForeignKeyTableData.allowDuplicates is false to identify duplicates
    foreignKeyTableData?: ITableData,
    multipleForeignKeyTableData?: ITableColumnMultipleForeignKeyData
}

export interface ITableData
{
    name: string,
    friendlyName: string,
    columns: ITableColumnData[],
    url: string,
    selectName?: string // @todo must be required everytime (cannot be non-optional at the point)
 }

export interface IDashboardState
{
    tableIndex: number,
    data: [],
    onlyShowFirstColumnOfForeignKey: boolean,
    limit: number,
    offset: number,
    search: string,
    hasMoreData: boolean,
    formOpen: boolean,
    formMode: EDashboardFormMode,
    currentRowId: number | null,
    multipleForeignKeyItems: Record<string, any[]>,
}

export interface ITable
{
    name: string,
    table: ITableData
}

export interface ITableColumnMultipleForeignKeyData
{
    min : number,
    max : number,
    allowDuplicates: boolean,
    foreignKeyTableData: ITableData,
}

export interface ITableRowActionsProps
{
    rowIndex: number;
    onEdit: (rowIndex: number) => void;
    onDelete: (rowIndex: number) => void;
}

export interface IDefaultCellProps
{
    cellKey: string;
    value: any;
    type: ETableColumnType;
}

export interface IForeignKeyCellProps
{
    columnData: ITableColumnData;
    rowData: any;
    rowIndex: number;
    onlyShowFirstColumn: boolean;
}

export interface IMultipleForeignKeyCellProps
{
    columnData: ITableColumnData;
    rowData: any;
    rowIndex: number;
    onlyShowFirstColumn: boolean;
}

export interface IDefaultHeaderProps
{
    columnName: string;
}

export interface IForeignKeyHeaderProps
{
    column: ITableColumnData;
    onlyShowFirstColumn: boolean;
}

export interface IMultipleForeignKeyHeaderProps
{
    column: ITableColumnData;
    onlyShowFirstColumn: boolean;
}