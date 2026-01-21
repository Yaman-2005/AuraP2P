import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Network,
  Wifi,
  RefreshCw,
  Plus,
  Settings,
  Laptop,
  Server,
  Monitor,
  Zap,
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { Peer } from '@/types'

export function NetworkView() {
  const { peers, stats } = useAppStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedPeer, setSelectedPeer] = useState<Peer | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  // Draw network visualization
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    // Animation loop
    let animationFrame: number
    let particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      alpha: number
      targetAlpha: number
    }> = []

    // Initialize particles
    const initParticles = () => {
      particles = Array.from({ length: 50 }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5,
        targetAlpha: Math.random() * 0.5 + 0.2,
      }))
    }
    initParticles()

    // Node positions
    const nodePositions = peers.map((_, index) => {
      const centerX = canvas.offsetWidth / 2
      const centerY = canvas.offsetHeight / 2
      const radius = Math.min(centerX, centerY) * 0.6
      const angle = (index * 2 * Math.PI) / peers.length - Math.PI / 2
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      }
    })

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Draw particles
      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around
        if (particle.x < 0) particle.x = canvas.offsetWidth
        if (particle.x > canvas.offsetWidth) particle.x = 0
        if (particle.y < 0) particle.y = canvas.offsetHeight
        if (particle.y > canvas.offsetHeight) particle.y = 0

        // Fade
        particle.alpha += (particle.targetAlpha - particle.alpha) * 0.01
        if (Math.random() < 0.01) {
          particle.targetAlpha = Math.random() * 0.5 + 0.2
        }

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(6, 182, 212, ${particle.alpha})`
        ctx.fill()
      })

      // Draw connections between nodes
      nodePositions.forEach((pos1, i) => {
        nodePositions.forEach((pos2, j) => {
          if (i >= j) return
          const peer1 = peers[i]
          const peer2 = peers[j]
          if (peer1.status !== 'online' || peer2.status !== 'online') return

          // Animated dashed line
          const gradient = ctx.createLinearGradient(pos1.x, pos1.y, pos2.x, pos2.y)
          gradient.addColorStop(0, 'rgba(6, 182, 212, 0.3)')
          gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.3)')
          gradient.addColorStop(1, 'rgba(6, 182, 212, 0.3)')

          ctx.beginPath()
          ctx.moveTo(pos1.x, pos1.y)
          ctx.lineTo(pos2.x, pos2.y)
          ctx.strokeStyle = gradient
          ctx.lineWidth = 2
          ctx.setLineDash([5, 5])
          ctx.lineDashOffset = -Date.now() / 100
          ctx.stroke()
          ctx.setLineDash([])
        })
      })

      // Draw nodes
      nodePositions.forEach((pos, index) => {
        const peer = peers[index]
        const isOnline = peer.status === 'online'
        const isSyncing = peer.status === 'syncing'

        // Glow effect
        if (isOnline) {
          const glowGradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 60)
          glowGradient.addColorStop(0, 'rgba(6, 182, 212, 0.2)')
          glowGradient.addColorStop(1, 'rgba(6, 182, 212, 0)')
          ctx.beginPath()
          ctx.arc(pos.x, pos.y, 60, 0, Math.PI * 2)
          ctx.fillStyle = glowGradient
          ctx.fill()
        }

        // Node circle
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 30, 0, Math.PI * 2)
        const nodeGradient = ctx.createRadialGradient(pos.x - 10, pos.y - 10, 0, pos.x, pos.y, 30)
        if (isOnline) {
          nodeGradient.addColorStop(0, '#22d3ee')
          nodeGradient.addColorStop(1, '#0891b2')
        } else if (isSyncing) {
          nodeGradient.addColorStop(0, '#fbbf24')
          nodeGradient.addColorStop(1, '#d97706')
        } else {
          nodeGradient.addColorStop(0, '#64748b')
          nodeGradient.addColorStop(1, '#475569')
        }
        ctx.fillStyle = nodeGradient
        ctx.fill()

        // Border
        ctx.strokeStyle = isOnline ? '#06b6d4' : isSyncing ? '#f59e0b' : '#64748b'
        ctx.lineWidth = 2
        ctx.stroke()

        // Label
        ctx.fillStyle = '#e2e8f0'
        ctx.font = '12px Inter, system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(peer.name.split(' ')[0], pos.x, pos.y + 50)
      })

      // Draw center hub
      const centerX = canvas.offsetWidth / 2
      const centerY = canvas.offsetHeight / 2

      // Hub glow
      const hubGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 80)
      hubGlow.addColorStop(0, 'rgba(139, 92, 246, 0.3)')
      hubGlow.addColorStop(1, 'rgba(139, 92, 246, 0)')
      ctx.beginPath()
      ctx.arc(centerX, centerY, 80, 0, Math.PI * 2)
      ctx.fillStyle = hubGlow
      ctx.fill()

      // Hub circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, 40, 0, Math.PI * 2)
      const hubGradient = ctx.createRadialGradient(centerX - 15, centerY - 15, 0, centerX, centerY, 40)
      hubGradient.addColorStop(0, '#a78bfa')
      hubGradient.addColorStop(1, '#7c3aed')
      ctx.fillStyle = hubGradient
      ctx.fill()
      ctx.strokeStyle = '#8b5cf6'
      ctx.lineWidth = 3
      ctx.stroke()

      // Connections to hub
      nodePositions.forEach((pos, index) => {
        const peer = peers[index]
        if (peer.status !== 'online') return

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(pos.x, pos.y)
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)'
        ctx.lineWidth = 1
        ctx.stroke()
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrame)
    }
  }, [peers])

  const handleScan = () => {
    setIsScanning(true)
    setTimeout(() => setIsScanning(false), 3000)
  }

  const getDeviceIcon = (type: Peer['hardware']['type']) => {
    switch (type) {
      case 'laptop':
        return Laptop
      case 'server':
        return Server
      case 'desktop':
        return Monitor
      default:
        return Monitor
    }
  }

  return (
    <div className="h-full flex">
      {/* Network Visualization */}
      <div className="flex-1 relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-6 left-6 lg:left-20 right-6 z-10"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Network className="w-6 h-6 text-cyan-400" />
                Network Topology
              </h1>
              <p className="text-white/60 text-sm mt-1">
                Visual representation of your P2P swarm
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="success" pulse>
                <Wifi className="w-3 h-3 mr-1" />
                {stats.activePeers} Connected
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleScan}
                disabled={isScanning}
              >
                <RefreshCw className={cn('w-4 h-4 mr-2', isScanning && 'animate-spin')} />
                {isScanning ? 'Scanning...' : 'Scan Network'}
              </Button>
              <Button variant="glow" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Peer
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Canvas for network visualization */}
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ background: 'transparent' }}
        />

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-6 left-6 p-4 rounded-xl glass border border-white/15"
        >
          <h4 className="text-sm font-semibold text-white mb-3">Legend</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-cyan-400" />
              <span className="text-white/70">Online Peer</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="text-white/70">Syncing</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-white/40" />
              <span className="text-white/50">Offline</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-violet-400" />
              <span className="text-white/50">Orchestrator</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Peer List Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-96 border-l border-white/10 glass-elevated"
      >
        <div className="p-4 border-b border-white/10">
          <h3 className="font-semibold text-white">Peer Details</h3>
          <p className="text-xs text-white/50 mt-1">
            Click a peer to view details
          </p>
        </div>

        <ScrollArea className="h-[calc(100%-60px)]">
          <div className="p-4 space-y-3">
            <AnimatePresence>
              {peers.map((peer, index) => {
                const DeviceIcon = getDeviceIcon(peer.hardware.type)
                const isSelected = selectedPeer?.id === peer.id

                return (
                  <motion.div
                    key={peer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedPeer(isSelected ? null : peer)}
                  >
                    <Card
                      className={cn(
                        'cursor-pointer transition-all duration-200 hover:border-white/30',
                        isSelected && 'border-violet-400/50 bg-violet-500/10'
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'w-12 h-12 rounded-xl flex items-center justify-center border',
                              peer.status === 'online'
                                ? 'bg-cyan-500/20 border-cyan-400/30 text-cyan-400'
                                : peer.status === 'syncing'
                                ? 'bg-amber-500/20 border-amber-400/30 text-amber-400'
                                : 'bg-white/10 border-white/20 text-white/40'
                            )}
                          >
                            <DeviceIcon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-white">{peer.name}</h4>
                              <Badge
                                variant={
                                  peer.status === 'online'
                                    ? 'success'
                                    : peer.status === 'syncing'
                                    ? 'warning'
                                    : 'error'
                                }
                                pulse={peer.status === 'online'}
                              >
                                {peer.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-white/50">{peer.ip}</p>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-white/10 space-y-3"
                            >
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <p className="text-white/50">CPU</p>
                                  <p className="text-white font-medium">{peer.hardware.cpu}</p>
                                </div>
                                <div>
                                  <p className="text-white/50">Accelerator</p>
                                  <p className="text-cyan-400 font-medium">{peer.hardware.accelerator}</p>
                                </div>
                                <div>
                                  <p className="text-white/50">RAM</p>
                                  <p className="text-white font-medium">{peer.hardware.ram}GB</p>
                                </div>
                                <div>
                                  <p className="text-white/50">VRAM</p>
                                  <p className="text-white font-medium">{peer.hardware.vram}GB</p>
                                </div>
                                <div>
                                  <p className="text-white/50">Layers</p>
                                  <p className="text-white font-medium">
                                    {peer.layers.start}-{peer.layers.end}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-white/50">Latency</p>
                                  <p className="text-white font-medium">{peer.latency}ms</p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <Zap className="w-4 h-4 text-cyan-400" />
                                  <span className="text-cyan-400 font-semibold">
                                    {peer.throughput} tok/s
                                  </span>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Settings className="w-4 h-4" />
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </motion.div>
    </div>
  )
}
