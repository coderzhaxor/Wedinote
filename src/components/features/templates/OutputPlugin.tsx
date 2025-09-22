import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { useEffect } from "react";

interface OutputPluginProps {
    onContentChange: (content: string) => void;
}

export default function OutputPlugin({ onContentChange }: OutputPluginProps) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const root = $getRoot();
                const textContent = root.getTextContent();
                onContentChange(textContent);
            });
        });
    }, [editor, onContentChange]);

    return null;
}