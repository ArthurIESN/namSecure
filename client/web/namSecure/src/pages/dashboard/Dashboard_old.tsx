import memberRoleTableData from "@/tableData/member_role";
import memberTableData from "@/tableData/member";
import {
    ETableColumnType,
    type ITableColumnData,
    type ITableData,
    type IDashboardState
} from "@/types/components/dashboard/dashboard";
import {useEffect, useState} from "react";
import { api, type IApiResponse } from "@/utils/api/api";
//import type { IMemberRole } from "@namSecure/shared/types/member_role/member_role";
//import type { IMember} from "@namSecure/shared/types/member/member";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {AddForm} from "@/pages/dashboard/AddForm.tsx";
import {ForeignSearch} from "@/pages/dashboard/ForeignSearch.tsx";

export function Dashboard()
{

    const testTableColumData: ITableColumnData =
        {
            name: "member_role",
            friendlyName: "Member Role",
            editable: true,
            optional: false,
            type: ETableColumnType.NUMBER,
            foreignKeyTableData: memberTableData
        };


    const [addFormVisible, setAddFormVisible] = useState<boolean>(false);

    const [tableState, setTableState] = useState<IDashboardState>(
        {
            tableData: memberTableData,
            data: [],
            onlyShowFirstColumnOfForeignKey: true,
            limit: 10,
            offset: 0,
            search: ""
        });

    useEffect((): void =>
    {
        void fetchData(tableState.tableData.url);
    }, []);

    async function updateTable(newTableData: ITableData): Promise<void> {
        // D'abord mettre à jour les données, puis l'état
        const fullUrl: string = newTableData.url + `?limit=${tableState.limit}&offset=0`;
        const response: IApiResponse<any[]> = await api.get(fullUrl);

        setTableState((prevState) => ({
            ...prevState,
            tableData: newTableData,
            offset: 0,
            data: response.data as any
        }));
    }

    async function handleDelete(rowId: number): Promise<void>
    {
        const url = `${tableState.tableData.url}/${rowId}`;
        await api.delete(url);
        await fetchData(tableState.tableData.url);
    }


    async function fetchData(url: string): Promise<void>
    {
        const fullUrl: string = url + `?limit=${tableState.limit}&offset=${tableState.offset}`;
        const response: IApiResponse<any[]> = await api.get(fullUrl);
        setTableState((prevState) => ({
            ...prevState,
            data: response.data as any //  @todo refactor this, try to give the right type to data
        }));
    }

    if(tableState.data.length === 0)
    {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="flex space-x-4 mb-4">
                <button
                    onClick={() => setTableState((prevState) => ({
                        ...prevState,
                        onlyShowFirstColumnOfForeignKey: !prevState.onlyShowFirstColumnOfForeignKey
                    }))}
                    className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-300 focus:outline-none"
                >
                    SHOW FOREIGN KEY FULL
                </button>
                <button
                    onClick={() => updateTable(memberRoleTableData)}
                    className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-300 focus:outline-none"
                >
                    MEMBER ROLE
                </button>
                <button
                    onClick={() => updateTable(memberTableData)}
                    className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors focus:ring-2 focus:ring-green-300 focus:outline-none"
                >
                    MEMBER
                </button>
                <button
                    onClick={() => setAddFormVisible(!addFormVisible)}
                    className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors focus:ring-2 focus:ring-green-300 focus:outline-none"
                >
                    ADD {tableState.tableData.name}
                </button>
            </div>

            { addFormVisible && (
                <AddForm data={tableState.tableData} />
            ) }

            <table className="data-table">
                <thead>
                <tr>
                    {tableState.tableData.columns.map((column) => (
                        column.foreignKeyTableData ? (
                            tableState.onlyShowFirstColumnOfForeignKey ? (
                                // Affiche seulement la première colonne
                                <th key={`${column.name}-${column.foreignKeyTableData.columns[0].name}`}>
                                    {column.friendlyName}
                                </th>
                            ) : (
                                // Affiche toutes les colonnes
                                column.foreignKeyTableData.columns.map(fkColumn => (
                                    <th key={`${column.name}-${fkColumn.name}`}>
                                        {column.friendlyName + " " + fkColumn.friendlyName}
                                    </th>
                                ))
                            )
                        ) : (
                            <th key={column.name}>{column.friendlyName}</th>
                        )
                    ))}

                </tr>
                </thead>
                <tbody>
                {tableState.data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {tableState.tableData.columns.map((column: ITableColumnData) => (
                            column.foreignKeyTableData ? (
                                tableState.onlyShowFirstColumnOfForeignKey ? (
                                    // Affiche seulement la première colonne
                                    <td
                                        key={`${rowIndex}-${column.name}`}
                                        className={column.editable ? 'editable' : ''}
                                    >
                                        { row[column.name] === null ? "null" : row[column.name][column.foreignKeyTableData.columns[0].name] }
                                    </td>

                                ) : (
                                    // Affiche toutes les colonnes
                                    column.foreignKeyTableData.columns.map(fkColumn => (
                                        <td
                                            key={`${rowIndex}-${column.name}-${fkColumn.name}`}
                                            className={column.editable ? 'editable' : ''}
                                        >
                                            { row[column.name] === null ? "null" : row[column.name][fkColumn.name] }

                                        </td>
                                    ))
                                )
                            ) : (
                                <td
                                    key={`${rowIndex}-${column.name}`}
                                    className={column.editable ? 'editable' : ''}
                                >
                                    {column.type === ETableColumnType.BOOLEAN ? (
                                        <Checkbox checked={row[column.name]} />
                                    ) : (
                                        row[column.name] === null ? 'null' : row[column.name]
                                    )}
                                </td>
                            )
                        ))}
                        <td className="p-2">
                            <button
                                onClick={() => handleDelete(row.id)}
                                className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 transition-colors focus:ring-2 focus:ring-red-300 focus:outline-none"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}


                </tbody>
            </table>
            <ForeignSearch
                data={testTableColumData}
                onSelect={(value) => {
                    console.log(`Selected ${value} for testing`)
                }}
                placeholder={`Select for testing`}
            />
        </div>

    );


}