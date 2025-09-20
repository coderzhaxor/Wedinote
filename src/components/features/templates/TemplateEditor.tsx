import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Vr from "@/components/Vr";
import { Bold, FileText, Edit, Eraser, Eye, Italic, Redo2, Strikethrough, Underline, Undo2 } from "lucide-react";
import { useRef, useState } from "react";

interface textareaProps {
    start: number,
    end: number,
    value: string
}

export default function TemplateEditor() {
    const [text, setText] = useState("");
    const [isPreview, setIsPreview] = useState<boolean>(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const [selectionBefore, setSelectionBefore] = useState<textareaProps>({})


    const handleBold = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;

        setSelectionBefore({
            start: start,
            end: end,
            value: value

        })

        let newText = "";
        let newCursorPos = 0;

        if (start !== end) {
            // Case 1: Text is selected
            const selectedText = value.slice(start, end);
            newText = value.slice(0, start) + `*${selectedText}*` + value.slice(end);
            newCursorPos = end + 4; // Move cursor after the closing **
        } else {
            // Case 2: No text selected, cursor at a position
            newText = value.slice(0, start) + `**` + value.slice(start);
            newCursorPos = start + 1; // Place cursor between ** ** for typing bold text
        }

        setText(newText);

        // Restore focus and set cursor position
        textarea.focus();
        setTimeout(() => {
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    return (
        <div className="p-6 border rounded-2xl flex flex-col gap-2 mt-6">
            <h4 className="font-medium">Editor Template</h4>
            <div className="border rounded-md">
                <div className="toolbar p-1 flex items-center justify-between border-b">
                    <div className="flex flex-wrap items-center gap-1">
                        <Button size="icon" variant="outline"><Undo2 className="size-4" /></Button>
                        <Button size="icon" variant="outline"><Redo2 className="size-4" /></Button>
                        <Vr />
                        <Button onClick={handleBold} size="icon" variant="outline"><Bold className="size-4" /></Button>
                        <Button size="icon" variant="outline"><Italic className="size-4" /></Button>
                        <Button size="icon" variant="outline"><Underline className="size-4" /></Button>
                        <Button size="icon" variant="outline"><Strikethrough className="size-4" /></Button>
                        <Vr />
                        <Button size="icon" variant="outline"><Eraser className="size-4" /></Button>
                    </div>
                    <div className="flex gap-x-1">
                        <Button variant="outline"><FileText /> Contoh Template</Button>
                        {isPreview ? (
                            <Button
                                onClick={() => setIsPreview(prev => !prev)}
                                variant="outline"
                                className="hover:cursor-pointer">
                                Edit <Edit />
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setIsPreview(prev => !prev)}
                                variant="outline"
                                className="hover:cursor-pointer">
                                Preview <Eye />
                            </Button>
                        )}
                    </div>
                </div>
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your text here..."
                    rows={5}
                    className="p-4 bg-white w-full outline-none resize-y min-h-[200px]"
                />
                <div className="template-foote bg-gray-50 r p-1 gap-1 flex items-start flex-wrap border-t">
                    <Button variant="outline">nama_tamu</Button>
                    <Button variant="outline">tanggal</Button>
                    <Button variant="outline">alamat</Button>
                    <Button variant="outline">nama_tamu</Button>
                    <Button variant="outline">tanggal</Button>
                    <Button variant="outline">alamat</Button>
                    <Button variant="outline">nama_tamu</Button>
                    <Button variant="outline">tanggal</Button>
                    <Button variant="outline">alamat</Button>
                    <Button variant="outline">nama_tamu</Button>
                    <Button variant="outline">tanggal</Button>
                    <Button variant="outline">alamat</Button>
                </div>
            </div>
            <p className="text-xs text-muted-foreground italic">Gunakan {"{{nama_variabel}}"} untuk memasukkan variabel ke dalam template.</p>
        </div>
    );
}