import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Lexical from './Lexical';
import { useTemplates } from '@/hooks/useTemplates';

export default function TemplateEditor() {
    const [currentContent, setCurrentContent] = useState('');
    const { addTemplateMutation } = useTemplates();

    return (
        <div className="mt-10">
            <Card>
                <CardHeader>
                    <CardTitle>Template Editor</CardTitle>
                </CardHeader>
                <CardContent>
                    <Lexical onContentChange={setCurrentContent} />
                    <p className="text-xs text-muted-foreground italic mt-2">Gunakan {"{{nama_variabel}}"} untuk memasukkan variabel ke dalam template.</p>
                    <div className="flex gap-2 mt-6">
                        <Button onClick={() => addTemplateMutation.mutate({ content: currentContent })}>Save Template</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}