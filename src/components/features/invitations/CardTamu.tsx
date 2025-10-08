/** biome-ignore-all lint/a11y/useButtonType: <explanation> */

import parse from 'html-react-parser'
import { EyeIcon } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn, unParse } from '@/lib/utils'
import type { Contact, TemplateVariable } from '@/types/invitation'
import CopyButton from './CopyButton'
import { ShareButton } from './ShareButton'
import mustache from "mustache"
import { useInvitations } from '@/hooks/useInvitations'


type variantProps = "grid" | "list"

const CardTamu = (
    {
        contact,
        variant,
        message,
        variables
    }
        :
        {
            contact: Contact,
            variant: variantProps,
            message: string
            variables: {
                key: string,
                value: string | null
            }[]
        }
) => {

    const { updateInviteMutation } = useInvitations()

    const variablesObject = Object.fromEntries(variables.map(v => [v.key, v.value]))
    variablesObject.nama_tamu = contact.name
    let parsedMessage = mustache.render(message, variablesObject)
    parsedMessage = parsedMessage.replace(/\*(.*?)\*/g, '<strong>$1</strong>');

    return (
        <Card className="gap-4">
            <CardHeader>
                <div className={cn(
                    "flex justify-between mb-0",
                    variant === "list" ? "items-center" : "items-start"
                )}>
                    <div className="contact-info">
                        <div className="contact-name">{contact.name}</div>
                        {
                            contact.phone && (
                                <p className="contact-phone text-sm text-muted-foreground">
                                    {contact.phone}
                                </p>
                            )
                        }
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => updateInviteMutation.mutate({ id: Number(contact.id) })}
                            disabled={updateInviteMutation.isPending}
                            className={cn(
                                "contact-status text-sm font-medium px-2 py-1 transition hover:cursor-pointer",
                                contact.isInvited ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
                                variant === "list" ? "rounded-md py-2" : "rounded-full",
                                updateInviteMutation.isPending && "opacity-60 cursor-not-allowed"
                            )}
                        >
                            {updateInviteMutation.isPending ? "..." : contact.isInvited ? '✓ Diundang' : '⏳ Belum'}
                        </button>
                        {variant === "list" && (
                            <>
                                <CopyButton
                                    id={Number(contact.id)}
                                    variant="list" message={message}
                                />
                                <ShareButton variant="icon" phone={contact.phone ?? ""} message={message} />
                            </>
                        )}
                    </div>

                </div>
            </CardHeader>
            {variant === "grid" ? (
                <CardContent>
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className="flex items-center justify-between border rounded-lg p-3 hover:cursor-pointer">
                                Lihat Pesan
                                <EyeIcon className="h-4 w-4" />
                            </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-lg">
                            <DialogHeader>
                                <DialogTitle>Template pesan untuk {contact.name}</DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="h-[250px] p-2 bg-gray-50 rounded-md">
                                <div
                                    className="text-sm select-all">
                                    {parsedMessage.split("\n").map((line) => (
                                        <div key={contact.id}>{parse(line)}</div>
                                    ))}
                                </div>
                                <ScrollBar orientation="vertical" />
                            </ScrollArea>
                            <CopyButton
                                id={Number(contact.id)}
                                variant="grid"
                                buttonVariant='default'
                                className='w-full py-5 rounded-sm'
                                message={unParse(parsedMessage)}
                            />
                        </DialogContent>
                    </Dialog>
                </CardContent>
            ) : ''}
            {variant === "grid" ? (
                <CardFooter className="flex gap-x-2 *:flex-1">
                    <CopyButton id={Number(contact.id)} message={message} variant={variant} />
                    <ShareButton phone={contact.phone ?? ''} message={message} />
                </CardFooter>
            ) : ''}
        </Card>
    )
}

export default CardTamu