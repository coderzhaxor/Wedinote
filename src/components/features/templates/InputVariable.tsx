import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2Icon } from "lucide-react"

interface VariableProps {
    id: string
    key?: string
    value?: string
}

interface InputVariableProps {
    variable: VariableProps
    placeholder?: string
    disabled?: boolean
    changeKey: (id: string, key: string) => void
    changeValue: (id: string, value: string) => void
    handleDelete: (id: string) => void
}

const InputVariable = ({ variable, placeholder, disabled = false, changeKey, changeValue, handleDelete }: InputVariableProps) => {
    return (
        <div key={variable.id} className="flex gap-x-2">
            <Input
                onChange={(e) => changeKey(variable.id, e.target.value)}
                type="text"
                placeholder={placeholder || "Key (nama_variable)"}
                disabled={disabled}
                value={variable.key}
                className="max-w-72 disabled:ring-0"
            />
            <Input
                onChange={(e) => changeValue(variable.id, e.target.value)}
                type="text"
                placeholder={placeholder || "Value"}
                disabled={disabled}
                value={variable.value}
                className="disabled:ring-0"
            />
            <Button
                variant="outline"
                onClick={() => handleDelete(variable.id)}
                disabled={disabled}
                size="icon"
                className="px-4 hover:cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors duration-150 ease-in-out">
                <Trash2Icon />
            </Button>
        </div>
    )
}

export default InputVariable