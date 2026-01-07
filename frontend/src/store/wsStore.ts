import { create } from 'zustand'
import type { Message } from '@/types'

interface WSState {
  ws: WebSocket | null
  messages: Message[]
  isGenerating: boolean

  connect: () => void
  sendPrompt: (prompt: string) => void

  addMessage: (message: Message) => void
  setMessages: (updater: (prev: Message[]) => Message[]) => void
  clearMessages: () => void
  setIsGenerating: (v: boolean) => void
}

const WS_URL = 'ws://localhost:8000/chat'

export const useWSStore = create<WSState>((set, get) => ({
  ws: null,
  messages: [],
  isGenerating: false,

  /* ---------- STATE HELPERS ---------- */
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setMessages: (updater) =>
    set((state) => ({ messages: updater(state.messages) })),

  clearMessages: () => set({ messages: [] }),
  setIsGenerating: (v) => set({ isGenerating: v }),

  /* ---------- WS CONNECT ---------- */
  connect: () => {
    if (get().ws) return

    const ws = new WebSocket(WS_URL)

    ws.onopen = () => {
      console.log('🔌 WS connected')
    }

    ws.onmessage = (event) => {
      if (event.data === '__DONE__') {
        get().setIsGenerating(false)
        return
      }

      // STREAM TOKEN
      get().setMessages((prev) => {
        if (prev.length === 0) return prev
        const last = prev[prev.length - 1]
        if (last.role !== 'assistant') return prev

        return [
          ...prev.slice(0, -1),
          { ...last, content: last.content + event.data },
        ]
      })
    }

    ws.onerror = (err) => {
      console.error('❌ WS error', err)
      get().setIsGenerating(false)
    }

    ws.onclose = () => {
      console.warn('🔒 WS closed')
      set({ ws: null, isGenerating: false })
    }

    set({ ws })
  },

  /* ---------- SEND PROMPT ---------- */
  sendPrompt: (prompt) => {
    const ws = get().ws
    if (!ws || ws.readyState !== WebSocket.OPEN) return

    ws.send(JSON.stringify({ prompt }))
  },
}))
