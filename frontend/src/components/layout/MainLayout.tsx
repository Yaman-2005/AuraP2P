import { Sidebar } from './Sidebar'
import { AnimatedGrid, GlowingOrb, FloatingParticles } from '@/components/effects/GlowEffects'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <AnimatedGrid />
        <GlowingOrb className="top-0 right-0 -translate-y-1/2 translate-x-1/2" size="xl" color="cyan" />
        <GlowingOrb className="bottom-0 left-0 translate-y-1/2 -translate-x-1/2" size="lg" color="purple" />
        <FloatingParticles count={15} />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>
    </div>
  )
}
