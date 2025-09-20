'use client'

import { useRef } from 'react'
import { Button } from './button'
import { CloudUpload } from 'lucide-react'
import { useState } from 'react'
import Papa from "papaparse"

interface RowData {
    [key: string]: string
}

interface PapaParseResult<T> {
    data: T[];
    errors: Papa.ParseError[];
    meta: Papa.ParseMeta;
}

interface PapaParseConfig<T> {
    header?: boolean;
    skipEmptyLines?: boolean;
    complete: (result: PapaParseResult<T>) => void;
}

const FileUpload = () => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const uploadFile = () => fileInputRef.current?.click()
    const [data, setData] = useState<RowData[]>([])

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        Papa.parse<RowData>(file, {
            header: true, // ambil row pertama sebagai header
            skipEmptyLines: true,
            complete: (result: PapaParseResult<RowData>) => {
                setData(result.data)
            },
        } as PapaParseConfig<RowData>)
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
            >
                <CloudUpload className="size-4" />
                Upload File  (CSV)
            </Button>
        </div>
    )
}

export default FileUpload