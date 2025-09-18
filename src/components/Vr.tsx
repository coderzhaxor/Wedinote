import { cn } from "@/lib/utils"

const Vr = ({ className = "h-6" }) => {
    return <div className={cn(
        className,
        "border-l border-gray-300 mx-1"
    )}></div>
}

export default Vr