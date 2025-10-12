

import { Button } from "@/components/ui/button";
import Vr from "@/components/Vr";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    $getSelection,
    $isRangeSelection,
    UNDO_COMMAND,
    REDO_COMMAND,
    CAN_UNDO_COMMAND,
    CAN_REDO_COMMAND,
    $getRoot
} from "lexical";
import { Bold, Edit, Eraser, Eye, FileText, Italic, Redo2, Strikethrough, Undo2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface ToolbarPluginProps {
    isPreview?: boolean;
    onPreview?: () => void;
    onInsertTemplate?: () => void;
}

export default function ToolbarPlugin({ onInsertTemplate, isPreview, onPreview }: ToolbarPluginProps) {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            // Check if text contains WhatsApp markdown
            const selectedText = selection.getTextContent();
            setIsBold(selectedText.startsWith('*') && selectedText.endsWith('*'));
            setIsItalic(selectedText.startsWith('_') && selectedText.endsWith('_'));
            setIsStrikethrough(selectedText.startsWith('~') && selectedText.endsWith('~'));
        }
    }, []);

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateToolbar();
            });
        });
    }, [editor, updateToolbar]);

    useEffect(() => {
        const unregisterCanUndo = editor.registerCommand(
            CAN_UNDO_COMMAND,
            (payload) => {
                setCanUndo(payload);
                return false;
            },
            1
        );

        const unregisterCanRedo = editor.registerCommand(
            CAN_REDO_COMMAND,
            (payload) => {
                setCanRedo(payload);
                return false;
            },
            1
        );

        return () => {
            unregisterCanUndo();
            unregisterCanRedo();
        };
    }, [editor]);

    const applyWhatsAppFormat = useCallback((formatChar: string) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const selectedText = selection.getTextContent();
                if (selectedText) {
                    // Check if already formatted
                    const isAlreadyFormatted =
                        selectedText.startsWith(formatChar) && selectedText.endsWith(formatChar);

                    if (isAlreadyFormatted) {
                        // Remove formatting
                        const unformattedText = selectedText.slice(1, -1);
                        selection.insertText(unformattedText);
                    } else {
                        // Add formatting
                        const formattedText = `${formatChar}${selectedText}${formatChar}`;
                        selection.insertText(formattedText);
                    }
                } else {
                    // No text selected, insert format characters
                    selection.insertText(`${formatChar}${formatChar}`);
                    // Move cursor between the characters
                    const newSelection = $getSelection();
                    if ($isRangeSelection(newSelection)) {
                        const anchor = newSelection.anchor;
                        anchor.offset = anchor.offset - 1;
                        newSelection.focus.offset = anchor.offset;
                    }
                }
            }
        });
    }, [editor]);

    const clearAll = useCallback(() => {
        editor.update(() => {
            const root = $getRoot();
            root.clear();
        });
    }, [editor]);

    return (
        <div className="flex flex-wrap gap-2 border-b p-2 items-center justify-between">
            <div className="flex items-center gap-1">
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    aria-label="Undo"
                    disabled={!canUndo}
                    onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
                >
                    <Undo2 className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    aria-label="Redo"
                    disabled={!canRedo}
                    onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
                >
                    <Redo2 className="w-4 h-4" />
                </Button>
                <Vr />
                <Button
                    type="button"
                    onClick={() => applyWhatsAppFormat('*')}
                    variant={isBold ? "default" : "outline"}
                    size="sm"
                    aria-label="Format Bold"
                >
                    <Bold className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    onClick={() => applyWhatsAppFormat('_')}
                    variant={isItalic ? "default" : "outline"}
                    size="sm"
                    aria-label="Format Italic"
                >
                    <Italic className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    onClick={() => applyWhatsAppFormat('~')}
                    variant={isStrikethrough ? "default" : "outline"}
                    size="sm"
                    aria-label="Format Strikethrough"
                >
                    <Strikethrough className="w-4 h-4" />
                </Button>
                <Vr />
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={clearAll}
                    aria-label="Clear All Content"
                >
                    <Eraser className="w-4 h-4" />
                </Button>
            </div>
            <div className="flex items-center *:flex-1 w-full sm:w-auto gap-1">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onInsertTemplate}
                >
                    <FileText className="w-4 h-4 mr-1" /> Contoh Template
                </Button>
                {isPreview ? (
                    <Button
                        type="button"
                        onClick={() => onPreview?.()}
                        variant="outline"
                        size="sm"
                        className="hover:cursor-pointer">
                        <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                ) : (
                    <Button
                        type="button"
                        onClick={() => onPreview?.()}
                        variant="outline"
                        size="sm"
                        className="hover:cursor-pointer">
                        <Eye className="w-4 h-4 mr-1" /> Preview
                    </Button>
                )}
            </div>
        </div>
    );
}