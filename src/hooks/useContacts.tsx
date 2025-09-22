import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addContacts, deleteAllContacts, deleteContact, getContacts, updateContact } from "@/actions/contacts";
import { toast } from "sonner";

/**
 * Minimal Contact type used on client
 */
export type Contact = {
    id: number;
    name: string;
    phone?: string | null;
};

/**
 * Input type for adding new contacts (without id, createdAt, userId)
 */
export type ContactInput = {
    name: string;
    phone?: string | null;
};

export function useContacts() {
    const queryClient = useQueryClient();

    // Fetch semua kontak
    const contactsQuery = useQuery<Contact[], Error>({
        queryKey: ["contacts"],
        queryFn: () => getContacts(),
    });

    // Add (expects parsed ContactInput[] as variables)
    const addMutation = useMutation<
        { inserted: Contact[]; all: Contact[] }, // TData (what server returns)
        Error, // TError
        ContactInput[] // TVariables (we send input contacts without id/createdAt/userId)
    >({
        mutationFn: (contactsToAdd) => addContacts(contactsToAdd),
        onSuccess: (data, variables) => {
            const { inserted, all } = data;
            queryClient.setQueryData(["contacts"], all);

            const inputCount = variables.length;
            const addedCount = inserted.length;
            const skipped = inputCount - addedCount;

            if (addedCount === 0) {
                toast.warning("Semua kontak duplikat, tidak ada yang ditambahkan");
            } else if (skipped > 0) {
                toast.success(`Berhasil menambahkan ${addedCount} kontak, ${skipped} duplikat dilewati`);
            } else {
                toast.success(`Berhasil menambahkan ${addedCount} kontak`);
            }
        },
        onError: () => toast.error("Gagal menambahkan kontak"),
    });

    // Delete (server returns all contacts after delete)
    const deleteMutation = useMutation<Contact[], Error, number>({
        mutationFn: (id) => deleteContact(id),
        onSuccess: (all) => {
            queryClient.setQueryData(["contacts"], all);
            toast.success("Contact deleted successfully");
        },
        onError: () => toast.error("Failed to delete contact"),
    });

    // Delete all contacts
    const deleteAllMutation = useMutation<Contact[], Error>({
        mutationFn: () => deleteAllContacts(),
        onSuccess: (all) => {
            queryClient.setQueryData(["contacts"], all);
            toast.success("All contacts has been deleted");
        },
        onError: () => toast.error("Failed to delete all contacts")
    });

    // Update (server returns all contacts after update)
    const updateMutation = useMutation<Contact[], Error, { id: number; data: ContactInput }>({
        mutationFn: ({ id, data }) => updateContact(id, data),
        onSuccess: (all) => {
            queryClient.setQueryData(["contacts"], all);
            toast.success("Contact updated successfully");
        },
        onError: () => toast.error("Failed to update contact"),
    });

    return {
        contactsQuery,
        addMutation,
        deleteMutation,
        deleteAllMutation,
        updateMutation,
    };
}
