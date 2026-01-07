import { useEffect } from 'react'
import { MainLayout } from '@/components/layout'
import { useWSStore } from '@/store/wsStore'
import {
  ChatView,
  DashboardView,
  NetworkView,
  ModelsView,
  SettingsView,
} from '@/components/features'
import { useAppStore } from '@/store/appStore'
import { TooltipProvider } from '@/components/ui/tooltip'

const API_BASE = 'http://localhost:8000'
const DEFAULT_SWARM_IP = '192.168.0.111'

function App() {
  const { activeTab, addPeer, updatePeer } = useAppStore()
   const connectWS = useWSStore((s) => s.connect)

  useEffect(() => {
    connectWS()
  }, [connectWS])
  // 🔹 BOOTSTRAP NODE ON APP LOAD
  useEffect(() => {
    async function bootstrapNode() {
      try {
        console.log('🚀 [AuraP2P] Going online...')
        await fetch(`${API_BASE}/go-online`, { method: 'POST' })

        console.log('🔗 [AuraP2P] Connecting to swarm...')
        await fetch(`${API_BASE}/connect-to-swarm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ip: DEFAULT_SWARM_IP }),
        })

        console.log('📡 [AuraP2P] Fetching status...')
        const res = await fetch(`${API_BASE}/status`)
        const status = await res.json()

        status.peers.forEach((peer: any) => {
          addPeer({
            ...peer,
            lastSeen: new Date(),
          })
        })

        console.log('✅ [AuraP2P] Node ready')
      } catch (err) {
        console.error('❌ [AuraP2P] Bootstrap failed', err)
      }
    }

    bootstrapNode()
  }, [addPeer, updatePeer])

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatView />
      case 'dashboard':
        return <DashboardView />
      case 'network':
        return <NetworkView />
      case 'models':
        return <ModelsView />
      case 'settings':
        return <SettingsView />
      default:
        return <ChatView />
    }
  }

  return (
    <TooltipProvider>
      <MainLayout>{renderContent()}</MainLayout>
    </TooltipProvider>
  )
}

export default App
