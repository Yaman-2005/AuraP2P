import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, User, Sparkles, Cpu, RotateCcw, Zap, Server } from 'lucide-react'
import { useWSStore } from '@/store/wsStore'
import { useAppStore } from '@/store/appStore'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Message } from '@/types'
import { ConnectButton } from '@/components/ui/ConnectButton'
import Starfield from '@/components/effects/Starfield'
import HorizonGlow from '@/components/effects/HorizonGlow'
import Greeting from '@/components/features/Greeting'
import QuickActions from '@/components/features/QuickActions'
import GlassPromptBox from '@/components/features/GlassPromptBox'

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

  const doSubmit = async () => {
    if (!input.trim() || isGenerating) return

    // If not connected to swarm, show error message and prompt to connect
    if (!isConnectedToSwarm) {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: input.trim(),
        timestamp: new Date(),
      }
      addMessage(userMessage)

      // Show connection failed response
      addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "⚠️ Connection failed. Please connect to the swarm network first using the 'Connect to Swarm' button above, then try again.",
        timestamp: new Date(),
      })
      
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

    // Wait for connection attempt to complete
    setTimeout(() => {
      clearInterval(interval)
      setIsConnecting(false)
      setConnectionAdvantages([])
      
      // Check actual connection status from store
      // Note: Connection is handled by ConnectButton, this just shows visual feedback
    }, 6000)
  }

  // submit handled via GlassPromptBox

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Starfield />
        <HorizonGlow />
      </div>

      <div className="relative z-10 h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 lg:pl-16 border-b border-white/10 glass-elevated"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              AI Chat
            </h1>
            <p className="text-white/50 text-sm">
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
              <Greeting />
              <p className="text-white/50 max-w-md mx-auto mb-8">
                Start chatting with AI powered by your local swarm. Your queries are processed
                across {activePeers.length} connected peers for maximum performance.
              </p>
              {/* Centered prompt input when empty */}
              <div className="mt-10 flex justify-center">
                <div className="w-full max-w-3xl">
                  <GlassPromptBox
                    value={input}
                    onChange={setInput}
                    onSubmit={doSubmit}
                    disabled={isGenerating}
                    placeholder="Ask anything... (processed across your swarm)"
                  />
                  <div className="flex items-center justify-between mt-3 text-xs text-white/50">
                    <span className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-cyan-400" />
                      <span>{activePeers.length} peers ready</span>
                      <span className="text-white/30">•</span>
                      <span>~{(activePeers.reduce((acc, p) => acc + p.throughput, 0)).toFixed(1)} tok/s combined</span>
                    </span>
                    <span>Press Enter to send</span>
                  </div>
                </div>
              </div>

              {/* Quick actions under prompt */}
              <div className="mt-8">
                <QuickActions />
              </div>
            </motion.div>
          )}

          {/* Message list */}
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
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
                    <Server className="w-5 h-5 text-cyan-500" />
                  </div>
                </div>

                <Card className="flex-1 px-4 py-3 glass border border-cyan-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                      }}
                      className="w-2 h-2 rounded-full bg-cyan-400"
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
                        className="flex items-center gap-2 text-white/70"
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
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500">
                  <Bot className="text-white" />
                </div>

                <Card className="px-4 py-3 max-w-[80%] glass border border-red-500/30">
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
                      Connection Failed - Retry Required
                    </span>
                  </div>
                  
                  <p className="text-white/60 text-sm">
                    Failed to connect to the swarm network. Please click 'Connect to Swarm' button to retry.
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {isGenerating && (
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Bot className="w-4 h-4 text-cyan-400" />
              Generating…
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Prompt at bottom when there are messages */}
      {messages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border-t border-white/10 glass-elevated"
        >
          <div className="max-w-4xl mx-auto">
            <GlassPromptBox
              value={input}
              onChange={setInput}
              onSubmit={doSubmit}
              disabled={isGenerating}
              placeholder="Ask anything... (processed across your swarm)"
            />
            <div className="flex items-center justify-between mt-3 text-xs text-white/50">
              <span className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>{activePeers.length} peers ready</span>
                <span className="text-white/30">•</span>
                <span>~{(activePeers.reduce((acc, p) => acc + p.throughput, 0)).toFixed(1)} tok/s combined</span>
              </span>
              <span>Press Enter to send</span>
            </div>
          </div>
        </motion.div>
      )}
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
          isUser ? 'glass border border-white/20' : 'bg-gradient-to-br from-cyan-500 to-violet-500'
        )}
      >
        {isUser ? <User className="text-white" /> : <Bot className="text-white" />}
      </div>

      <Card className="px-4 py-3 max-w-[80%] glass">
        <p className="whitespace-pre-wrap text-white">
          {message.content}
        </p>
      </Card>
    </div>
  )
}