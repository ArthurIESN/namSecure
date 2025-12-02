import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command.tsx"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Check, ChevronsUpDown } from "lucide-react"
import {type ReactElement, useEffect, useState} from "react"
import { cn } from "@/lib/utils.ts"
import {api} from "@/utils/api/api.ts";
import type { IForeignSearchProps, IOptionsResponse } from "@/types/components/dashboard/fields";


export function ForeignSearchField({ column, defaultValue, placeholder = "Select an item...", onChange }: IForeignSearchProps): ReactElement
{
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>("");
    const [options, setOptions] = useState<Array<IOptionsResponse>>([])
    const [search, setSearch] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const handleValueChange = (newValue: string): void =>
    {
        setValue(newValue);
        onChange?.(newValue ? Number(newValue) : null);
    };

    // Replace $var in the label with the corresponding row data value
    const formatLabel = (item: any): string =>
    {
        if (!column.foreignKeyTableData?.selectName) return String(item.id);

        let label: string = column.foreignKeyTableData.selectName;
        const matches: RegExpMatchArray | [] = label.match(/\$\w+/g) || []; // search for $var in the label string

        matches.forEach(match =>
        {
            const key: string = match.slice(1);
            label = label.replace(match, String(item[key] ?? ''));
        });

        return label;
    }

    const loadOptions = async (searchValue: string): Promise<void> =>
    {
        try
        {
            const fullUrl: string = `${column.foreignKeyTableData?.url}?limit=3&offset=0${searchValue ? `&search=${searchValue}` : ''}`;
            const response = await api.get(fullUrl);

            if (Array.isArray(response.data))
            {
                const formattedOptions: IOptionsResponse[] = response.data.map((item: any) => (
                {
                    id: item.id,
                    label: formatLabel(item)
                }));

                setOptions(formattedOptions);
            }
        }
        catch (error: any)
        {
            console.error('Error loading options:', error);
            setOptions([]);
        }
        finally
        {
            setIsLoading(false);
        }
    };

    useEffect(() =>
    {
        const timer = setTimeout((): void =>
        {
            void loadOptions(search);
        }, 100);

        return () => clearTimeout(timer);
    }, [search, column]);

    useEffect(() =>
    {
        if (defaultValue && options.length > 0)
        {
            const defaultOption: IOptionsResponse | undefined = options.find(option => option.id === defaultValue);

            if (defaultOption)
            {
                handleValueChange(defaultOption.id.toString());
                //setSearch(defaultOption.label);
            }
        }
    }, [defaultValue, options]);


    return (
        <div>
            <input type="hidden" id={column.foreignKeyTableData?.columns[0].name + "_" + column.foreignKeyTableData?.name} name={column.foreignKeyTableData?.columns[0].name + "_" + column.foreignKeyTableData?.name} value={value} />
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {
                            isLoading
                                ? "Loading..."
                                : value && options
                                    ? options.find((option: IOptionsResponse): boolean => option.id.toString() === value)?.label
                                    : placeholder
                        }
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
                                        handleValueChange(option.id.toString());
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
