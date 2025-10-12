import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTemplates } from '@/hooks/useTemplates';
import { parseWhatsappMarkdown } from '@/lib/utils';
import Lexical from './Lexical';

export default function TemplateEditor() {
    const [currentContent, setCurrentContent] = useState('');
    const { addTemplateMutation } = useTemplates();

    const saveTemplate = () => {
        addTemplateMutation.mutate({ content: parseWhatsappMarkdown(currentContent) });
    }

    return (
        <div className="mt-10">
            <Card>
                <CardHeader>
                    <CardTitle>Template Editor</CardTitle>
                </CardHeader>
                <CardContent>
                    <Lexical onContentChange={setCurrentContent} />
                    <p className="text-xs text-muted-foreground italic mt-2">
                        Gunakan {"{{nama_variabel}}"} untuk memasukkan variabel ke dalam template.
                    </p>
                    <div className="flex gap-2 mt-6">
                        <Button
                            onClick={saveTemplate}
                            disabled={addTemplateMutation.isPending}
                            className='w-full sm:w-auto'
                        >
                            {addTemplateMutation.isPending ? "Menyimpan..." : "Save Template"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}