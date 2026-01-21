import { motion } from 'framer-motion'
import {
  Activity,
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  TrendingUp,
  Users,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

// Mock data for charts
const throughputData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  throughput: Math.floor(15 + Math.random() * 15),
  latency: Math.floor(5 + Math.random() * 10),
}))

const layerDistribution = [
  { name: 'RTX Laptop', layers: 16, color: '#06b6d4' },
  { name: 'Home Server', layers: 16, color: '#8b5cf6' },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function DashboardView() {
  const { stats, peers, activeModel } = useAppStore()
  // Removed unused variable to satisfy TS strict settings

  return (
    <ScrollArea className="h-full">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="p-6 space-y-6"
      >
        {/* Header */}
        <motion.div variants={item} className="lg:pl-16">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-white/60">
            Real-time overview of your distributed AI swarm
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={item}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            title="Active Peers"
            value={stats.activePeers}
            subtitle={`of ${stats.totalPeers} total`}
            icon={Users}
            trend={+12}
            color="cyan"
          />
          <StatCard
            title="Total VRAM"
            value={`${stats.totalVRAM}GB`}
            subtitle="Combined capacity"
            icon={MemoryStick}
            trend={0}
            color="purple"
          />
          <StatCard
            title="Throughput"
            value={`${stats.currentThroughput}`}
            subtitle="tokens/second"
            icon={Zap}
            trend={+8}
            color="emerald"
          />
          <StatCard
            title="Avg Latency"
            value={`${stats.averageLatency}ms`}
            subtitle="Inter-node delay"
            icon={Activity}
            trend={-15}
            color="amber"
          />
        </motion.div>

        {/* Charts Row */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Throughput Chart */}
          <Card glow>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Inference Throughput
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={throughputData}>
                    <defs>
                      <linearGradient id="throughputGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(16px)',
                        color: '#fff',
                      }}
                      labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="throughput"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      fill="url(#throughputGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Layer Distribution */}
          <Card glow>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-violet-400" />
                Layer Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={layerDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" fontSize={12} width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(16px)',
                        color: '#fff',
                      }}
                      labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                    />
                    <Bar
                      dataKey="layers"
                      fill="#8b5cf6"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Peers Overview */}
        <motion.div variants={item}>
          <Card glow>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5 text-cyan-400" />
                Connected Peers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {peers.map((peer) => (
                  <motion.div
                    key={peer.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-xl glass border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-linear-to-br from-violet-500/30 to-cyan-500/30 flex items-center justify-center border border-violet-400/40">
                          <Cpu className="w-5 h-5 text-violet-300" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{peer.name}</h4>
                          <p className="text-xs text-white/50">{peer.ip}</p>
                        </div>
                      </div>
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
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Layers</span>
                        <span className="text-white">
                          {peer.layers.start}-{peer.layers.end}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">VRAM</span>
                        <span className="text-white">{peer.hardware.vram}GB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Throughput</span>
                        <span className="text-cyan-400">{peer.throughput} tok/s</span>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/40">Utilization</span>
                          <span className="text-white/60">
                            {peer.status === 'online' ? '78%' : '0%'}
                          </span>
                        </div>
                        <Progress value={peer.status === 'online' ? 78 : 0} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Model Info */}
        {activeModel && (
          <motion.div variants={item}>
            <Card glow>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-emerald-400" />
                  Active Model
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">{activeModel.name}</h3>
                    <p className="text-white/60">{activeModel.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="success" pulse>
                      {activeModel.status}
                    </Badge>
                    <p className="text-sm text-white/50 mt-2">
                      {activeModel.loadedLayers}/{activeModel.totalLayers} layers loaded
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/50">Model Loading Progress</span>
                    <span className="text-white">
                      {Math.round((activeModel.loadedLayers / activeModel.totalLayers) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={(activeModel.loadedLayers / activeModel.totalLayers) * 100}
                    indicatorClassName="from-emerald-500 to-cyan-500"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </ScrollArea>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  trend: number
  color: 'cyan' | 'purple' | 'emerald' | 'amber'
}

function StatCard({ title, value, subtitle, icon: Icon, trend, color }: StatCardProps) {
  const colorClasses = {
    cyan: 'from-cyan-500/30 to-blue-600/30 border-cyan-400/40 text-cyan-300',
    purple: 'from-violet-500/30 to-pink-600/30 border-violet-400/40 text-violet-300',
    emerald: 'from-emerald-500/30 to-teal-600/30 border-emerald-400/40 text-emerald-300',
    amber: 'from-amber-500/30 to-orange-600/30 border-amber-400/40 text-amber-300',
  }

  return (
    <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ type: 'spring', stiffness: 400 }}>
      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">{title}</p>
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-xs text-white/40 mt-1">{subtitle}</p>
            </div>
            <div
              className={`w-12 h-12 rounded-xl bg-linear-to-br ${colorClasses[color]} flex items-center justify-center border backdrop-blur-sm`}
            >
              <Icon className="w-6 h-6" />
            </div>
          </div>
          {trend !== 0 && (
            <div className="flex items-center gap-1 mt-3 text-xs">
              {trend > 0 ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-400" />
              )}
              <span className={trend > 0 ? 'text-emerald-400' : 'text-red-400'}>
                {Math.abs(trend)}%
              </span>
              <span className="text-white/50">from last hour</span>
            </div>
          )}
        </CardContent>
        {/* Decorative gradient */}
        <div
          className={`absolute inset-0 bg-linear-to-br ${colorClasses[color]} opacity-10 pointer-events-none`}
        />
      </Card>
    </motion.div>
  )
}
