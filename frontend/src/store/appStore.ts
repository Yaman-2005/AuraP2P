import { create } from 'zustand'
import type { Peer, Model, Message, SwarmStats } from '@/types'

interface AppState {
  // Peers
  peers: Peer[]
  addPeer: (peer: Peer) => void
  removePeer: (id: string) => void
  updatePeer: (id: string, updates: Partial<Peer>) => void

  // Models
  models: Model[]
  activeModel: Model | null
  setActiveModel: (model: Model | null) => void

  // Chat
  messages: Message[]
  addMessage: (message: Message) => void
  clearMessages: () => void
  isGenerating: boolean
  setIsGenerating: (val: boolean) => void

  // Stats
  stats: SwarmStats

  // UI
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  activeTab: string
  setActiveTab: (tab: string) => void
}

// Mock data for demonstration
const mockPeers: Peer[] = [
  {
    id: 'local-1',
    name: 'RTX Laptop (You)',
    ip: '192.168.1.100',
    status: 'online',
    hardware: {
      type: 'laptop',
      cpu: 'Intel i7-12700H',
      ram: 16,
      vram: 4,
      accelerator: 'DirectML',
    },
    layers: { start: 1, end: 16 },
    latency: 0,
    throughput: 12.5,
    lastSeen: new Date(),
  },
  {
    id: 'server-1',
    name: 'Home Server',
    ip: '192.168.1.101',
    status: 'online',
    hardware: {
      type: 'server',
      cpu: 'Intel i5-7400',
      ram: 32,
      vram: 2,
      accelerator: 'OpenVINO',
    },
    layers: { start: 17, end: 32 },
    latency: 5,
    throughput: 8.3,
    lastSeen: new Date(),
  },
  {
    id: 'desktop-1',
    name: 'Office Desktop',
    ip: '192.168.1.102',
    status: 'syncing',
    hardware: {
      type: 'desktop',
      cpu: 'AMD Ryzen 5 3600',
      ram: 16,
      vram: 8,
      accelerator: 'CUDA',
    },
    layers: { start: 0, end: 0 },
    latency: 12,
    throughput: 0,
    lastSeen: new Date(),
  },
]

const mockModels: Model[] = [
  {
    id: 'phi-3-mini',
    name: 'Phi-3 Mini',
    size: '3.8B',
    totalLayers: 32,
    loadedLayers: 32,
    status: 'ready',
    description: 'Microsoft Phi-3 Mini - Optimized for edge devices',
  },
  {
    id: 'llama-3-8b',
    name: 'Llama 3 8B',
    size: '8B',
    totalLayers: 32,
    loadedLayers: 0,
    status: 'idle',
    description: 'Meta Llama 3 - General purpose LLM',
  },
  {
    id: 'mistral-7b',
    name: 'Mistral 7B',
    size: '7B',
    totalLayers: 32,
    loadedLayers: 0,
    status: 'idle',
    description: 'Mistral AI - High performance open model',
  },
]

export const useAppStore = create<AppState>((set) => ({
  // Peers
  peers: mockPeers,
  addPeer: (peer) => set((state) => ({ peers: [...state.peers, peer] })),
  removePeer: (id) => set((state) => ({ peers: state.peers.filter((p) => p.id !== id) })),
  updatePeer: (id, updates) =>
    set((state) => ({
      peers: state.peers.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  // Models
  models: mockModels,
  activeModel: mockModels[0],
  setActiveModel: (model) => set({ activeModel: model }),

  // Chat
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
  isGenerating: false,
  setIsGenerating: (val) => set({ isGenerating: val }),

  // Stats
  stats: {
    totalPeers: 3,
    activePeers: 2,
    totalVRAM: 14,
    totalRAM: 64,
    currentThroughput: 20.8,
    averageLatency: 8.5,
  },

  // UI
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  activeTab: 'chat',
  setActiveTab: (tab) => set({ activeTab: tab }),
}))
