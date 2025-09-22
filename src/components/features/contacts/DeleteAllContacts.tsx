import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { useContacts } from "@/hooks/useContacts"

const DeleteAllContacts = () => {
    const { deleteAllMutation } = useContacts()

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className="inline-flex items-center hover:cursor-pointer">
                    <Trash2 /> Hapus Semua
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Hapus Semua Kontak</DialogTitle>
                <DialogDescription>
                    Apakah kamu yakin ingin menghapus semua kontak?
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
                            onClick={() => deleteAllMutation.mutate()}
                        >
                            Hapus Semua
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteAllContacts