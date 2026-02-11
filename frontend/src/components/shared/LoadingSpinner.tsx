import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  text?: string
  className?: string
}

export function LoadingSpinner({ text, className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      {text && <p className="text-sm text-slate-400">{text}</p>}
    </div>
  )
}
