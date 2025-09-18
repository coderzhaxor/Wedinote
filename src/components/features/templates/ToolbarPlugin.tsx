// src/ToolbarPlugin.jsx

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import { useCallback, useEffect, useState } from "react";

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat("bold"));
            setIsItalic(selection.hasFormat("italic"));
            setIsUnderline(selection.hasFormat("underline"));
        }
    }, []);

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateToolbar();
            });
        });
    }, [editor, updateToolbar]);

    const buttonClasses = "p-2 border rounded-md mx-1";
    const activeClasses = "bg-gray-200";
    const hoverClasses = "hover:bg-gray-100";

    return (
        <div className="p-2 border-b">
            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
                className={`${buttonClasses} ${hoverClasses} ${isBold ? activeClasses : ""}`}
                aria-label="Format Bold"
            >
                Bold
            </button>
            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
                className={`${buttonClasses} ${hoverClasses} ${isItalic ? activeClasses : ""}`}
                aria-label="Format Italic"
            >
                Italic
            </button>
            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
                className={`${buttonClasses} ${hoverClasses} ${isUnderline ? activeClasses : ""}`}
                aria-label="Format Underline"
            >
                <u>Underline</u>
            </button>
        </div>
    );
}