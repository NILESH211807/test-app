import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { useCallback, useState } from "react";

interface SearchInputProps {
    placeholder?: string;
    onChange: (value: string) => void;
}

export function SearchInput({
    placeholder = "Search",
    onChange
}: SearchInputProps) {

    const [value, setValue] = useState<string>("");

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        onChange(e.target.value);
    }

    const clearSearchInput = useCallback(() => {
        setValue("");
        onChange("");
    }, [onChange]);

    return (
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="search"
                placeholder={placeholder}
                className="pl-10"
                value={value}
                onChange={handleOnChange}
            />

            {
                value && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2" onClick={clearSearchInput}>
                        <X className="h-4 w-4 text-destructive cursor-pointer" />
                    </div>
                )
            }

        </div>
    )
}