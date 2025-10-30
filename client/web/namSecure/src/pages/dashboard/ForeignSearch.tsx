import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import {useEffect, useState} from "react"
import { cn } from "@/lib/utils"
import {api, type IApiResponse} from "@/utils/api/api.ts";
import type {ITableColumnData} from "@/types/components/dashboard/dashboard.ts";

interface ForeignSearchProps {
    onSelect: (value: number) => void
    placeholder?: string,
    data: ITableColumnData
}

export function ForeignSearch({ data, onSelect, placeholder = "Select an item..." }: ForeignSearchProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [options, setOptions] = useState<Array<{ id: number; label: string }>>([])
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true)

    const formatLabel = (item: any) => {
        if (!data.foreignKeyTableData?.selectName) return String(item.id);
        let label = data.foreignKeyTableData.selectName;
        const matches = label.match(/\$\w+/g) || [];
        matches.forEach(match => {
            const key = match.slice(1);
            label = label.replace(match, String(item[key] ?? ''));
        });
        return label;
    }

    const loadOptions = async (searchValue: string) => {
        try {
            const fullUrl = `${data.foreignKeyTableData?.url}?limit=10&offset=0${searchValue ? `&search=${searchValue}` : ''}`;
            const response = await api.get(fullUrl);

            if (Array.isArray(response.data)) {
                const formattedOptions = response.data.map((item: any) => ({
                    id: item.id,
                    label: formatLabel(item)
                }));
                setOptions(formattedOptions);
                console.debug(formattedOptions);
            }
        } catch (error) {
            console.error('Error loading options:', error);
            setOptions([]);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            void loadOptions(search);
        }, 100);

        return () => clearTimeout(timer);
    }, [search, data]);


    return (
        <div>
            <input type="hidden" id={data.foreignKeyTableData?.columns[0].name + "_" + data.foreignKeyTableData?.name} name={data.foreignKeyTableData?.columns[0].name + "_" + data.foreignKeyTableData?.name} value={value} />
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {value && options
                            ? options.find((option) => option.id.toString() === value)?.label
                            : placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput
                            placeholder="Search..."
                            value={search}
                            onValueChange={setSearch}
                        />
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.id}
                                    value={option.label}
                                    onSelect={() => {
                                        setValue(option.id.toString());
                                        onSelect(option.id);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === option.id.toString() ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
