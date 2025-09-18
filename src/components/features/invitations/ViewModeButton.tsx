import { cn } from "@/lib/utils"
import { Grid2X2Icon, ListIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type ViewModeButtonProps = {
  viewMode: "grid" | "list"
  setViewMode: (mode: "grid" | "list") => void
}

export default function ViewModeButton({ viewMode, setViewMode }: ViewModeButtonProps) {
  return (
    <div className="inline-flex -space-x-px rounded-md shadow-xs rtl:space-x-reverse">
      <Button
        className={cn(
          "rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10",
          viewMode === "grid" ? "bg-muted" : ""
        )}
        variant="outline"
        size="icon"
        aria-label="grid"
        onClick={() => setViewMode("grid")}
      >
        <Grid2X2Icon size={16} aria-hidden="true" />
      </Button>
      <Button
        className={cn(
          "rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10",
          viewMode === "list" ? "bg-muted" : ""
        )}
        variant="outline"
        size="icon"
        aria-label="list"
        onClick={() => setViewMode("list")}
      >
        <ListIcon size={16} aria-hidden="true" />
      </Button>
    </div>
  )
}
