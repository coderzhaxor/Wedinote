/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
import { cn, nl2br } from '@/lib/utils'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { ShareButton } from './ShareButton'
import CopyButton from './CopyButton'
import { EyeIcon } from 'lucide-react'

type contactProps = {
    id: string
    name: string
    phone?: string
    status: boolean
    message: string
}

type variantProps = "grid" | "list"

const CardTamu = ({ contact, variant }: { contact: contactProps, variant: variantProps }) => {
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
                            // onClick={toggleStatus}
                            // disabled={isPending}
                            className={cn(
                                "contact-status text-sm font-medium px-2 py-1 transition",
                                contact.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
                                variant === "list" ? "rounded-md py-2" : "rounded-full",
                                // isPending && "opacity-60 cursor-not-allowed"
                            )}
                        >
                            {/* isPending ? "..." :  */}
                            {contact.status ? '✓ Diundang' : '⏳ Belum'}
                        </button>
                        {variant === "list" && (
                            <>
                                <CopyButton variant="list" message={contact.message} />
                                <ShareButton variant="icon" phone={contact.phone ?? ""} message={contact.message} />
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
                                {nl2br(contact.message)}
                                <ScrollBar orientation="vertical" />
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            ) : ''}
            {variant === "grid" ? (
                <CardFooter className="flex gap-x-2 *:flex-1">
                    <>
                        <CopyButton message={contact.message} variant={variant} />
                        <ShareButton phone={contact.phone ?? ''} message={contact.message} />
                    </>
                </CardFooter>
            ) : ''}
        </Card>
    )
}

export default CardTamu