export enum ETableColumnType
{
    STRING,
    NUMBER ,
    FLOAT,
    BOOLEAN ,
    DATE,
    DATETIME,
    EMAIL,
    PASSWORD,
}

export enum EDashboardFormMode
{
    ADD,
    EDIT
}

export interface ITableColumnData
{
    name: string,
    friendlyName: string
    editable: boolean,
    optional: boolean,
    type: ETableColumnType,
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
    formOpen: boolean,
    formMode: EDashboardFormMode,
    currentRowId: number | null,
}

export interface ITable
{
    name: string,
    table: ITableData
}

export interface ITableColumnMultipleForeignKeyData{
    min : number,
    max : number,
    foreignKeyTableData: ITableData,
}