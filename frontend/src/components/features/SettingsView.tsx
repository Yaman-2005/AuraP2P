import { motion } from 'framer-motion'
import {
  Settings,
  Wifi,
  Cpu,
  Shield,
  Palette,
  Database,
  Globe,
  ChevronRight,
  Moon,
  Sun,
  ToggleLeft,
  ToggleRight,
  Info,
} from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface SettingsSectionProps {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}

function SettingsSection({ title, description, icon: Icon, children }: SettingsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-cyan-500" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  )
}

interface ToggleSettingProps {
  label: string
  description?: string
  enabled: boolean
  onToggle: () => void
}

function ToggleSetting({ label, description, enabled, onToggle }: ToggleSettingProps) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-xl glass hover:bg-white/8 transition-colors cursor-pointer border border-white/8"
      onClick={onToggle}
    >
      <div>
        <p className="font-medium text-white">{label}</p>
        {description && <p className="text-sm text-white/50">{description}</p>}
      </div>
      {enabled ? (
        <ToggleRight className="w-8 h-8 text-cyan-400" />
      ) : (
        <ToggleLeft className="w-8 h-8 text-white/40" />
      )}
    </div>
  )
}

export function SettingsView() {
  const [settings, setSettings] = useState({
    autoConnect: true,
    encryptTraffic: true,
    shareUsageData: false,
    notifications: true,
    darkMode: true,
    dhtEnabled: true,
    fluidRelay: true,
    cosmosDb: false,
  })

  const [networkPort, setNetworkPort] = useState('5000')
  const [maxPeers, setMaxPeers] = useState('10')

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <ScrollArea className="h-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 space-y-6 max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:pl-16"
        >
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-cyan-400" />
            Settings
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Configure your AuraP2P node and swarm preferences
          </p>
        </motion.div>

        {/* Network Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SettingsSection
            title="Network Configuration"
            description="Configure how your node connects to the swarm"
            icon={Wifi}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/50 mb-2 block">
                  P2P Listen Port
                </label>
                <Input
                  value={networkPort}
                  onChange={(e) => setNetworkPort(e.target.value)}
                  placeholder="5000"
                />
              </div>
              <div>
                <label className="text-sm text-white/50 mb-2 block">
                  Max Peer Connections
                </label>
                <Input
                  value={maxPeers}
                  onChange={(e) => setMaxPeers(e.target.value)}
                  placeholder="10"
                />
              </div>
            </div>

            <ToggleSetting
              label="Auto-connect to known peers"
              description="Automatically establish connections on startup"
              enabled={settings.autoConnect}
              onToggle={() => toggle('autoConnect')}
            />

            <ToggleSetting
              label="Enable DHT Discovery"
              description="Use BitTorrent-style distributed hash table for peer discovery"
              enabled={settings.dhtEnabled}
              onToggle={() => toggle('dhtEnabled')}
            />
          </SettingsSection>
        </motion.div>

        {/* Compute Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <SettingsSection
            title="Compute Resources"
            description="Manage how your hardware is utilized"
            icon={Cpu}
          >
            <div className="p-4 rounded-xl glass border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium text-white">Hardware Acceleration</p>
                  <p className="text-sm text-white/50">
                    Current: DirectML (RTX 2050)
                  </p>
                </div>
                <Badge variant="success">Detected</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-white/50">VRAM</p>
                  <p className="text-white font-bold">4GB</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-white/50">RAM</p>
                  <p className="text-white font-bold">16GB</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-white/50">Threads</p>
                  <p className="text-white font-bold">14</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 rounded-xl bg-cyan-500/10 border border-cyan-400/30">
              <Info className="w-5 h-5 text-cyan-400 shrink-0" />
              <p className="text-sm text-cyan-200">
                AuraP2P automatically selects DirectML for NVIDIA GPUs and OpenVINO for Intel CPUs.
              </p>
            </div>
          </SettingsSection>
        </motion.div>

        {/* Azure Integration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SettingsSection
            title="Azure Integration"
            description="Cloud services for coordination and tracking"
            icon={Globe}
          >
            <ToggleSetting
              label="Azure Fluid Relay"
              description="Real-time coordination for dynamic load balancing"
              enabled={settings.fluidRelay}
              onToggle={() => toggle('fluidRelay')}
            />

            <ToggleSetting
              label="Azure Cosmos DB"
              description="Global peer tracking and reputation system"
              enabled={settings.cosmosDb}
              onToggle={() => toggle('cosmosDb')}
            />

            <div className="p-4 rounded-xl glass border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Connection Status</p>
                  <p className="text-sm text-white/50">
                    {settings.fluidRelay ? 'Connected to Azure Fluid Relay' : 'Running in local mode'}
                  </p>
                </div>
                <Badge variant={settings.fluidRelay ? 'success' : 'warning'}>
                  {settings.fluidRelay ? 'Cloud' : 'Local'}
                </Badge>
              </div>
            </div>
          </SettingsSection>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <SettingsSection
            title="Security & Privacy"
            description="Protect your data and communications"
            icon={Shield}
          >
            <ToggleSetting
              label="Encrypt P2P Traffic"
              description="Use TLS encryption for all peer communications"
              enabled={settings.encryptTraffic}
              onToggle={() => toggle('encryptTraffic')}
            />

            <ToggleSetting
              label="Share Anonymous Usage Data"
              description="Help improve AuraP2P by sharing anonymous metrics"
              enabled={settings.shareUsageData}
              onToggle={() => toggle('shareUsageData')}
            />
          </SettingsSection>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SettingsSection
            title="Appearance"
            description="Customize the look and feel"
            icon={Palette}
          >
            <div className="flex items-center gap-3">
              <p className="text-white/60">Theme</p>
              <div className="flex items-center gap-2 p-1 rounded-lg glass border border-white/6">
                <button
                  className={cn(
                    'p-2 rounded-md transition-colors text-white/60 hover:text-white',
                    !settings.darkMode && 'bg-white/10 text-white'
                  )}
                  onClick={() => setSettings((s) => ({ ...s, darkMode: false }))}
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  className={cn(
                    'p-2 rounded-md transition-colors text-white/60 hover:text-white',
                    settings.darkMode && 'bg-white/10 text-white'
                  )}
                  onClick={() => setSettings((s) => ({ ...s, darkMode: true }))}
                >
                  <Moon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <ToggleSetting
              label="Desktop Notifications"
              description="Show system notifications for important events"
              enabled={settings.notifications}
              onToggle={() => toggle('notifications')}
            />
          </SettingsSection>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <Database className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">AuraP2P</h3>
                    <p className="text-sm text-white/50">
                      Decentralized AI for the Masses
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="info">v0.1.0-alpha</Badge>
                  <p className="text-xs text-white/40 mt-1">MIT License</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                <p className="text-sm text-white/50">
                  Recycling E-Waste into a Global AI Supercomputer
                </p>
                <Button variant="ghost" size="sm">
                  View on GitHub
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </ScrollArea>
  )
}
