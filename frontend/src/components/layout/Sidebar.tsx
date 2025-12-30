import { motion } from 'framer-motion'
import {
  MessageSquare,
  Network,
  LayoutDashboard,
  Settings,
  Layers,
  Menu,
  X,
  Zap,
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { GlitchText } from '@/components/effects/GlowEffects'

const navItems = [
  { id: 'chat', label: 'AI Chat', icon: MessageSquare },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'network', label: 'Network', icon: Network },
  { id: 'models', label: 'Models', icon: Layers },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, activeTab, setActiveTab, stats } = useAppStore()

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -280,
          width: sidebarOpen ? 280 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          'fixed lg:relative h-full z-50 flex flex-col',
          'bg-slate-900/95 backdrop-blur-xl border-r border-slate-800',
          'lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <motion.div
                className="absolute inset-0 rounded-xl bg-cyan-500/50 blur-lg -z-10"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <GlitchText className="text-lg font-bold text-white">
                AuraP2P
              </GlitchText>
              <p className="text-xs text-slate-400">Decentralized AI</p>
            </div>
          </motion.div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  'text-left text-sm font-medium',
                  isActive
                    ? 'bg-linear-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive && 'text-cyan-400')} />
                <span>{item.label}</span>
                {item.id === 'network' && (
                  <span className="ml-auto flex items-center gap-1.5 text-xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    {stats.activePeers} online
                  </span>
                )}
              </motion.button>
            )
          })}
        </nav>

        {/* Stats footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 border-t border-slate-800"
        >
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400">Swarm Status</span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Active
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-lg font-bold text-white">{stats.totalVRAM}GB</p>
                <p className="text-xs text-slate-400">Total VRAM</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">{stats.currentThroughput}</p>
                <p className="text-xs text-slate-400">tok/s</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.aside>

      {/* Mobile menu button */}
      {!sidebarOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}
    </>
  )
}
