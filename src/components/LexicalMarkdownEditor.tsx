"use client";
import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import {
    $getRoot,
    $getSelection,
    $isRangeSelection,
    $isTextNode,
    EditorState,
    FORMAT_TEXT_COMMAND,
    LexicalNode,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

// 🎯 Serializer ke Markdown
function serializeMarkdown(editorState: EditorState): string {
    let output = "";
    editorState.read(() => {
        const root = $getRoot();
        root.getChildren().forEach((node: LexicalNode | null | undefined) => {
            if ($isTextNode(node)) {
                let text = node.getTextContent();
                if (node.hasFormat("bold")) text = `**${text}**`;
                if (node.hasFormat("italic")) text = `*${text}*`;
                if (node.hasFormat("underline")) text = `__${text}__`;
                output += text;
            } else {
                if (node) {
                    output += node.getTextContent();
                }
            }
        });
    });
    return output;
}

// 🎯 Toolbar custom
function Toolbar() {
    const [editor] = useLexicalComposerContext();

    const formatText = (format: "bold" | "italic" | "underline") => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    };

    return (
        <div className="flex space-x-2 border-b pb-2 mb-2">
            <button
                type="button"
                onClick={() => formatText("bold")}
                className="px-2 py-1 border rounded hover:bg-gray-100"
            >
                B
            </button>
            <button
                type="button"
                onClick={() => formatText("italic")}
                className="px-2 py-1 border rounded hover:bg-gray-100 italic"
            >
                I
            </button>
            <button
                type="button"
                onClick={() => formatText("underline")}
                className="px-2 py-1 border rounded hover:bg-gray-100 underline"
            >
                U
            </button>
        </div>
    );
}

const editorConfig = {
    namespace: "MyMarkdownEditor",
    onError(error: Error) {
        console.error(error);
    },
};

export default function LexicalMarkdownEditor() {
    const handleChange = (editorState: EditorState) => {
        const markdown = serializeMarkdown(editorState);
        console.log("Markdown output:", markdown);
    };

    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className="border rounded-lg p-3 w-full max-w-lg">
                <Toolbar />
                <RichTextPlugin
                    contentEditable={
                        <ContentEditable className="min-h-[150px] w-full outline-none p-2" />
                    }
                    placeholder={<div className="text-gray-400">Tulis sesuatu...</div>}
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <HistoryPlugin />
                <OnChangePlugin onChange={handleChange} />
            </div>
        </LexicalComposer>
    );
}
