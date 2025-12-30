export interface Peer {
  id: string
  name: string
  ip: string
  status: 'online' | 'offline' | 'syncing'
  hardware: {
    type: 'laptop' | 'server' | 'desktop'
    cpu: string
    ram: number // in GB
    vram: number // in GB
    accelerator: 'DirectML' | 'OpenVINO' | 'CUDA' | 'CPU'
  }
  layers: {
    start: number
    end: number
  }
  latency: number // in ms
  throughput: number // tokens/s
  lastSeen: Date
}

export interface Model {
  id: string
  name: string
  size: string
  totalLayers: number
  loadedLayers: number
  status: 'loading' | 'ready' | 'error' | 'idle'
  description: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  tokensPerSecond?: number
  peersUsed?: string[]
}

export interface SwarmStats {
  totalPeers: number
  activePeers: number
  totalVRAM: number
  totalRAM: number
  currentThroughput: number
  averageLatency: number
}

export interface NetworkNode {
  id: string
  name: string
  x: number
  y: number
  status: 'online' | 'offline' | 'syncing'
  isLocal?: boolean
}

export interface NetworkEdge {
  source: string
  target: string
  active: boolean
  latency: number
}
