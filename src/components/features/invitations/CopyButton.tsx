"use client"

import { useState } from "react"
import { CheckIcon, Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCopyToClipboard } from 'react-use';
import { useInvitations } from "@/hooks/useInvitations"

interface CopyButtonProps {
    id: number
    message: string
    className?: string
    buttonVariant?: "default" | "destructive" | "ghost" | "link" | "outline"
    variant: "grid" | "list"
}

export function CopyButton({ id, message, className, variant = "grid", buttonVariant = "outline" }: CopyButtonProps) {
    const [_, copy] = useCopyToClipboard()
    const [copied, setCopied] = useState(false)
    const { updateOnCopy } = useInvitations()

    const handleCopy = async () => {
        try {
            const formattedMessage = message.replace(/\\n/g, "\n")

            await copy(formattedMessage)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
            updateOnCopy.mutate({ id })
        } catch (err) {
            console.error("Failed to copy text: ", err)
        }
    }

    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={buttonVariant}
                        size="icon"
                        className={cn("relative disabled:opacity-100 hover:cursor-pointer", className)}
                        onClick={handleCopy}
                        aria-label={copied ? "Copied" : "Copy to clipboard"}
                        disabled={copied}
                    >
                        <div
                            className={cn(
                                "transition-all",
                                copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
                            )}
                        >
                            <CheckIcon
                                className="stroke-emerald-500"
                                size={16}
                                aria-hidden="true"
                            />
                        </div>
                        <div
                            className={cn(
                                "absolute transition-all flex gap-2 items-center",
                                copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
                            )}
                        >
                            <Copy size={16} aria-hidden="true" />
                            {variant === "grid" ? 'Copy' : ''}
                        </div>
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="px-2 py-1 text-xs">
                    {copied ? "Copied!" : "Click to copy"}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
export default CopyButton