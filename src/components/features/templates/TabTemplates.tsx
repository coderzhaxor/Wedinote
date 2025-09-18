"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { Trash2Icon } from "lucide-react"
import { useState, useRef } from "react"
import { Undo2, Redo2, Bold, Italic, Underline, Strikethrough, Eraser, Eye, Edit } from "lucide-react"
import Vr from "@/components/Vr"
import LexicalMarkdownEditor from "@/components/LexicalMarkdownEditor"
import Lexical from "./Lexical"
import { RichTextEditor } from "@/components/RichTextEditor"

interface VariableProps {
    id: string
    key: string
    value: string
    saved: boolean
}


const TabTemplates = () => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isPreview, setIsPreview] = useState<boolean>(false)
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

    const handleInput = () => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = "auto"; // reset dulu
            el.style.height = `${el.scrollHeight}px`; // sesuaikan tinggi
        }
    };

    const handleBold = () => {
        const el = textareaRef.current;
        if (!el) return;

        const start = el.selectionStart;
        const end = el.selectionEnd;
        const value = el.value;

        if (start === end) {
            // Tidak ada teks terpilih → sisipkan **** dan taruh caret di tengah
            const newText = value.substring(0, start) + "****" + value.substring(end);
            el.value = newText;

            // caret di tengah
            el.setSelectionRange(start + 2, start + 2);
        } else {
            // Ada teks terpilih → bungkus dengan **
            const selectedText = value.substring(start, end);
            const newText = value.substring(0, start) +
                `**${selectedText}**` +
                value.substring(end);
            el.value = newText;

            // caret setelah teks yang dibungkus
            const cursorPos = start + selectedText.length + 4;
            el.setSelectionRange(cursorPos, cursorPos);
        }

        el.dispatchEvent(new Event("input", { bubbles: true }));
    }

    return (
        <>
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
            </div>
            <div className="p-6 border rounded-2xl flex flex-col gap-2 mt-6">
                <h4 className="font-medium">Editor Template</h4>
                {/* <RichTextEditor variables={["jumlah", "store"]} /> */}
                <div className="border rounded-md">
                    <div className="toolbar p-1 flex items-center justify-between border-b">
                        <div className="flex flex-wrap items-center gap-1">
                            <Button size="icon" variant="outline"><Undo2 className="size-4" /></Button>
                            <Button size="icon" variant="outline"><Redo2 className="size-4" /></Button>
                            <Vr />
                            <Button onClick={handleBold} size="icon" variant="outline"><Bold className="size-4" /></Button>
                            <Button size="icon" variant="outline"><Italic className="size-4" /></Button>
                            <Button size="icon" variant="outline"><Underline className="size-4" /></Button>
                            <Button size="icon" variant="outline"><Strikethrough className="size-4" /></Button>
                            <Vr />
                            <Button size="icon" variant="outline"><Eraser className="size-4" /></Button>
                        </div>
                        {isPreview ? (
                            <Button
                                onClick={() => setIsPreview(prev => !prev)}
                                variant="outline"
                                className="hover:cursor-pointer">
                                Edit <Edit />
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setIsPreview(prev => !prev)}
                                variant="outline"
                                className="hover:cursor-pointer">
                                Preview <Eye />
                            </Button>

                        )}
                    </div>
                    {isPreview && (
                        <>
                            <div>sedang di preview</div>
                            <Lexical />
                        </>
                    )}
                    <textarea
                        ref={textareaRef}
                        onInput={handleInput}
                        className="px-6 bg-white w-full py-5 outline-none resize-y min-h-[200px]"
                    />
                    <div className="template-foote bg-gray-50 r p-1 gap-1 flex items-start flex-wrap border-t">
                        <Button variant="outline">nama_tamu</Button>
                        <Button variant="outline">tanggal</Button>
                        <Button variant="outline">alamat</Button>
                        <Button variant="outline">nama_tamu</Button>
                        <Button variant="outline">tanggal</Button>
                        <Button variant="outline">alamat</Button>
                        <Button variant="outline">nama_tamu</Button>
                        <Button variant="outline">tanggal</Button>
                        <Button variant="outline">alamat</Button>
                        <Button variant="outline">nama_tamu</Button>
                        <Button variant="outline">tanggal</Button>
                        <Button variant="outline">alamat</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TabTemplates