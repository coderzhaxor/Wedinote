import React, { useState, useEffect, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { $getRoot, $createParagraphNode, $createTextNode, $getSelection, $isRangeSelection, EditorState } from "lexical";
import { FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND } from "lexical";
import { $isTextNode, $isParagraphNode } from "lexical";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Bold, Italic, Strikethrough, Undo, Redo, Eraser } from "lucide-react";

const theme = {
    paragraph: "mb-2",
    text: {
        bold: "font-bold",
        italic: "italic",
        strikethrough: "line-through",
    },
};

interface LexicalRichTextAreaProps {
    suggestions: string[];
}

const Editor: React.FC<{ onChange: (markdown: string) => void; suggestions: string[] }> = ({ onChange, suggestions }) => {
    const [editor] = useLexicalComposerContext();
    const [open, setOpen] = useState(false);
    const [currentWord, setCurrentWord] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const suggestionRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const handleBold = () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
    };

    const handleItalic = () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
    };

    const handleStrikethrough = () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
    };

    const handleUndo = () => {
        editor.dispatchCommand(UNDO_COMMAND, undefined);
    };

    const handleRedo = () => {
        editor.dispatchCommand(REDO_COMMAND, undefined);
    };

    const handleEraseAll = () => {
        editor.update(() => {
            const root = $getRoot();
            root.clear();
            root.append($createParagraphNode());
        });
    };

    const convertToMarkdown = (editorState: EditorState): string => {
        return editorState.read(() => {
            const root = $getRoot();
            let markdown = "";
            const children = root.getChildren();
            children.forEach((node) => {
                if ($isParagraphNode(node)) {
                    let paragraphText = "";
                    const textNodes = node.getChildren();
                    textNodes.forEach((childNode) => {
                        if ($isTextNode(childNode)) {
                            let text = childNode.getTextContent();
                            if (childNode.hasFormat("bold")) {
                                text = `*${text}*`;
                            }
                            if (childNode.hasFormat("italic")) {
                                text = `_${text}_`;
                            }
                            if (childNode.hasFormat("strikethrough")) {
                                text = `~${text}~`;
                            }
                            paragraphText += text;
                        }
                    });
                    markdown += paragraphText + "\n\n";
                }
            });
            return markdown.trim();
        });
    };

    const getCurrentWord = (): string => {
        return editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const anchor = selection.anchor;
                if (anchor.type === "text") {
                    const textNode = anchor.getNode();
                    const text = textNode.getTextContent();
                    const offset = anchor.offset;
                    const words = text.slice(0, offset).split(/\s+/);
                    return words[words.length - 1] || "";
                }
            }
            return "";
        });
    };

    const insertSuggestion = (suggestion: string) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const anchor = selection.anchor;
                if (anchor.type === "text") {
                    const textNode = anchor.getNode();
                    const text = textNode.getTextContent();
                    const offset = anchor.offset;
                    const words = text.slice(0, offset).split(/\s+/);
                    const currentWord = words[words.length - 1] || "";
                    const startOffset = offset - currentWord.length;
                    textNode.setTextContent(
                        text.slice(0, startOffset) + suggestion + text.slice(offset)
                    );
                    selection.setTextNodeRange(
                        textNode,
                        startOffset + suggestion.length,
                        textNode,
                        startOffset + suggestion.length
                    );
                } else {
                    const newTextNode = $createTextNode(suggestion);
                    selection.insertNodes([newTextNode]);
                    selection.setTextNodeRange(newTextNode, suggestion.length, newTextNode, suggestion.length);
                }
            }
        });
        setOpen(false);
        setCurrentWord("");
        setFocusedIndex(-1);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, suggestion: string, index: number) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            insertSuggestion(suggestion);
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            const nextIndex = (index + 1) % filteredSuggestions.length;
            setFocusedIndex(nextIndex);
            suggestionRefs.current[nextIndex]?.focus();
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            const prevIndex = (index - 1 + filteredSuggestions.length) % filteredSuggestions.length;
            setFocusedIndex(prevIndex);
            suggestionRefs.current[prevIndex]?.focus();
        } else if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false);
            setFocusedIndex(-1);
            editor.focus();
        }
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const updateSuggestions = () => {
            const word = getCurrentWord();
            setCurrentWord(word);
            if (word.length > 0) {
                const matches = suggestions.filter((s) =>
                    s.toLowerCase().startsWith(word.toLowerCase())
                );
                setFilteredSuggestions(matches);
                setOpen(matches.length > 0);
                setFocusedIndex(-1);
            } else {
                setFilteredSuggestions([]);
                setOpen(false);
                setFocusedIndex(-1);
            }
        };

        editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateSuggestions();
            });
        });

        return () => {
            suggestionRefs.current = [];
        };
    }, [editor, suggestions]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (open && filteredSuggestions.length > 0 && focusedIndex === -1) {
            setFocusedIndex(0);
            suggestionRefs.current[0]?.focus();
        }
    }, [open, filteredSuggestions]);

    return (
        <div className="border rounded-md p-4">
            <div className="flex gap-2 mb-2">
                <Button variant="outline" size="icon" onClick={handleBold} title="Bold" className="p-1">
                    <Bold className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleItalic} title="Italic" className="p-1">
                    <Italic className="h-4 w-4" />
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
                <Button variant="outline" size="icon" onClick={handleUndo} title="Undo" className="p-1">
                    <Undo className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleRedo} title="Redo" className="p-1">
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
            <Popover open={open} onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen) {
                    setFocusedIndex(-1);
                    editor.focus();
                }
            }}>
                <PopoverTrigger asChild>
                    <div className="relative">
                        <RichTextPlugin
                            contentEditable={
                                <ContentEditable
                                    className={cn(
                                        "min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                        "prose max-w-none"
                                    )}
                                />
                            }
                            placeholder={
                                <div className="absolute top-[4.5rem] left-3 text-sm text-muted-foreground pointer-events-none">
                                    Type here...
                                </div>
                            }
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-48">
                    <div className="max-h-40 overflow-y-auto">
                        {filteredSuggestions.map((suggestion, index) => (
                            <button
                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                key={index}
                                ref={(el) => {
                                    suggestionRefs.current[index] = el;
                                }}
                                className={cn(
                                    "w-full text-left px-2 py-1 hover:bg-gray-100 focus:bg-gray-100",
                                    focusedIndex === index && "bg-gray-100"
                                )}
                                onClick={() => insertSuggestion(suggestion)}
                                onKeyDown={(e) => handleKeyDown(e, suggestion, index)}
                                type="button"
                                role="option"
                                aria-selected={focusedIndex === index}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
            <HistoryPlugin />
            <OnChangePlugin
                onChange={(editorState) => {
                    const markdown = convertToMarkdown(editorState);
                    onChange(markdown);
                }}
            />
        </div>
    );
};

const LexicalRichTextArea: React.FC<LexicalRichTextAreaProps> = ({ suggestions = [] }) => {
    const [markdownOutput, setMarkdownOutput] = useState("");

    const initialConfig = {
        namespace: "MyEditor",
        theme,
        onError: (error: Error) => console.error(error),
        nodes: [],
    };

    return (
        <div>
            <LexicalComposer initialConfig={initialConfig}>
                <Editor onChange={setMarkdownOutput} suggestions={suggestions} />
            </LexicalComposer>
            <div className="mt-4">
                <h3 className="text-lg font-semibold">Markdown Output:</h3>
                <pre className="bg-gray-100 p-2 rounded-md">{markdownOutput || "No content yet"}</pre>
            </div>
        </div>
    );
};

export default LexicalRichTextArea;