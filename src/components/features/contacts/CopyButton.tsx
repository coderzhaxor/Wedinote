import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { SquarePen } from "lucide-react"

export default function EditButton({
    initialName,
    initialPhone,
    onSave,
}: {
    initialName: string
    initialPhone: string
    onSave: (data: { name: string; phone: string }) => void
}) {
    const [name, setName] = useState(initialName)
    const [phone, setPhone] = useState(initialPhone)

    const handleSave = () => {
        onSave({ name, phone })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="hover:cursor-pointer w-full">
                    <SquarePen />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Kontak</DialogTitle>
                    <DialogDescription>Ubah informasi kontak</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="name">Nama Kontak</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Masukkan nama kontak"
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="phone">Nomor HP</Label>
                        <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Masukkan nomor HP"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <DialogClose asChild>
                        <Button variant="outline">Batal</Button>
                    </DialogClose>
                    <Button onClick={handleSave}>Simpan</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}