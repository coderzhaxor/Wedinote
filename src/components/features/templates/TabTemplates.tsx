"use client"

import { PlusIcon } from "lucide-react"
import { useState } from "react"
import TemplateEditor from "./TemplateEditor"
import InputVariable from "./InputVariable"

interface VariableProps {
    id: string
    key: string
    value: string
    saved: boolean
}

const TabTemplates = () => {
    const [variables, setVariables] = useState<VariableProps[]>([
        { id: crypto.randomUUID(), key: "tgl", value: "", saved: false },
        { id: crypto.randomUUID(), key: "link_undangan", value: "", saved: true },
        { id: crypto.randomUUID(), key: "nama_cpw", value: "", saved: true },
        { id: crypto.randomUUID(), key: "nama_cpp", value: "", saved: true },
        { id: crypto.randomUUID(), key: "waktu", value: "", saved: true },
        { id: crypto.randomUUID(), key: "tempat", value: "", saved: true },
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
            <InputVariable
                variable={{ id: "9999999", key: "nama_tamu", value: "(Auto)" }}
                changeVariable={changeVariable}
                handleDelete={handleDelete}
                disabled={true}
            />
            {variables.map((row: VariableProps) => (
                <InputVariable
                    key={row.id}
                    variable={row}
                    changeVariable={changeVariable}
                    handleDelete={handleDelete}
                />
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