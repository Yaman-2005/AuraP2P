import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, Cpu, RotateCcw } from 'lucide-react'
import { useWSStore } from '@/store/wsStore'
import { useAppStore } from '@/store/appStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Message } from '@/types'

export function ChatView() {
  const {
    messages,
    addMessage,
    clearMessages,
    isGenerating,
    setIsGenerating,
    connect,
    sendPrompt,
  } = useWSStore()

  const { activeModel, peers } = useAppStore()

  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const activePeers = peers.filter((p) => p.status === 'online')

  /* ---------- CONNECT ON MOUNT ---------- */
  useEffect(() => {
    connect()
  }, [connect])

  /* ---------- AUTOSCROLL ---------- */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  /* ---------- SUBMIT ---------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    addMessage(userMessage)

    addMessage({
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    })

    setIsGenerating(true)
    sendPrompt(userMessage.content)
    setInput('')
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              AI Chat
            </h1>
            <p className="text-slate-400 text-sm">
              Powered by {activePeers.length} peers
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeModel && (
              <Badge variant="info">
                <Cpu className="w-3 h-3 mr-1" />
                {activeModel.name}
              </Badge>
            )}
            <Button variant="ghost" size="icon" onClick={clearMessages}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <MessageBubble message={message} />
              </motion.div>
            ))}
          </AnimatePresence>

          {isGenerating && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Bot className="w-4 h-4 text-cyan-400" />
              Generating…
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-6 border-t border-slate-800 bg-slate-900/50">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything…"
              className="pr-14 h-14"
              disabled={isGenerating}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              disabled={!input.trim() || isGenerating}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ---------- MESSAGE ---------- */
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex items-start gap-4', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center',
          isUser ? 'bg-slate-700' : 'bg-cyan-600'
        )}
      >
        {isUser ? <User /> : <Bot />}
      </div>

      <Card className="px-4 py-3 max-w-[80%] bg-slate-800/50">
        <p className="whitespace-pre-wrap text-slate-100">
          {message.content}
        </p>
      </Card>
    </div>
  )
}
