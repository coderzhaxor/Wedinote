import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"

interface ShareButtonProps {
    variant?: "icon" | "text"
    message: string
    phone: string
}

export function ShareButton({ message, phone, variant = "text" }: ShareButtonProps) {
    const handleShare = () => {
        if (!phone) return

        if (phone.startsWith("0")) {
            phone = "+62" + phone.slice(1)
        }

        const text = encodeURIComponent(message.replace(/\\n/g, "\n"))
        const url = `https://wa.me/${phone}?text=${text}`

        window.open(url, "_blank")
    }

    return (
        <Button
            className="hover:cursor-pointer"
            onClick={handleShare}
            variant={variant === "icon" ? "outline" : "default"}
            size={variant === "icon" ? "icon" : "default"}
        >
            {variant === "icon" ? (
                <Share2 className="h-4 w-4" />
            ) : (
                <>
                    <Share2 className="mr-2 h-4 w-4" /> Share
                </>
            )}
        </Button>
    )
}
