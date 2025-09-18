import { cn } from '@/lib/utils'
import { Input } from './input'
import { SearchIcon } from 'lucide-react'

interface SearchProps {
    id?: string
    className?: string
    placeholder?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Search = ({ ...props }: SearchProps) => {
    return (
        <div className={cn("relative w-full", props.className)}>
            <Input
                id={props.id || "search-invitation"}
                className="peer ps-9 pe-9"
                placeholder={props.placeholder || "Search..."}
                type="search"
                value={props.value}
                onChange={props.onChange}
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <SearchIcon size={16} />
            </div>
        </div>
    )
}

export default Search