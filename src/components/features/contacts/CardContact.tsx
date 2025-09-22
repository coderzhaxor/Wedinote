import EditButton from "./EditButton"
import type { Contact } from "@/hooks/useContacts";
import DeleteContact from "./DeleteContact";

interface CardContactComponentProps {
    contact: Contact;
    onDelete?: (id: number) => void;
    onSave?: (id: number, data: { name: string; phone?: string | null }) => void;
}

const CardContact = ({ contact, onDelete, onSave }: CardContactComponentProps) => {


    return (
        <div className="card-contact border rounded-2xl overflow-hidden flex flex-col bg-white">
            {/* Header */}
            <div className="card-contact-name px-4 pt-2">
                <div className="font-semibold max-w-full truncate">{contact.name}</div>
            </div>

            {/* Nomor HP */}
            <p className="text-sm text-muted-foreground px-4 pb-2 flex-1 flex items-center">{contact.phone}</p>

            {/* Footer */}
            <div className="card-footer py-2 px-2 border-t bg-gray-50">
                <div className="flex items-center gap-2 *:flex-1">
                    <EditButton
                        contact={contact}
                        onSave={(data) => onSave?.(contact.id, data)}
                    />
                    <DeleteContact
                        contact={contact}
                        onDelete={onDelete}
                    />
                </div>
            </div>
        </div>
    )
}

export default CardContact