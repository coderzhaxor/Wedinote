import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type filterProps = {
  value: string
  onChange: (val: string) => void
}

function StatusDot({ className }: { className?: string }) {
  return (
    <svg
      width="8"
      height="8"
      fill="currentColor"
      viewBox="0 0 8 8"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="4" cy="4" r="4" />
    </svg>
  )
}

export default function FilterButton({ value, onChange }: filterProps) {
  return (
    <div className="*:not-first:mt-2">
      <Select value={value} onValueChange={onChange} defaultValue="all">
        <SelectTrigger id="filter-button">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>

        <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
          <SelectItem value="all">
            <span className="flex items-center gap-2">
              <StatusDot className="text-gray-500" />
              <span className="truncate">Semua</span>
            </span>
          </SelectItem>

          <SelectItem value="diundang">
            <span className="flex items-center gap-2">
              <StatusDot className="text-emerald-600" />
              <span className="truncate">Diundang</span>
            </span>
          </SelectItem>

          <SelectItem value="belum">
            <span className="flex items-center gap-2">
              <StatusDot className="text-red-500" />
              <span className="truncate">Belum diundang</span>
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
