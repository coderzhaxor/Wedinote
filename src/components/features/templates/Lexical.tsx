/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical';
import { useEffect, useState } from 'react';
import parse from 'html-react-parser';

import ToolbarPlugin from './ToolbarPlugin';
import TemplateInsertPlugin from './TemplateInsertPlugin';
import { parseToDatabase, parseWhatsappMarkdown, unParse } from '@/lib/utils';
import { useTemplates } from '@/hooks/useTemplates';

function onError(error: Error) {
    console.error(error);
}

interface LexicalProps {
    onContentChange?: (content: string) => void;
}

// Plugin untuk load initial content dari database
function InitialContentPlugin({ initialContent }: { initialContent: string }) {
    const [editor] = useLexicalComposerContext();
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        // Hanya load sekali saat mount, dan hanya jika ada content
        if (!hasLoaded && initialContent) {
            editor.update(() => {
                const root = $getRoot();
                root.clear(); // Bersihkan dulu

                // Parse content line by line dan insert ke editor
                const lines = initialContent.split('\n');
                lines.forEach((line) => {
                    const paragraph = $createParagraphNode();
                    paragraph.append($createTextNode(line));
                    root.append(paragraph);
                });
            });
            setHasLoaded(true);
        }
    }, [editor, initialContent, hasLoaded]);

    return null;
}

export default function Lexical({ onContentChange }: LexicalProps) {
    const [editorContent, setEditorContent] = useState('');
    const [initialContent, setInitialContent] = useState('');
    const [shouldInsertTemplate, setShouldInsertTemplate] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const { templateQuery } = useTemplates();

    // Load initial content dari database saat pertama kali
    useEffect(() => {
        if (templateQuery.isSuccess && templateQuery.data && templateQuery.data.length > 0) {
            const dbContent = templateQuery.data[0].content ?? '';
            // Set initial content untuk plugin (hanya sekali)
            setInitialContent(unParse(dbContent));
            // Set preview content
            setEditorContent(dbContent);
        }
    }, [templateQuery.isSuccess, templateQuery.data]);

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

    const Wrapper = ({ children, className }: { children: React.ReactNode, className?: string }) =>
        <div className={className}>{children}</div>;

    return (
        <div className="border rounded-md">
            <LexicalComposer initialConfig={initialConfig}>
                <ToolbarPlugin onPreview={handlePreview} isPreview={isPreview} onInsertTemplate={handleInsertTemplate} />
                {isPreview ? (
                    <Wrapper className='min-h-[200px] w-full p-4 bg-gray-50 border-none leading-relaxed select-all'>
                        {parse(parseWhatsappMarkdown(editorContent.toString()))}
                        {/* {editorContent.split("</n>").map((line, i) => (
                            <div key={`preview-line-${i}`}>
                                {parseWhatsappMarkdown(line)}
                            </div>
                        ))} */}
                    </Wrapper>
                ) : (
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="min-h-[200px] p-4 outline-none" />
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                )}

                {/* Plugin untuk load initial content dari database */}
                <InitialContentPlugin initialContent={initialContent} />

                <OnChangePlugin
                    onChange={(editorState) => {
                        editorState.read(() => {
                            const root = $getRoot();
                            const textContent = root.getTextContent();
                            console.log(parseToDatabase(textContent))
                            setEditorContent(textContent);
                            onContentChange?.(textContent);
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