"use client"

import { Bold, Italic, Underline, Strikethrough, Undo2, Redo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useRef, type ChangeEvent } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Props untuk variables suggestion
interface RichTextareaProps {
    variables?: string[]
}

export function RichTextEditor({ variables = [] }: RichTextareaProps) {
    const [value, setValue] = useState("")
    const [history, setHistory] = useState<string[]>([])
    const [redoStack, setRedoStack] = useState<string[]>([])
    const [showSuggestion, setShowSuggestion] = useState(false)
    const [cursorPos, setCursorPos] = useState(0)

    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Save state ke history setiap perubahan
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value
        setHistory((prev) => [...prev, value])
        setValue(newValue)

        const pos = e.target.selectionStart || 0
        setCursorPos(pos)

        // deteksi {{
        if (newValue.slice(pos - 2, pos) === "{{") {
            setShowSuggestion(true)
        } else {
            setShowSuggestion(false)
        }
    }

    // Undo
    const handleUndo = () => {
        if (history.length > 0) {
            const prev = history[history.length - 1]
            setRedoStack((r) => [value, ...r])
            setValue(prev)
            setHistory((h) => h.slice(0, -1))
        }
    }

    // Redo
    const handleRedo = () => {
        if (redoStack.length > 0) {
            const next = redoStack[0]
            setHistory((h) => [...h, value])
            setValue(next)
            setRedoStack((r) => r.slice(1))
        }
    }

    // Insert formatting
    const applyFormat = (format: "bold" | "italic" | "underline" | "strike") => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selected = value.slice(start, end)

        let wrapped = selected
        switch (format) {
            case "bold":
                wrapped = `**${selected}**`
                break
            case "italic":
                wrapped = `*${selected}*`
                break
            case "underline":
                wrapped = `<u>${selected}</u>`
                break
            case "strike":
                wrapped = `~~${selected}~~`
                break
        }

        const newValue = value.slice(0, start) + wrapped + value.slice(end)
        setValue(newValue)
    }

    // Insert variable
    const insertVariable = (variable: string) => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = cursorPos
        const before = value.slice(0, start)
        const after = value.slice(start)

        const newValue = before + variable + "}}" + after
        setValue(newValue)
        setShowSuggestion(false)
    }

    return (
        <div className="w-full space-y-2">
            {/* Toolbar */}
            <div className="flex gap-1">
                <Button variant="outline" size="icon" onClick={handleUndo}>
                    <Undo2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleRedo}>
                    <Redo2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => applyFormat("bold")}>
                    <Bold className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => applyFormat("italic")}>
                    <Italic className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => applyFormat("underline")}>
                    <Underline className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => applyFormat("strike")}>
                    <Strikethrough className="h-4 w-4" />
                </Button>
            </div>

            {/* Textarea */}
            <div className="relative">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={handleChange}
                    className="w-full min-h-[150px] border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type something..."
                />

                {/* Suggestion Popover */}
                {showSuggestion && (
                    <Popover open={showSuggestion} onOpenChange={setShowSuggestion}>
                        <PopoverTrigger asChild>
                            <textarea
                                ref={textareaRef}
                                value={value}
                                onChange={handleChange}
                                className="w-full min-h-[150px] border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Type something..."
                            />
                        </PopoverTrigger>
                        <PopoverContent className="w-48">
                            {variables.map((v) => (
                                <button
                                    key={v}
                                    type="button"
                                    className="w-full text-left px-2 py-1 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => insertVariable(v)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            insertVariable(v)
                                        }
                                    }}
                                >
                                    {v}
                                </button>
                            ))}
                        </PopoverContent>
                    </Popover>
                )}
            </div>
        </div >
    )
}
