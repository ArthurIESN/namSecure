import {Button} from "@/components/ui/button.tsx";
import {type ReactElement, type RefObject, useRef} from "react";
import {EDashboardFormMode, type IDashboardState} from "@/types/components/dashboard/dashboard.ts";
import {useAppDispatch, useAppSelector} from "@/hooks/redux.ts";
import {updateDashboardState} from "@/store/slices/dashboardSlice.ts";
import tables from "@/tableData/tables.ts";
import {Checkbox} from "@/components/ui/checkbox.tsx";

export function DashboardTopBar(): ReactElement
{
    const dashboard: IDashboardState = useAppSelector(state => state.dashboard)
    const dispatch = useAppDispatch();

    const searchTimer: RefObject<NodeJS.Timeout  | null> = useRef<NodeJS.Timeout | null>(null);

    function updatePage(newValue: number): void
    {
        if(newValue + 1 < 1) return;
        dispatch(updateDashboardState({offset: newValue}));
    }

    function updateLimit(newValue: number): void
    {
        if(newValue < 1) return;
        dispatch(updateDashboardState({limit: newValue, offset: 0}));
    }

    function add(): void
    {
        dispatch(
            updateDashboardState(
            {
                formOpen: true,
                formMode: EDashboardFormMode.ADD
            }));
    }

    function search(search: string): void
    {
        if (searchTimer.current)
        {
            clearTimeout(searchTimer.current);
        }

        searchTimer.current = setTimeout((): void =>
        {
            dispatch(updateDashboardState(
            {
                search: search,
                offset: 0,
            }));
        }, 200);
    }

    function toggleForeignKeyColumn(onlyFirst: boolean): void
    {
        dispatch(updateDashboardState({onlyShowFirstColumnOfForeignKey: onlyFirst}));
    }

    return (
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-4">
                <span className={"uppercase font-black"}>{tables[dashboard.tableIndex].name} list</span>
                <div className="flex space-x-2">
                    {[1, 5, 10, 25, 50].map((limit) => (
                        <Button key={limit} variant="outline" size="sm" className={dashboard.limit === limit ? "bg-[rgb(242,178,62)]"  : ""} onClick={() => updateLimit(limit)}>
                            {limit}
                        </Button>
                    ))}
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => updatePage(dashboard.offset - 1)} disabled={dashboard.offset === 0}>
                        {"<"}
                    </Button>
                    <span>{dashboard.offset + 1}</span>
                    <Button variant="outline" size="sm" onClick={() => updatePage(dashboard.offset + 1)} disabled={!dashboard.hasMoreData}>
                        {">"}
                    </Button>
                </div>
            </div>
            <div>
                <Checkbox onCheckedChange={() => toggleForeignKeyColumn(!dashboard.onlyShowFirstColumnOfForeignKey)} checked={dashboard.onlyShowFirstColumnOfForeignKey} className="mr-2 data-[state=checked]:bg-[rgb(242,178,62)] data-[state=checked]:border-[rgb(242,178,62)]" />
                <span className={"mr-5"}>Only show ID for Foreign columns</span>
                <input placeholder="Search..." className="border rounded-md px-2 py-1 mr-5" onInput={() => search((event?.target as HTMLInputElement).value)} />
                <Button
                    variant="default"
                    className={"bg-[rgb(242,178,62)]"}
                    onClick={add}
                >
                    ADD {tables[dashboard.tableIndex].table.friendlyName.toUpperCase()}
                </Button>
            </div>
        </div>
    );
}
