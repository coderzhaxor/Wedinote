import { Button } from "../ui/button"
import Image from "next/image"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuContent,
    DropdownMenuLabel,
} from "../ui/dropdown-menu"
import { LogOutIcon } from "lucide-react"

interface AvatarProps {
    src: string
    name: string
    email: string
    onClick: () => void
}

const Avatar = ({ src, name, email, ...props }: AvatarProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="rounded-full ring-2 ring-black/5 cursor-pointer" aria-label="Open account menu">
                    <Image
                        src={src}
                        alt="Avatar"
                        width={32}
                        height={32}
                        className="rounded-full"
                        priority
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-w-64" align="end">
                <DropdownMenuLabel className="flex items-start gap-3">
                    <Image
                        src={src}
                        alt="Avatar"
                        width={32}
                        height={32}
                        className="rounded-full"
                        priority
                    />
                    <div className="flex min-w-0 flex-col">
                        <span className="text-foreground truncate text-sm font-medium">
                            {name}
                        </span>
                        <span className="text-muted-foreground truncate text-xs font-normal">
                            {email}
                        </span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem {...props}>
                    <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>

        </DropdownMenu>
    )
}

export default Avatar