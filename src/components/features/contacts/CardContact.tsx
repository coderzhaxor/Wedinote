import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import EditButton from "./CopyButton"

interface CardContactProps {
    name: string
    phone: string
}

const CardContact = ({ contact }: { contact: CardContactProps }) => {
    return (
        <div className="card-contact border rounded-2xl overflow-hidden flex flex-col bg-white">
            {/* Header */}
            <div className="card-contact-name px-4 pt-2">
                <div className="font-semibold max-w-full truncate">{contact.name}</div>
            </div>

            {/* Nomor HP */}
            <p className="text-sm text-muted-foreground px-4 pb-2 flex-1 flex items-center">08123456789</p>

            {/* Footer */}
            <div className="card-footer py-2 px-2 border-t bg-gray-50">
                <div className="flex items-center gap-2 *:flex-1">
                    <EditButton
                        initialName={contact.name}
                        initialPhone={contact.phone ?? ""}
                        onSave={(data) => console.log("Updated:", data)}
                    />
                    <Button
                        className="inline-flex items-center hover:cursor-pointer">
                        <Trash2 /> Hapus
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CardContact