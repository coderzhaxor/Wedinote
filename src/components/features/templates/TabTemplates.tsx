"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { Trash2Icon } from "lucide-react"
import { useState } from "react"
import TemplateEditor from "./TemplateEditor"

interface VariableProps {
    id: string
    key: string
    value: string
    saved: boolean
}

const TabTemplates = () => {
    const [variables, setVariables] = useState<VariableProps[]>([
        { id: crypto.randomUUID(), key: "date", value: "", saved: false },
        { id: crypto.randomUUID(), key: "nama_tamu_undangan", value: "", saved: true },
        { id: crypto.randomUUID(), key: "", value: "", saved: true },
        { id: crypto.randomUUID(), key: "", value: "", saved: true },
    ])

    const changeVariable = (id: string, value: string) => {
        setVariables((prev) =>
            prev.map((variable) =>
                variable.id === id ? { ...variable, value } : variable
            )
        );
    }

    const handleDelete = (id: string) => {
        setVariables(prev => (
            prev.filter((contacts) => contacts.id !== id)
        ))
    }

    const addVariables = () => {
        setVariables(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                key: "",
                value: "",
                saved: false
            }
        ])
    }


    return (
        <div className="p-6 border rounded-2xl flex flex-col gap-2">
            <h4 className="font-medium">Variabel Template</h4>
            <p className="text-sm text-muted-foreground mb-3">Masukan variabel yang akan dimuat dalam template</p>
            {variables.map((row: VariableProps) => (
                <div key={row.id} className="flex gap-x-2">
                    <Input onChange={(e) => changeVariable(row.id, e.target.value)} type="text" placeholder="Key (nama_variable)" value={row.key} className="max-w-72" />
                    <Input onChange={(e) => changeVariable(row.id, e.target.value)} type="text" placeholder="Value" value={row.value} />
                    <Button
                        variant="outline"
                        onClick={() => handleDelete(row.id)}
                        size="icon"
                        className="px-4 hover:cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors duration-150 ease-in-out">
                        <Trash2Icon />
                    </Button>
                </div>
            ))}
            {/* biome-ignore lint/a11y/useButtonType: false positive */}
            <button
                className="w-full flex items-center justify-center gap-x-3 border border-dashed rounded-sm py-2 cursor-pointer text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-150 ease-in-out"
                onClick={addVariables}
            >
                <PlusIcon size={16} />
                Tambahkan Variabel
            </button>
            <TemplateEditor />
        </div>
    )
}

export default TabTemplates