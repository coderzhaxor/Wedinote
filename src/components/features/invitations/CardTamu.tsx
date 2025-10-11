import parse from 'html-react-parser'
import { CircleCheck, CirclePlus, EyeIcon } from 'lucide-react'
import mustache from "mustache"
import { useMemo } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useInvitations } from '@/hooks/useInvitations'
import { cn, unParse } from '@/lib/utils'
import type { Contact } from '@/types/invitation'
import CopyButton from './CopyButton'
import { ShareButton } from './ShareButton'

type VariantProps = "grid" | "list"
type CardTamuProps = {
    contact: Contact;
    variant: VariantProps;
    message: string;
    variables: { key: string; value: string | null }[];
}

// Custom Hook untuk Memisahkan Logika Parsing
const useParsedMessage = (
    message: string,
    variables: { key: string; value: string | null }[],
    contactName: string
) => {
    return useMemo(() => {
        const variablesObject = Object.fromEntries(variables.map(v => [v.key, v.value]));
        variablesObject.nama_tamu = contactName;
        const parsed = mustache.render(message, variablesObject);
        return parsed.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    }, [message, variables, contactName]);
};

// Dialog Message (dari template)
const MessageDialogContent = ({ contactName, parsedMessage, contactId }: {
    contactName: string;
    parsedMessage: string;
    contactId: number;
}) => (
    <DialogContent className="sm:max-lg">
        <DialogHeader>
            <DialogTitle>Template pesan untuk {contactName}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[250px] p-2 bg-gray-50 rounded-md">
            <div className="text-sm select-all">
                {parsedMessage.split("\n").map((line, index) => (
                    <div key={`${contactId}-line-${index}`}>{parse(line)}</div>
                ))}
            </div>
            <ScrollBar orientation="vertical" />
        </ScrollArea>
        <CopyButton
            id={contactId}
            variant="grid"
            buttonVariant='default'
            className='w-full py-5 rounded-sm'
            message={unParse(parsedMessage)}
        />
    </DialogContent>
);

// Informasi Kontak
const ContactInfo = ({ contact }: { contact: Contact }) => (
    <div className="contact-info">
        <div className="contact-name">{contact.name}</div>
        {contact.phone && (
            <p className="contact-phone text-sm text-muted-foreground">
                {contact.phone}
            </p>
        )}
    </div>
);

// Button change status undangan
const InvitationStatusButton = ({ contact, updateInviteMutation }: {
    contact: Contact;
    updateInviteMutation: ReturnType<typeof useInvitations>['updateInviteMutation'];
}) => (
    <button
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
            e.stopPropagation()
            updateInviteMutation.mutate({ id: Number(contact.id) })
        }}
        disabled={updateInviteMutation.isPending}
        className={cn(
            "contact-status text-sm font-medium transition hover:cursor-pointer rounded-full p-2",
            contact.isInvited ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
            updateInviteMutation.isPending && "opacity-60 cursor-not-allowed"
        )}
    >
        {updateInviteMutation.isPending ? "..." : (
            <>
                <span className="hidden sm:inline-flex text-sm px-2 items-center h-4">
                    {contact.isInvited ? '✓ Diundang' : '⏳ Belum'}
                </span>
                <span className="sm:hidden">
                    {contact.isInvited ? <CircleCheck size={16} /> : <CirclePlus className='rotate-45' size={16} />}
                </span>
            </>
        )}
    </button>
);

// Action group button (copy message, dan share ke WA)
const ActionButtons = ({ contact, message, onClick }: {
    contact: Contact;
    message: string;
    onClick: (e: React.MouseEvent) => void;
}) => (
    <div onClick={onClick} className="flex items-center gap-2">
        <CopyButton id={Number(contact.id)} variant="list" message={message} />
        <ShareButton variant="icon" phone={contact.phone ?? ""} message={message} />
    </div>
);


// Main component
const CardTamu = ({ contact, variant, message, variables }: CardTamuProps) => {
    const { updateInviteMutation } = useInvitations();
    const parsedMessage = useParsedMessage(message, variables, contact.name);

    // Fungsi untuk mencegah dialog terbuka saat tombol aksi diklik
    const handleActionClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    // Render untuk variant 'list'
    if (variant === "list") {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Card className="gap-4 cursor-pointer hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-center w-full">
                                <ContactInfo contact={contact} />
                                <div className="flex items-center gap-2">
                                    <InvitationStatusButton
                                        contact={contact}
                                        updateInviteMutation={updateInviteMutation}
                                    />
                                    <ActionButtons
                                        contact={contact}
                                        message={message}
                                        onClick={handleActionClick}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                </DialogTrigger>
                <MessageDialogContent
                    contactName={contact.name}
                    parsedMessage={parsedMessage}
                    contactId={Number(contact.id)}
                />
            </Dialog>
        );
    }

    // Render untuk variant 'grid'
    return (
        <Card className="gap-4">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <ContactInfo contact={contact} />
                    <InvitationStatusButton
                        contact={contact}
                        updateInviteMutation={updateInviteMutation}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="flex items-center justify-between border rounded-lg p-3 hover:cursor-pointer">
                            Lihat Pesan
                            <EyeIcon className="h-4 w-4" />
                        </div>
                    </DialogTrigger>
                    <MessageDialogContent
                        contactName={contact.name}
                        parsedMessage={parsedMessage}
                        contactId={Number(contact.id)}
                    />
                </Dialog>
            </CardContent>
            <CardFooter className="flex gap-x-2 *:flex-1">
                <CopyButton id={Number(contact.id)} message={message} variant={variant} />
                <ShareButton phone={contact.phone ?? ''} message={unParse(parsedMessage)} />
            </CardFooter>
        </Card>
    );
};

export default CardTamu;