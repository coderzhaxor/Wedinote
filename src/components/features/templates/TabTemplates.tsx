"use client"

import { PlusIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useTemplates } from "@/hooks/useTemplates"
import { cn } from "@/lib/utils"
import { session } from "../../../../auth-schema"
import InputVariable from "./InputVariable"
import TemplateEditor from "./TemplateEditor"

interface VariableProps {
    id: string
    key: string
    value: string
}

const defaultVariables: VariableProps[] = [
    { id: crypto.randomUUID(), key: "tgl", value: "" },
    { id: crypto.randomUUID(), key: "link_undangan", value: "" },
    { id: crypto.randomUUID(), key: "nama_cpw", value: "" },
    { id: crypto.randomUUID(), key: "nama_cpp", value: "" },
    { id: crypto.randomUUID(), key: "waktu", value: "" },
    { id: crypto.randomUUID(), key: "tempat", value: "" },
]

const TabTemplates = () => {

    const { variablesQuery, addVariableMutation } = useTemplates()

    if (!session) {
        window.location.href = "/login";
    }

    const [variables, setVariables] = useState<VariableProps[]>([])

    useEffect(() => {
        if (variablesQuery.isSuccess) {
            if (variablesQuery.data && variablesQuery.data.length > 0) {
                setVariables(
                    variablesQuery.data.map((v) => ({
                        id: v.id ?? crypto.randomUUID(),
                        key: v.key ?? "",
                        value: v.value ?? ""
                    }))
                )
            } else {
                setVariables(defaultVariables)
            }
        }
    }, [variablesQuery.isSuccess, variablesQuery.data])

    const hasEmptyVariable = variables.some(
        (v) => v.key.trim() === "" || v.value.trim() === ""
    )

    const changeValue = (id: string, value: string) => {
        setVariables((prev) =>
            prev.map((variable) =>
                variable.id === id ? { ...variable, value } : variable
            )
        );
    }

    const changeKey = (id: string, key: string) => {
        setVariables((prev) =>
            prev.map((variable) =>
                variable.id === id ? { ...variable, key } : variable
            )
        )
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
            }
        ])
    }

    const saveVariables = () => {
        if (hasEmptyVariable) return toast.error("Isi semua variabel terlebih dahulu")
        addVariableMutation.mutate(variables)
    }

    return (
        <div className="p-6 border rounded-2xl flex flex-col gap-2">
            <h4 className="font-medium">Variabel Template</h4>
            <p className="text-sm text-muted-foreground mb-3">Masukan variabel yang akan dimuat dalam template</p>
            <InputVariable
                variable={{ id: "9999999", key: "nama_tamu", value: "(Auto)" }}
                changeKey={changeKey}
                changeValue={changeValue}
                handleDelete={handleDelete}
                disabled={true}
            />
            {variables.map((row: VariableProps) => (
                <InputVariable
                    key={row.id}
                    variable={row}
                    changeKey={changeKey}
                    changeValue={changeValue}
                    handleDelete={handleDelete}
                />
            ))}
            <div className="flex items-center">
                {/* biome-ignore lint/a11y/useButtonType: false positive */}
                <button
                    className="flex flex-1 items-center justify-center gap-x-3 border border-dashed rounded-sm py-2 cursor-pointer text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-150 ease-in-out"
                    onClick={addVariables}
                >
                    <PlusIcon size={16} />
                    Tambahkan Variabel
                </button>
                {/* biome-ignore lint/a11y/useButtonType: false positive */}
                <button
                    onClick={saveVariables}
                    disabled={addVariableMutation.isPending}
                    className={cn(
                        "bg-primary text-primary-foreground px-4 py-2 rounded-sm ml-3 hover:bg-primary/90 hover:cursor-pointer transition-colors duration-150 ease-in-out disabled:opacity-50",
                        hasEmptyVariable && "opacity-50 hover:cursor-not-allowed"
                    )}
                >
                    {addVariableMutation.isPending ? "Menyimpan..." : "Simpan Variable"}
                </button>
            </div>

            <TemplateEditor />
        </div>
    )
}

export default TabTemplates