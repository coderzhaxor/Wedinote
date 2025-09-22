"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { addContacts, deleteContact, getContacts } from "@/actions/contacts";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/FileUpload";
import Search from "@/components/ui/Search";
import { parseContacts } from "@/lib/utils";

import CardContact from "./CardContact";
import ContactLoading from "./ContactLoading";

interface ContactProps {
    id: number;
    name: string;
    phone: string | null;
}

const CONTACT_PLACEHOLDER = `Pisahkan kontak dengan enter, contoh:
Bapak Sodikin (089234293935)
Keluarga Pak Doni (+62834293935)
Dear Bestie, Mbak Siti (089234293935)
dst..`;

const TabContacts = () => {
    const contactAreaRef = useRef<HTMLTextAreaElement>(null);
    const [contacts, setContacts] = useState<ContactProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const fetchInitialContacts = async () => {
            try {
                const initialContacts = await getContacts();
                setContacts(initialContacts);
            } catch (error) {
                console.error("Failed to fetch contacts:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialContacts();
    }, []);

    const handleAddContacts = () => {
        startTransition(async () => {
            const value = contactAreaRef.current?.value ?? "";
            if (!value.trim()) return;

            try {
                const parsed = parseContacts(value);
                const savedContacts = await addContacts(parsed);

                setContacts(savedContacts);

                // Clear textarea
                if (contactAreaRef.current) {
                    contactAreaRef.current.value = "";
                }
            } catch (error) {
                console.error("Failed to add contacts:", error);
                // TODO: Add toast notification for error
            }
        });
    };

    const handleDelete = async (contactId: number) => {
        await deleteContact(contactId)
        setContacts((prev) => prev.filter((c) => c.id !== contactId))
    }

    const showLoading = isLoading || isPending;

    return (
        <>
            {/* Add Contacts Section */}
            <div className="p-6 border rounded-2xl mt-4">
                <h4 className="font-medium">Tambah Daftar Tamu</h4>

                <p className="mt-4 text-sm text-muted-foreground">
                    Input Batch &gt; <span className="font-medium">Nama (Telepon)</span>
                </p>

                <textarea
                    ref={contactAreaRef}
                    name="contacts-list"
                    id="contacts-list"
                    className="p-4 bg-white w-full border mt-2 rounded-md resize-y min-h-[160px]"
                    placeholder={CONTACT_PLACEHOLDER}
                    disabled={isPending}
                />

                <p className="text-xs text-muted-foreground mb-4">
                    Masukkan nama dan nomor telepon, pisahkan dengan tanda kurung untuk
                    memasukan nomor, dan enter untuk menambah tamu baru.
                </p>

                <div className="flex mt-2 gap-x-2 items-stretch">
                    <Button onClick={handleAddContacts} disabled={isPending}>
                        {isPending ? "Menyimpan..." : "Tambahkan Daftar Tamu"}
                    </Button>
                    <FileUpload textareaRef={contactAreaRef} disabled={isPending} />
                </div>
            </div>

            {/* Contacts List Section */}
            <div className="p-6 border rounded-2xl mt-6">
                <Search className="max-w-3xs" placeholder="Search contacts" />

                {showLoading ? (
                    <ContactLoading />
                ) : (
                    <div className="grid grid-cols-3 gap-6 mt-6">
                        {contacts.length > 0 ? (
                            contacts.map((contact) => (
                                <CardContact
                                    key={contact.id}
                                    contact={contact}
                                    onDelete={handleDelete}
                                />
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-8 text-muted-foreground border-2 border-dashed border-red-200 bg-red-50 rounded-md">
                                <p className="text-lg font-medium">Belum ada kontak</p>
                                <p className="text-sm mt-1">Tambahkan kontak pertama Anda!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default TabContacts;