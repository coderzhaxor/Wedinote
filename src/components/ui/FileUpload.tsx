'use client'

import { useRef, type RefObject } from 'react'
import { Button } from './button'
import { CloudUpload } from 'lucide-react'
import { contactsToString, parseCsvContacts } from '@/lib/utils'


interface FileUploadProps {
    textareaRef: RefObject<HTMLTextAreaElement | null>
    disabled?: boolean
}

const FileUpload = ({ textareaRef, disabled }: FileUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const uploadFile = () => fileInputRef.current?.click()

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const result = await parseCsvContacts(file);
        if (textareaRef.current) {
            textareaRef.current.value = `${textareaRef.current.value}\n${contactsToString(result)}`;
        }

        // Reset input value so file can be re-selected if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    return (
        <div>
            <input
                ref={fileInputRef}
                type="file"
                name="file-contacts"
                id="file-contacts"
                accept='.csv'
                className="hidden"
                onChange={handleFileUpload}
            />
            <Button
                variant="outline"
                onClick={uploadFile}
                className='flex items-center cursor-pointer'
                title='Upload file csv'
                disabled={disabled}
            >
                <CloudUpload className="size-4" />
                Upload File  (CSV)
            </Button>
        </div>
    )
}

export default FileUpload