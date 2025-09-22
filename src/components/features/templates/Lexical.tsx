import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $getRoot } from 'lexical';
import type { EditorState } from 'lexical';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

import ToolbarPlugin from './ToolbarPlugin';
import OutputPlugin from './OutputPlugin';
import TemplateInsertPlugin from './TemplateInsertPlugin';

function onError(error: Error) {
    console.error(error);
}

interface LexicalProps {
    onContentChange?: (content: string) => void;
}

export default function Lexical({ onContentChange }: LexicalProps) {
    const [editorContent, setEditorContent] = useState('');
    const [shouldInsertTemplate, setShouldInsertTemplate] = useState(false);

    const handleInsertTemplate = () => {
        setShouldInsertTemplate(true);
    };

    const handleTemplateInserted = () => {
        setShouldInsertTemplate(false);
    };

    const initialConfig = {
        namespace: 'MyEditor',
        onError,
    };

    // Function to handle editor changes
    const onChange = (editorState: EditorState) => {
        editorState.read(() => {
            const root = $getRoot();
            const textContent = root.getTextContent();
            setEditorContent(textContent);
            onContentChange?.(textContent);
            console.log('Editor content:', textContent);
        });
    };

    // Function to get formatted content (with markdown)
    const getFormattedContent = () => {
        console.log('Current content:', editorContent);
        alert(`Current content: ${editorContent}`);
    };

    return (
        <div className="border rounded-md">
            <LexicalComposer initialConfig={initialConfig}>
                <ToolbarPlugin onInsertTemplate={handleInsertTemplate} />
                <RichTextPlugin
                    contentEditable={
                        <ContentEditable
                            className="min-h-[200px] p-4 outline-none border-b"
                        />
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <OnChangePlugin onChange={onChange} />
                <TemplateInsertPlugin
                    shouldInsert={shouldInsertTemplate}
                    onInserted={handleTemplateInserted}
                />
                <OutputPlugin onContentChange={(content) => {
                    setEditorContent(content);
                    onContentChange?.(content);
                }} />
                <HistoryPlugin />
                <AutoFocusPlugin />
            </LexicalComposer>

            {/* Output Section */}
            <div className="p-4 bg-gray-50 border-t">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">Live Output:</h4>
                    <Button onClick={getFormattedContent} size="sm" variant="outline">
                        Show Content
                    </Button>
                </div>
                <div className="bg-white p-3 rounded border text-sm font-mono">
                    {editorContent || 'Type something in the editor...'}
                </div>
            </div>
        </div>
    );
}