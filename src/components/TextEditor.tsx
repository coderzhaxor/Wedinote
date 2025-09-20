import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";

export default function TextEditor() {
    const [text, setText] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleBold = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;

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
        <div className="p-4">
            <div className="mb-2">
                <Button onClick={handleBold}>Bold</Button>
            </div>
            <Textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your text here..."
                rows={5}
                className="w-full"
            />
        </div>
    );
}