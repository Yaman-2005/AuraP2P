import { cn } from "@/lib/utils"

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  className?: string
  pulse?: boolean
}

export function Badge({ children, variant = 'default', className, pulse }: BadgeProps) {
  const variants = {
    default: 'bg-slate-700 text-slate-200 border-slate-600',
    success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    error: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
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
            variant === 'default' && 'bg-slate-400',
          )} />
          <span className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            variant === 'success' && 'bg-emerald-500',
            variant === 'warning' && 'bg-amber-500',
            variant === 'error' && 'bg-red-500',
            variant === 'info' && 'bg-cyan-500',
            variant === 'default' && 'bg-slate-500',
          )} />
        </span>
      )}
      {children}
    </span>
  )
}
