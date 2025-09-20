"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import FileUpload from "@/components/ui/FileUpload"
import Search from "@/components/ui/Search"
import CardContact from "./CardContact"
import { contacts } from "@/lib/contacts"

const TabContacts = () => {
    const contactAreaRef = useRef<HTMLTextAreaElement>(null)
    const contactPlaceholder = `Pisahkan kontak dengan enter, contoh:\nBapak Sodikin (089234293935)\nKeluarga Pak Doni (+62834293935)\nDear Bestie, Mbak Siti (089234293935)\ndst..`

    return (
        <>
            <div className="p-6 border rounded-2xl mt-6">
                <h4 className="font-medium">Tambah Kontak</h4>
                <p className="mt-4 text-sm text-muted-foreground">Input Batch &gt; <span className="font-medium">Nama (Telepon)</span></p>
                <textarea
                    ref={contactAreaRef}
                    name="contacts-list"
                    id="contacts-list"
                    className="p-4 bg-white w-full border mt-2 rounded-md resize-y min-h-[160px]"
                    placeholder={contactPlaceholder}
                />
                <p className="text-[12px] text-muted-foreground mb-4">Masukkan nama dan nomor telepon, pisahkan dengan tanda kurung untuk memasukan nomor, dan enter untuk menambah tamu baru.</p>
                <div className="flex mt-2 gap-x-2 items-stretch">
                    <Button className="hover:cursor-pointer">Tambahkan Kontak Batch</Button>
                    <FileUpload />
                </div>
            </div>
            <div className="p-6 border rounded-2xl mt-6">
                <Search className="max-w-3xs" placeholder="Search contacts" />
                <div className="grid grid-cols-3 gap-6 mt-6">
                    {contacts.map((c) => (
                        <CardContact key={c.id} contact={c} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default TabContacts