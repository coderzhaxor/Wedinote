import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import type { Contact } from "@/hooks/useContacts"

interface DeleteContactProps {
    contact: Contact;
    onDelete?: (id: number) => void;
}

const DeleteContact = ({ contact, onDelete }: DeleteContactProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className="inline-flex items-center hover:cursor-pointer">
                    <Trash2 /> Hapus
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Hapus Kontak</DialogTitle>
                <DialogDescription>
                    Apakah kamu yakin ingin menghapus kontak {contact.name}?
                </DialogDescription>
                <DialogFooter className="mt-6">
                    <DialogClose>
                        <Button
                            className="hover:cursor-pointer"
                            variant="outline"
                        >
                            Batalkan
                        </Button>
                    </DialogClose>
                    <DialogClose>
                        <Button
                            className="hover:cursor-pointer"
                            onClick={() => onDelete?.(contact.id)}
                        >
                            Hapus
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteContact