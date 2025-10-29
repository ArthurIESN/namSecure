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
    const [isLoading, setIsLoading] = useState(true)

    const formatLabel = (item: any) => {
        if (!data.foreignKeyTableData?.selectName) return String(item.id);
        let label = data.foreignKeyTableData.selectName;

        // Remplace dynamiquement tous les $quelquechose par les valeurs correspondantes
        const matches = label.match(/\$\w+/g) || [];
        matches.forEach(match => {
            const key = match.slice(1); // Enlève le $
            label = label.replace(match, String(item[key] ?? ''));
        });

        return label;
    }

    useEffect(() => {
        async function loadOptions() {
            try {
                setIsLoading(true)
                const fullUrl = data.foreignKeyTableData?.url + `?limit=5&offset=0`
                const response = await api.get(fullUrl)

                const formattedOptions = response.data.map((item: any) => ({
                    id: item.id,
                    label: formatLabel(item)
                }))

                setOptions(formattedOptions)
            } catch (error) {
                console.error('Error loading options:', error)
            } finally {
                setIsLoading(false)
            }
        }

        void loadOptions()
    }, [data])


        return (
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
                    <CommandInput placeholder="Search..." />
                    <CommandEmpty>No item found.</CommandEmpty>
                    <CommandGroup>
                        {options && options.map((option) => (
                            <CommandItem
                                key={option.id}
                                value={option.id.toString()}
                                onSelect={(currentValue) => {
                                    setValue(currentValue)
                                    onSelect(parseInt(currentValue))
                                    setOpen(false)
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
    )
}
