import { Info } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function TableInfo() {
    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-md size-9"
                    >
                        <Info />
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="py-3">
                    <div className="space-y-2">
                        <Image
                            className="w-full rounded"
                            src="/excel.png"
                            width={382}
                            height={216}
                            alt="Table Information"
                            priority
                        />
                        <div className="space-y-1">
                            <p className="text-[13px] font-medium">
                                Excel Contact Data
                            </p>
                            <p className="text-muted-foreground text-xs">
                                Excel file must contain two columns: "name" and "phone"
                            </p>
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
