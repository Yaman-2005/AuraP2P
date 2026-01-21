import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlowingOrbProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'cyan' | 'purple' | 'blue' | 'emerald'
}

export function GlowingOrb({ className, size = 'md', color = 'cyan' }: GlowingOrbProps) {
  const sizes = {
    sm: 'w-32 h-32',
    md: 'w-64 h-64',
    lg: 'w-96 h-96',
    xl: 'w-[500px] h-[500px]',
  }

  const colors = {
    cyan: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
    purple: 'from-purple-500/20 via-purple-500/5 to-transparent',
    blue: 'from-blue-500/20 via-blue-500/5 to-transparent',
    emerald: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
  }

  return (
    <motion.div
      className={cn(
        'absolute rounded-full bg-gradient-radial blur-3xl pointer-events-none',
        sizes[size],
        colors[color],
        className
      )}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

interface AnimatedGridProps {
  className?: string
}

export function AnimatedGrid({ className }: AnimatedGridProps) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(6, 182, 212) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(6, 182, 212) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgb(248 250 252) 70%)',
        }}
      />
    </div>
  )
}

interface FloatingParticlesProps {
  count?: number
}

export function FloatingParticles({ count = 20 }: FloatingParticlesProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-500/20 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
          }}
          animate={{
            y: [null, -20, 20],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}

interface PulseRingProps {
  className?: string
  color?: string
}

export function PulseRing({ className, color = 'cyan' }: PulseRingProps) {
  const colorClasses = {
    cyan: 'border-cyan-500',
    emerald: 'border-emerald-500',
    purple: 'border-purple-500',
  }

  return (
    <div className={cn('relative', className)}>
      <motion.div
        className={cn(
          'absolute inset-0 rounded-full border-2 opacity-50',
          colorClasses[color as keyof typeof colorClasses] || colorClasses.cyan
        )}
        animate={{
          scale: [1, 1.5, 2],
          opacity: [0.5, 0.25, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />
      <motion.div
        className={cn(
          'absolute inset-0 rounded-full border-2 opacity-50',
          colorClasses[color as keyof typeof colorClasses] || colorClasses.cyan
        )}
        animate={{
          scale: [1, 1.5, 2],
          opacity: [0.5, 0.25, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut',
          delay: 0.5,
        }}
      />
    </div>
  )
}

interface GlitchTextProps {
  children: string
  className?: string
}

export function GlitchText({ children, className }: GlitchTextProps) {
  return (
    <div className={cn('relative inline-block', className)}>
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute top-0 left-0 text-cyan-500 opacity-50 z-0"
        animate={{
          x: [-2, 2, -2],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        {children}
      </motion.span>
      <motion.span
        className="absolute top-0 left-0 text-purple-500 opacity-50 z-0"
        animate={{
          x: [2, -2, 2],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        {children}
      </motion.span>
    </div>
  )
}
