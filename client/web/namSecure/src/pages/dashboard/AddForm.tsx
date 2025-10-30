// THIS IS JUST A PROTYPE
// THIS FORM WILL ALSO BE USED TO UPDATE A ROW

import type {ITableData} from "@/types/components/dashboard/dashboard";
import {ForeignSearch} from "@/pages/dashboard/ForeignSearch";
import {api} from "@/utils/api/api.ts";

interface IAddFormProps
{
    data: ITableData;
}

export function AddForm({data}: IAddFormProps)
{

    async function handleAdd() { // Removed event parameter
        const formObject: Record<string, any> = {};

        data.columns.forEach((column) => {
            const columnName = column.foreignKeyTableData ? (column.foreignKeyTableData.columns[0].name + "_" + column.foreignKeyTableData.name) : column.name;
            const input = document.getElementById(columnName) as HTMLInputElement;
            let value = input?.value;

            console.debug(`Processing column: ${columnName}, type: ${column.type}, value: ${value}`);

            if (column.type === 1) { // NUMBER

                value = value ? Number(value) : null;
            } else if (column.type === 2) { // BOOLEAN
                value = input?.checked;
            }

            formObject[columnName] = value;
        });

        console.log("Form Data to be submitted:", formObject);
        const response = await api.post( data.url, formObject);

        console.log("Response from server:", response);

        //@todo, close this form and refresh the table data after successful addition
    }

    return (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full pointer-events-auto">
                    {data.columns.map((column) => (
                        <div key={column.name} className="flex flex-col">
                            <label
                                htmlFor={column.name}
                                className="text-sm font-medium text-gray-700 mb-1"
                            >
                                {column.friendlyName}:
                            </label>
                            {column.foreignKeyTableData ? (
                                <ForeignSearch
                                    data={column}
                                    onSelect={(value) => {
                                        // Handle foreign key selection
                                        console.log(`Selected ${value} for ${column.name}`)
                                    }}
                                    placeholder={`Select ${column.friendlyName}`}
                                />
                            ) : (
                                <input
                                    type={column.type === 0 ? "text" : column.type === 1 ? "number" : column.type === 2 ? "checkbox" : "date"}
                                    id={column.name}
                                    name={column.name}
                                    required={!column.optional}
                                    disabled={!column.editable}
                                    className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            )}
                        </div>
                    ))}
                    <button
                        onClick={handleAdd}
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    >
                        Add
                    </button>

            </div>




        </div>
    );
}


