import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-white/8 bg-white/3 px-4 py-2 text-sm text-white backdrop-blur-xl transition-all duration-300",
          "placeholder:text-white/40",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/20 focus-visible:border-violet-400/40 focus-visible:bg-white/6",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "hover:border-white/15 hover:bg-white/5",
          className
        )}
        style={{
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.04)'
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
