import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Lexical from './Lexical';

export default function TemplateEditor() {
    const [currentContent, setCurrentContent] = useState('');

    const handleSave = () => {
        console.log('Saved content:', currentContent);
        alert('Template saved!');
    };

    return (
        <div className="space-y-6 mt-10">
            <Card>
                <CardHeader>
                    <CardTitle>Template Editor</CardTitle>
                </CardHeader>
                <CardContent>
                    <Lexical onContentChange={setCurrentContent} />
                    <p className="text-xs text-muted-foreground italic mt-2">Gunakan {"{{nama_variabel}}"} untuk memasukkan variabel ke dalam template.</p>
                    <div className="flex gap-2 mt-6">
                        <Button onClick={handleSave}>Save Template</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}