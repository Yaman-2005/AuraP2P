import { cn } from "@/lib/utils"

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  className?: string
  pulse?: boolean
}

export function Badge({ children, variant = 'default', className, pulse }: BadgeProps) {
  const variants = {
    default: 'bg-white/5 text-white/80 border-white/10',
    success: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/20',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-400/20',
    error: 'bg-red-500/15 text-red-300 border-red-400/20',
    info: 'bg-cyan-500/15 text-cyan-300 border-cyan-400/20',
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors backdrop-blur-sm",
        variants[variant],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            variant === 'success' && 'bg-emerald-400',
            variant === 'warning' && 'bg-amber-400',
            variant === 'error' && 'bg-red-400',
            variant === 'info' && 'bg-cyan-400',
            variant === 'default' && 'bg-white/60',
          )} />
          <span className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            variant === 'success' && 'bg-emerald-400',
            variant === 'warning' && 'bg-amber-400',
            variant === 'error' && 'bg-red-400',
            variant === 'info' && 'bg-cyan-400',
            variant === 'default' && 'bg-white/80',
          )} />
        </span>
      )}
      {children}
    </span>
  )
}
