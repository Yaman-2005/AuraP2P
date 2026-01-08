import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, Cpu, RotateCcw, Server } from 'lucide-react'
import { useWSStore } from '@/store/wsStore'
import { useAppStore } from '@/store/appStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Message } from '@/types'
import { ConnectButton } from '@/components/ui/ConnectButton'

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
  const { isConnectedToSwarm } = useAppStore()
  const { activeModel, peers } = useAppStore()

  const [input, setInput] = useState('')
  const [showNoConnectionAnimation, setShowNoConnectionAnimation] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionAdvantages, setConnectionAdvantages] = useState<string[]>([])
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
  }, [messages, isConnecting])

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return

    // If not connected to swarm, show animation in chat
    if (!isConnectedToSwarm) {
      setShowNoConnectionAnimation(true)
      setInput('')
      return
    }

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

  /* ---------- HANDLE CONNECT BUTTON CLICK ---------- */
  const handleConnectClick = async () => {
    if (isConnectedToSwarm) return

    setIsConnecting(true)
    
    // Start showing advantages in sequence
    const advantages = [
      "Throughput will increase by 5x",
      "Connecting to 12+ swarm peers",
      "AI processing speed boosted",
      "Redundancy for reliable inference",
      "Cost reduced by distributed compute",
      "Access to specialized hardware"
    ]

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < advantages.length) {
        setConnectionAdvantages(prev => [...prev, advantages[currentIndex]])
        currentIndex++
      }
    }, 800)

    // Simulate connection process (in real app, this would be actual API calls)
    setTimeout(() => {
      clearInterval(interval)
      setIsConnecting(false)
      setConnectionAdvantages([])
      
      // After connection, show success message
      addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "Connected to swarm! Now powered by distributed AI network.",
        timestamp: new Date(),
      })
    }, 6000)
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
              {isConnectedToSwarm 
                ? `Powered by ${activePeers.length} peers`
                : 'Not connected'
              }
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Custom ConnectButton with onClick handler */}
            <div onClick={handleConnectClick}>
              <ConnectButton />
            </div>
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

          {/* Connecting Animation */}
          <AnimatePresence>
            {isConnecting && (
              <motion.div
                key="connecting-animation"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-start gap-4"
              >
                <div className="relative">
                  <motion.div
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="w-10 h-10 rounded-full border-4 border-cyan-500 border-t-transparent"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Server className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>

                <Card className="flex-1 px-4 py-3 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-cyan-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                      }}
                      className="w-2 h-2 rounded-full bg-cyan-500"
                    />
                    <span className="text-cyan-400 font-medium">
                      Connecting to Swarm Network...
                    </span>
                  </div>

                  {/* Advantages List */}
                  <div className="space-y-2">
                    {connectionAdvantages.map((advantage, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-slate-300"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-sm">{advantage}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Animated progress dots */}
                  <div className="flex gap-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-cyan-500"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* No Connection Animation */}
          <AnimatePresence>
            {showNoConnectionAnimation && (
              <motion.div
                key="no-connection-animation"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onAnimationComplete={() => {
                  setTimeout(() => setShowNoConnectionAnimation(false), 3000)
                }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-600">
                  <Bot />
                </div>

                <Card className="px-4 py-3 max-w-[80%] bg-slate-800/50 border border-red-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="w-6 h-6 rounded-full border-2 border-red-400 border-t-transparent"
                    />
                    <span className="text-red-400 text-sm font-medium">
                      Not connected to swarm
                    </span>
                  </div>
                  
                  <p className="text-slate-300 text-sm">
                    Connect to the swarm network to use AI chat
                  </p>
                </Card>
              </motion.div>
            )}
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
              placeholder="Type your message..."
              className="pr-14 h-14"
              disabled={isGenerating || isConnecting}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              disabled={!input.trim() || isGenerating || isConnecting}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          {isConnecting && (
            <p className="text-center text-cyan-400 text-sm mt-2">
              Connecting to swarm... Please wait
            </p>
          )}
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