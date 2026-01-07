import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/appStore'

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

  const handleConnect = async () => {
    setLoading(true)
    setError(null)

    try {
      // 1️⃣ Go online
      await fetch(`${API_BASE}/go-online`, { method: 'POST' })
      setOnline(true)

      // 2️⃣ Connect to swarm
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
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (isOnline && isConnectedToSwarm) {
    return <div className="text-green-400 text-sm">🟢 Connected to swarm</div>
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleConnect} disabled={loading}>
        {loading ? 'Connecting…' : 'Connect to Swarm'}
      </Button>

      {error && (
        <div className="text-red-400 text-sm">
          ❌ {error}
        </div>
      )}
    </div>
  )
}
