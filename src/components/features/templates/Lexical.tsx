import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $getRoot } from 'lexical';
import { useEffect, useState } from 'react';
import parse from 'html-react-parser';

import ToolbarPlugin from './ToolbarPlugin';
import TemplateInsertPlugin from './TemplateInsertPlugin';
import { parseToDatabase, parseWhatsappMarkdown } from '@/lib/utils';
import { useTemplates } from '@/hooks/useTemplates';

function onError(error: Error) {
    console.error(error);
}

interface LexicalProps {
    onContentChange?: (content: string) => void;
}

export default function Lexical({ onContentChange }: LexicalProps) {
    const [editorContent, setEditorContent] = useState('');
    const [shouldInsertTemplate, setShouldInsertTemplate] = useState(false);
    const [isPreview, setIsPreview] = useState(false);

    const handleInsertTemplate = () => {
        setShouldInsertTemplate(true);
    };

    const handleTemplateInserted = () => {
        setShouldInsertTemplate(false);
    };

    const handlePreview = () => {
        setIsPreview((prev) => !prev);
    };

    const initialConfig = {
        namespace: 'WhatsApp Template Editor',
        onError,
    };

    const Wrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={className} >{children}</div>;

    return (
        <div className="border rounded-md">


            <LexicalComposer initialConfig={initialConfig}>
                <ToolbarPlugin onPreview={handlePreview} isPreview={isPreview} onInsertTemplate={handleInsertTemplate} />
                {isPreview ? (
                    <Wrapper
                        className='min-h-[200px] w-full p-4 bg-gray-50 border-none leading-relaxed select-all'
                    >
                        {editorContent.split("\n").map((line, i) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            <div key={i}>
                                {parse(parseWhatsappMarkdown(line))}
                            </div>
                        ))}
                    </Wrapper>
                ) : (
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                className="min-h-[200px] p-4 outline-none"
                            />
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                )}

                <OnChangePlugin
                    onChange={(editorState) => {
                        editorState.read(() => {
                            const root = $getRoot();
                            const textContent = root.getTextContent();
                            console.log(parseToDatabase(textContent))
                            setEditorContent(parseWhatsappMarkdown(textContent));
                            onContentChange?.(parseWhatsappMarkdown(textContent));
                        });
                    }}
                />
                <TemplateInsertPlugin
                    shouldInsert={shouldInsertTemplate}
                    onInserted={handleTemplateInserted}
                />

                <HistoryPlugin />
                <AutoFocusPlugin />
            </LexicalComposer>

        </div>
    );
}