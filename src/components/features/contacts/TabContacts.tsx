"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/FileUpload";
import Search from "@/components/ui/Search";
import { useContacts } from "@/hooks/useContacts";
import { parseContacts } from "@/lib/utils";
import { session } from "../../../../auth-schema";

import CardContact from "./CardContact";
import ContactLoading from "./ContactLoading";
import DeleteAllContacts from "./DeleteAllContacts";
import TableInfo from '../templates/TableInfo';


const CONTACT_PLACEHOLDER = `Pisahkan kontak dengan enter, contoh:
Bapak Sodikin (089234293935)
Keluarga Pak Doni (+62834293935)
Dear Bestie, Mbak Siti (089234293935)
dst..`;

const TabContacts = () => {

    if (!session) {
        window.location.href = "/login";
    }

    const contactAreaRef = useRef<HTMLTextAreaElement>(null);
    const { contactsQuery, addMutation, deleteMutation, updateMutation } = useContacts();

    const [search, setSearch] = useState<string>("")

    const handleAddContacts = () => {
        const value = contactAreaRef.current?.value ?? "";
        if (!value.trim()) return;

        const parsed = parseContacts(value);
        if (parsed.length === 0) return;

        addMutation.mutate(parsed);
        if (contactAreaRef.current) {
            contactAreaRef.current.value = "";
        }
    };

    // filter contacts by search
    const filteredContacts =
        contactsQuery.data?.filter((c) => {
            const keyword = search.toLowerCase();
            return (
                c.name.toLowerCase().includes(keyword) ||
                c.phone?.toLowerCase().includes(keyword)
            );
        }) ?? [];

    return (
        <>
            {/* Add Contacts */}
            <div className="mt-4 rounded-2xl border p-6">
                <h4 className="font-medium">Tambah Daftar Tamu</h4>

                <p className="mt-4 text-sm text-muted-foreground">
                    Input Batch &gt; <span className="font-medium">Nama (Telepon)</span>
                </p>

                <textarea
                    ref={contactAreaRef}
                    id="contacts-list"
                    className="mt-2 min-h-[160px] w-full resize-y rounded-md border bg-white p-4"
                    placeholder={CONTACT_PLACEHOLDER}
                    disabled={addMutation.isPending}
                />

                <p className="mb-4 text-xs text-muted-foreground">
                    Masukkan nama dan nomor telepon, pisahkan dengan tanda kurung untuk
                    memasukkan nomor, dan enter untuk menambah tamu baru.
                </p>

                <div className="mt-2 flex items-stretch gap-x-2">
                    <Button
                        onClick={handleAddContacts}
                        disabled={addMutation.isPending}
                    >
                        {addMutation.isPending ? "Menyimpan..." : "Tambahkan Tamu"}
                    </Button>

                    <FileUpload textareaRef={contactAreaRef} disabled={addMutation.isPending} />
                    <TableInfo />
                </div>
            </div>

            {/* Contact List */}
            <div className="mt-6 rounded-2xl border p-6">
                <div className="flex items-center justify-between gap-x-4">
                    <Search
                        className="max-sm:flex-1 sm:max-w-sm"
                        placeholder="Search contacts by name or phone"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <DeleteAllContacts />
                </div>

                {contactsQuery.isPending ? (
                    <ContactLoading />
                ) : contactsQuery.data && contactsQuery.data.length > 0 ? (
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredContacts.map((contact) => (
                            <CardContact
                                key={contact.id}
                                contact={contact}
                                onDelete={() => deleteMutation.mutate(contact.id)}
                                onSave={(id, data) => updateMutation.mutate({ id, data })}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="mt-6 rounded-md border-2 border-dashed border-red-200 bg-red-50 py-8 text-center text-muted-foreground col-span-3">
                        <p className="text-lg font-medium">Belum ada kontak</p>
                        <p className="mt-1 text-sm">Tambahkan kontak pertama Anda!</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default TabContacts;
