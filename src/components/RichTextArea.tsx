import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bold, Italic, Underline, Redo, Undo, Strikethrough, Eraser } from "lucide-react";

const RichTextArea: React.FC = () => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const saveToHistory = (content: string) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(content);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const execCommand = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            saveToHistory(editorRef.current.innerHTML);
        }
    };

    const handleBold = () => execCommand("bold");
    const handleItalic = () => execCommand("italic");
    const handleUnderline = () => execCommand("underline");
    const handleStrikethrough = () => execCommand("strikeThrough");
    const handleUndo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            if (editorRef.current) {
                editorRef.current.innerHTML = history[historyIndex - 1];
            }
        }
    };
    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            if (editorRef.current) {
                editorRef.current.innerHTML = history[historyIndex + 1];
            }
        }
    };
    const handleEraseAll = () => {
        if (editorRef.current) {
            editorRef.current.innerHTML = "";
            saveToHistory("");
        }
    };

    const handleInput = () => {
        if (editorRef.current) {
            saveToHistory(editorRef.current.innerHTML);
        }
    };

    return (
        <div className="border rounded-md p-4">
            <div className="flex gap-2 mb-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleBold}
                    title="Bold"
                    className="p-1"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleItalic}
                    title="Italic"
                    className="p-1"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleUnderline}
                    title="Underline"
                    className="p-1"
                >
                    <Underline className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleStrikethrough}
                    title="Strikethrough"
                    className="p-1"
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleUndo}
                    title="Undo"
                    className="p-1"
                    disabled={historyIndex <= 0}
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRedo}
                    title="Redo"
                    className="p-1"
                    disabled={historyIndex >= history.length - 1}
                >
                    <Redo className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleEraseAll}
                    title="Erase All"
                    className="p-1"
                >
                    <Eraser className="h-4 w-4" />
                </Button>
            </div>
            <div
                ref={editorRef}
                contentEditable
                className={cn(
                    "min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "prose max-w-none"
                )}
                onInput={handleInput}
            // placeholder removed, not supported on div
            />
        </div>
    );
};

export default RichTextArea;