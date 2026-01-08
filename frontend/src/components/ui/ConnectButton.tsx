import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/appStore'
import { Check, Loader2, Wifi, WifiOff, Rocket } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const API_BASE = 'http://localhost:8000'
const DEFAULT_SWARM_IP = '192.168.0.111'

export function ConnectButton() {
  const {
    isOnline,
    isConnectedToSwarm,
    setOnline,
    setConnectedToSwarm,
  } = useAppStore()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const handleConnect = async () => {
    setLoading(true)
    setError(null)
    setProgress(0)

    try {
      // Step 1: Go online
      setProgress(30)
      await fetch(`${API_BASE}/go-online`, { method: 'POST' })
      setOnline(true)
      setProgress(60)

      // Step 2: Connect to swarm
      setProgress(80)
      const res = await fetch(`${API_BASE}/connect-to-swarm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip: DEFAULT_SWARM_IP }),
      })

      const data = await res.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to connect')
      }

      setConnectedToSwarm(true)
      setProgress(100)
      
      // Small success celebration
      setTimeout(() => setProgress(0), 1000)
      
    } catch (e: any) {
      setError(e.message)
      setProgress(0)
    } finally {
      setLoading(false)
    }
  }

  if (isOnline && isConnectedToSwarm) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        <div className="relative flex items-center gap-3 px-4 py-3 bg-slate-900 rounded-xl border border-green-500/30 backdrop-blur-sm">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-md animate-ping"></div>
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-green-400 font-semibold">Connected to Swarm</span>
            <span className="text-xs text-slate-400">{DEFAULT_SWARM_IP}</span>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="ml-2 w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
          />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 text-red-400">
              <WifiOff className="w-4 h-4" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
        
        {/* Progress bar background */}
        {loading && (
          <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/50 to-blue-600/50 rounded-xl overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}
        
        {/* Button */}
        <Button
          onClick={handleConnect}
          disabled={loading}
          variant="glow"
          className={`
            relative w-full min-w-[200px] 
            ${loading ? 'px-8' : 'px-6'}
            py-6 text-base font-semibold
            bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900
            border border-cyan-500/50
            shadow-lg shadow-cyan-500/30
            hover:shadow-cyan-500/50 hover:scale-[1.02]
            active:scale-[0.98]
            backdrop-blur-xl
            overflow-hidden
          `}
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                initial={{ x: -20, y: Math.random() * 40 }}
                animate={{ 
                  x: ["0%", "100%"],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              />
            ))}
          </div>

          <div className="relative flex items-center justify-center gap-3">
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-5 h-5 text-cyan-400" />
                </motion.div>
                <div className="text-center">
                  <div className="text-cyan-300">Connecting to Swarm...</div>
                  <div className="text-xs text-cyan-400/70 mt-1">
                    {progress < 50 ? "Going online" : "Establishing connection"}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Rocket className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                <div className="text-center">
                  <div className="text-cyan-300">Connect to Swarm</div>
                  <div className="text-xs text-cyan-400/70 mt-1">
                    Click to establish connection
                  </div>
                </div>
                <Wifi className="w-5 h-5 text-cyan-400/50" />
              </>
            )}
          </div>
        </Button>
      </div>

      {/* Status indicators */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`} />
          <span>Network Status</span>
        </div>
        <div className="w-px h-3 bg-slate-700" />
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnectedToSwarm ? 'bg-green-500' : 'bg-slate-600'}`} />
          <span>Swarm Ready</span>
        </div>
      </div>
    </motion.div>
  )
}