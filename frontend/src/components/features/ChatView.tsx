import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, Cpu, Zap, RotateCcw } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Message } from '@/types'

export function ChatView() {
  const { messages, addMessage, isGenerating, setIsGenerating, activeModel, peers, clearMessages } = useAppStore()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const activePeers = peers.filter(p => p.status === 'online')

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    addMessage(userMessage)
    setInput('')
    setIsGenerating(true)

    // Simulate AI response with typing effect
    setTimeout(() => {
      const responses = [
        "I'm processing your request across the distributed swarm. The RTX Laptop handled layers 1-16, and the Home Server processed layers 17-32. Here's what I found...\n\nBased on my analysis, I can help you with that. The decentralized architecture allows me to leverage multiple nodes for faster inference while maintaining low latency.",
        "Interesting question! Let me think about this across the swarm nodes...\n\nAfter processing through the distributed pipeline, I believe the answer involves understanding how BitTorrent-style sharding can be applied to AI inference. Each node contributes its compute resources.",
        "Great topic! Processing across 2 active peers...\n\nThe beauty of AuraP2P is that even older hardware can contribute meaningfully to AI inference. By splitting model layers across devices, we can run models that would be impossible on any single device.",
      ]

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        tokensPerSecond: 18.5 + Math.random() * 5,
        peersUsed: activePeers.map(p => p.name),
      }

      addMessage(aiMessage)
      setIsGenerating(false)
    }, 2000 + Math.random() * 1500)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              AI Chat
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Powered by distributed inference across {activePeers.length} peers
            </p>
          </div>
          <div className="flex items-center gap-3">
            {activeModel && (
              <Badge variant="info" pulse>
                <Cpu className="w-3 h-3 mr-1" />
                {activeModel.name}
              </Badge>
            )}
            <Button variant="ghost" size="icon" onClick={clearMessages}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Welcome message when empty */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <motion.div
                className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30"
                animate={{ 
                  boxShadow: [
                    '0 25px 50px -12px rgba(6, 182, 212, 0.3)',
                    '0 25px 50px -12px rgba(6, 182, 212, 0.5)',
                    '0 25px 50px -12px rgba(6, 182, 212, 0.3)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Bot className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-3">Welcome to AuraP2P</h2>
              <p className="text-slate-400 max-w-md mx-auto mb-8">
                Start chatting with AI powered by your local swarm. Your queries are processed
                across {activePeers.length} connected peers for maximum performance.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {['Explain quantum computing', 'Write a Python script', 'Help me learn React'].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    onClick={() => setInput(suggestion)}
                    className="text-sm"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Message list */}
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <MessageBubble message={message} />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <Card className="px-4 py-3 bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="flex gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-2 h-2 rounded-full bg-cyan-400"
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </motion.div>
                  <span className="text-sm text-slate-400 ml-2">
                    Processing across swarm...
                  </span>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border-t border-slate-800 bg-slate-900/50 backdrop-blur-xl"
      >
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything... (processed across your swarm)"
              className="pr-14 h-14 text-base"
              disabled={isGenerating}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10"
              disabled={!input.trim() || isGenerating}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>{activePeers.length} peers ready</span>
              <span className="text-slate-700">•</span>
              <span>~{(activePeers.reduce((acc, p) => acc + p.throughput, 0)).toFixed(1)} tok/s combined</span>
            </span>
            <span>Press Enter to send</span>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex items-start gap-4', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center shadow-lg',
          isUser
            ? 'bg-slate-700'
            : 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/30'
        )}
      >
        {isUser ? (
          <User className="w-5 h-5 text-slate-300" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>
      <div className={cn('flex-1 max-w-[80%]', isUser && 'flex flex-col items-end')}>
        <Card
          className={cn(
            'px-4 py-3',
            isUser
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-cyan-500/30'
              : 'bg-slate-800/50'
          )}
        >
          <p className="text-slate-100 whitespace-pre-wrap">{message.content}</p>
        </Card>
        <div className={cn('flex items-center gap-2 mt-2 text-xs text-slate-500', isUser && 'flex-row-reverse')}>
          <span>{message.timestamp.toLocaleTimeString()}</span>
          {message.tokensPerSecond && (
            <>
              <span className="text-slate-700">•</span>
              <span className="text-cyan-400">{message.tokensPerSecond.toFixed(1)} tok/s</span>
            </>
          )}
          {message.peersUsed && message.peersUsed.length > 0 && (
            <>
              <span className="text-slate-700">•</span>
              <span>via {message.peersUsed.join(', ')}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
