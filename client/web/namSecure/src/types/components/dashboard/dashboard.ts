export enum ETableColumnType
{
    STRING,
    NUMBER ,
    BOOLEAN ,
    DATE,
    EMAIL,
    PASSWORD
}

export interface ITableColumnData
{
    name: string,
    friendlyName: string
    editable: boolean,
    optional: boolean,
    type: ETableColumnType,
    foreignKeyTableData?: ITableData,
}

export interface ITableData
{
    name: string,
    columns: ITableColumnData[],
    url: string,
    selectName?: string // @todo must be required everytime
 }

export interface IDashboardState
{
    tableIndex: number,
    data: [],
    onlyShowFirstColumnOfForeignKey: boolean,
    limit: number,
    offset: number,
    search: string,
    formOpen: boolean
}

export interface IDashboardSideBarProps
{
    onTableChange: (index: number) => void
}