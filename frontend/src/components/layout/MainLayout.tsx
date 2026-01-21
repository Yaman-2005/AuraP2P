import { Sidebar } from './Sidebar'
import { AnimatedGrid, GlowingOrb, FloatingParticles } from '@/components/effects/GlowEffects'
import { useAppStore } from '@/store/appStore'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { sidebarOpen, setSidebarOpen } = useAppStore()
  return (
    <div className="flex h-screen text-white overflow-hidden relative">
      {/* Dreamy gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        {/* Pastel gradient overlays */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] animate-glow-pulse" />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-0 left-1/3 w-[700px] h-[400px] bg-pink-400/15 rounded-full blur-[130px] animate-glow-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-cyan-400/15 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>

      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <AnimatedGrid />
        <GlowingOrb className="top-0 right-0 -translate-y-1/2 translate-x-1/2" size="xl" color="cyan" />
        <GlowingOrb className="bottom-0 left-0 translate-y-1/2 -translate-x-1/2" size="lg" color="purple" />
        <FloatingParticles count={20} />
      </div>

      {/* Noise texture overlay */}
      <div className="fixed inset-0 noise pointer-events-none" />

      {/* Desktop sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 hidden lg:block">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-hidden relative z-10">
        {children}
      </main>
    </div>
  )
}
