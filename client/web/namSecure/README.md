# NamSecure BackOffice

## Display Table in the Dashboard

tables are stored in the `tables` folder located at `/tableData/tables`.'

Each table must be provided with a name and a `ITableData` object.

The dashboard will generate a table view based on the provided `ITableData` and its associated columns.
Add and edit form functionalities will also be generated based on the column definitions.

non-foreign key columns will be rendered as standard input fields
foreign key columns will be rendered as dropdowns populated with a search and data from the referenced table.

## Table Data

A `ITableData` represents the data structure with information about the table

Must contain the following properties:
- `name`: Display name of the table.
- `columns`: An array of column definitions `ITableColumnData`
- `url`: The API endpoint to fetch the table data.
- `selectName`: (may be renamed later) This property is used to display information about a row. The dashboard will automatically replace `$columnName` with the corresponding column name value from the row data. (e.g, `selectName: '$id - $first_name'` will display `1 - John` for a row with `id: 1` and `first_name: John`)


## Table Column Data
An `ITableColumnData` represents the data structure for a column in the table.

Must contain the following properties:
- `name`: Internal name of the column.
- `friendlyName`: Display name of the column.
- `editable`: Boolean indicating if the column is editable.
- `optional`: Boolean indicating if the column is optional.
- `type`: Data type of the column. Supported types stored as enum `ETableColumnType`
- `foreignKeyTableData`: (optional) If the column refers to a foreign key, this property should contain the `ITableData` of the referenced table.


### Column Types
- `STRING`: Represents text data.
- `NUMBER`: Represents numeric data.
- `BOOLEAN`: Represents boolean data (true/false).
- `DATE`: Represents date data.
- `PASSWORD`: Represents password data, typically displayed as asterisks or dots for security.
- `EMAIL`: Represents email address data.