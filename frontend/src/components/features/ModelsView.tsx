import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers,
  Download,
  Trash2,
  Play,
  Pause,
  Check,
  Info,
  Search,
  Filter,
  Cpu,
  HardDrive,
  Zap,
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type { Model } from '@/types'

// Available models for download
const availableModels: Model[] = [
  {
    id: 'phi-3-medium',
    name: 'Phi-3 Medium',
    size: '14B',
    totalLayers: 40,
    loadedLayers: 0,
    status: 'idle',
    description: 'Microsoft Phi-3 Medium - Balanced performance and size',
  },
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B',
    size: '70B',
    totalLayers: 80,
    loadedLayers: 0,
    status: 'idle',
    description: 'Meta Llama 3 - State-of-the-art large model',
  },
  {
    id: 'qwen-2-7b',
    name: 'Qwen 2 7B',
    size: '7B',
    totalLayers: 32,
    loadedLayers: 0,
    status: 'idle',
    description: 'Alibaba Qwen 2 - Multilingual capabilities',
  },
  {
    id: 'deepseek-coder',
    name: 'DeepSeek Coder',
    size: '6.7B',
    totalLayers: 32,
    loadedLayers: 0,
    status: 'idle',
    description: 'DeepSeek - Specialized for code generation',
  },
]

export function ModelsView() {
  const { models, activeModel, setActiveModel, stats, peers } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [downloading, setDownloading] = useState<string | null>(null)
  const [downloadProgress, setDownloadProgress] = useState(0)

  const activePeers = peers.filter((p) => p.status === 'online')

  const handleDownload = (modelId: string) => {
    setDownloading(modelId)
    setDownloadProgress(0)

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setDownloading(null)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 500)
  }

  const handleActivate = (model: Model) => {
    setActiveModel(model)
  }

  const filteredModels = models.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredAvailable = availableModels.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !models.find((installed) => installed.id === m.id)
  )

  return (
    <ScrollArea className="h-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 space-y-6"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:pl-16"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Layers className="w-6 h-6 text-cyan-400" />
                Model Library
              </h1>
              <p className="text-white/60 text-sm mt-1">
                Manage and shard AI models across your swarm
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="info">
                <HardDrive className="w-3 h-3 mr-1" />
                {stats.totalVRAM}GB VRAM Available
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="installed">
            <TabsList>
              <TabsTrigger value="installed">
                Installed ({models.length})
              </TabsTrigger>
              <TabsTrigger value="available">
                Available ({filteredAvailable.length})
              </TabsTrigger>
              <TabsTrigger value="sharding">Shard Config</TabsTrigger>
            </TabsList>

            <TabsContent value="installed">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredModels.map((model, index) => (
                    <motion.div
                      key={model.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ModelCard
                        model={model}
                        isActive={activeModel?.id === model.id}
                        onActivate={() => handleActivate(model)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="available">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredAvailable.map((model, index) => (
                    <motion.div
                      key={model.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:border-white/30 transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center border border-white/20">
                                <Cpu className="w-7 h-7 text-white/60" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-white">
                                  {model.name}
                                </h3>
                                <p className="text-sm text-white/50">
                                  {model.description}
                                </p>
                              </div>
                            </div>
                            <Badge variant="default">{model.size}</Badge>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-white/50">Total Layers</p>
                              <p className="text-white font-medium">{model.totalLayers}</p>
                            </div>
                            <div>
                              <p className="text-white/50">Required VRAM</p>
                              <p className="text-white font-medium">
                                ~{Math.ceil(parseInt(model.size) * 0.8)}GB
                              </p>
                            </div>
                          </div>

                          {downloading === model.id ? (
                            <div className="mt-4">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-white/50">Downloading...</span>
                                <span className="text-cyan-400">
                                  {Math.round(downloadProgress)}%
                                </span>
                              </div>
                              <Progress value={downloadProgress} />
                            </div>
                          ) : (
                            <Button
                              variant="glow"
                              className="w-full mt-4"
                              onClick={() => handleDownload(model.id)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download & Shard
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="sharding">
              <Card glow>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    Pipeline Parallelism Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/50 mb-6">
                    Configure how model layers are distributed across your swarm peers.
                  </p>

                  {activeModel ? (
                    <div className="space-y-6">
                      {/* Active model info */}
                      <div className="p-4 rounded-xl glass border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-white">{activeModel.name}</h4>
                            <p className="text-sm text-white/50">
                              {activeModel.totalLayers} total layers
                            </p>
                          </div>
                          <Badge variant="success" pulse>Active</Badge>
                        </div>

                        {/* Layer distribution visualization */}
                        <div className="relative h-12 bg-white/5 rounded-lg overflow-hidden border border-white/10">
                          {activePeers.map((peer, index) => {
                            const layerCount = peer.layers.end - peer.layers.start + 1
                            const width = (layerCount / activeModel.totalLayers) * 100

                            return (
                              <motion.div
                                key={peer.id}
                                initial={{ width: 0 }}
                                animate={{ width: `${width}%` }}
                                transition={{ delay: index * 0.2, duration: 0.5 }}
                                className={cn(
                                  'absolute top-0 bottom-0 flex items-center justify-center',
                                  index === 0 ? 'left-0 bg-cyan-500/30 border-r border-white/10' : 'right-0 bg-violet-500/30'
                                )}
                              >
                                <span className="text-xs font-medium text-white">
                                  L{peer.layers.start}-{peer.layers.end}
                                </span>
                              </motion.div>
                            )
                          })}
                        </div>

                        <div className="flex justify-between mt-2 text-xs text-white/40">
                          <span>Layer 1</span>
                          <span>Layer {activeModel.totalLayers}</span>
                        </div>
                      </div>

                      {/* Peer assignments */}
                      <div className="space-y-3">
                        {activePeers.map((peer) => (
                          <div
                            key={peer.id}
                            className="p-4 rounded-xl glass border border-white/10 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-cyan-500/20 to-violet-600/20 flex items-center justify-center border border-cyan-400/30">
                                <Cpu className="w-5 h-5 text-cyan-400" />
                              </div>
                              <div>
                                <h5 className="font-medium text-white">{peer.name}</h5>
                                <p className="text-xs text-white/50">{peer.hardware.accelerator}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-white">
                                Layers {peer.layers.start}-{peer.layers.end}
                              </p>
                              <p className="text-xs text-white/50">
                                {peer.layers.end - peer.layers.start + 1} layers • {peer.throughput} tok/s
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 p-4 rounded-xl bg-amber-500/10 border border-amber-400/30">
                        <Info className="w-5 h-5 text-amber-400 shrink-0" />
                        <p className="text-sm text-amber-200">
                          Layer distribution is automatically optimized based on each peer's VRAM and compute capabilities via Azure Fluid Relay.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Layers className="w-12 h-12 text-white/30 mx-auto mb-4" />
                      <p className="text-white/50">No model is currently active</p>
                      <p className="text-sm text-white/40">
                        Select a model from the Installed tab to configure sharding
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </ScrollArea>
  )
}

interface ModelCardProps {
  model: Model
  isActive: boolean
  onActivate: () => void
}

function ModelCard({ model, isActive, onActivate }: ModelCardProps) {
  return (
    <Card
      className={cn(
        'transition-all duration-200',
        isActive && 'border-cyan-500/50 bg-cyan-500/5'
      )}
      glow={isActive}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'w-14 h-14 rounded-xl flex items-center justify-center border',
                isActive
                  ? 'bg-linear-to-br from-cyan-500/20 to-blue-600/20 border-cyan-500/30'
                  : 'glass border-white/10'
              )}
            >
              <Cpu
                className={cn('w-7 h-7', isActive ? 'text-cyan-400' : 'text-white/50')}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                {model.name}
                {isActive && <Check className="w-4 h-4 text-cyan-400" />}
              </h3>
              <p className="text-sm text-white/50">{model.description}</p>
            </div>
          </div>
          <Badge variant={model.status === 'ready' ? 'success' : 'default'}>
            {model.size}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-white/50">Layers</p>
            <p className="text-white font-medium">
              {model.loadedLayers}/{model.totalLayers}
            </p>
          </div>
          <div>
            <p className="text-white/50">Status</p>
            <p
              className={cn(
                'font-medium capitalize',
                model.status === 'ready' ? 'text-emerald-400' : 'text-white/60'
              )}
            >
              {model.status}
            </p>
          </div>
          <div>
            <p className="text-white/50">VRAM</p>
            <p className="text-white font-medium">
              ~{Math.ceil(parseInt(model.size) * 0.6)}GB
            </p>
          </div>
        </div>

        <div className="mt-4">
          <Progress
            value={(model.loadedLayers / model.totalLayers) * 100}
            indicatorClassName={isActive ? 'from-cyan-500 to-blue-600' : undefined}
          />
        </div>

        <div className="mt-4 flex items-center gap-2">
          {isActive ? (
            <Button variant="outline" className="flex-1">
              <Pause className="w-4 h-4 mr-2" />
              Unload
            </Button>
          ) : (
            <Button variant="glow" className="flex-1" onClick={onActivate}>
              <Play className="w-4 h-4 mr-2" />
              Activate
            </Button>
          )}
          <Button variant="ghost" size="icon">
            <Trash2 className="w-4 h-4 text-white/40" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
