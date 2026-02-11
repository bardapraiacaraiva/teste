import { useState, useRef, useEffect } from 'react'
import { AGENTS, type AgentId } from '@/lib/constants'
import { PageHeader } from '@/components/shared/PageHeader'
import { GlassCard } from '@/components/shared/GlassCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useChat } from '@/hooks/useChat'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { AgentAvatar } from '@/components/chat/AgentAvatar'
import { Send, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

const suggestedQuestions = [
  'Qual o prazo para entrega do IES?',
  'Como calcular o IRC a pagar?',
  'Quais os benefícios fiscais SIFIDE?',
  'Duração do período experimental?',
  'Como registar amortizações no SNC?',
  'Taxa de IVA para restauração?',
]

const agentList = Object.values(AGENTS) as (typeof AGENTS)[AgentId][]

export default function ChatPage() {
  const { messages, currentAgent, loading, sendMessage, setAgent, clearMessages } = useChat()
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async () => {
    if (!inputValue.trim()) return
    const text = inputValue
    setInputValue('')
    await sendMessage(text)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question)
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <PageHeader
        title="Consultor IA"
        description="Converse com os nossos especialistas em contabilidade, fiscalidade e recursos humanos."
        icon={<MessageSquare className="h-7 w-7 text-blue-400" />}
      />

      <div className="flex flex-1 gap-6 min-h-0">
        {/* ---------------------------------------------------------------- */}
        {/* LEFT PANEL: Agent selector (hidden on mobile, shown on md+)      */}
        {/* ---------------------------------------------------------------- */}
        <div className="hidden md:flex flex-col gap-3 w-72 shrink-0">
          {agentList.map((agent) => {
            const isActive = currentAgent === agent.id
            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => setAgent(agent.id)}
                className={cn(
                  'rounded-2xl border bg-white/5 backdrop-blur-xl p-4 text-left transition-all duration-200 hover:bg-white/10 cursor-pointer',
                  isActive
                    ? `${agent.borderColor} border-2`
                    : 'border-white/10',
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <AgentAvatar agentId={agent.id} size="md" />
                  <div>
                    <p className="text-sm font-semibold text-white">{agent.name}</p>
                    <Badge variant="secondary" className="text-[10px] mt-0.5">
                      {agent.role}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {agent.description}
                </p>
              </button>
            )
          })}

          {/* Clear conversation button */}
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearMessages}
              className="mt-2 text-slate-400 hover:text-white"
            >
              Limpar conversa
            </Button>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* RIGHT PANEL: Chat area                                           */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          {/* Mobile agent selector (horizontal scroll) */}
          <div className="flex md:hidden gap-2 overflow-x-auto pb-3 mb-3 scrollbar-none">
            {agentList.map((agent) => {
              const isActive = currentAgent === agent.id
              return (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => setAgent(agent.id)}
                  className={cn(
                    'flex items-center gap-2 rounded-xl border bg-white/5 backdrop-blur-xl px-3 py-2 whitespace-nowrap transition-all shrink-0 cursor-pointer',
                    isActive
                      ? `${agent.borderColor} border-2`
                      : 'border-white/10',
                  )}
                >
                  <AgentAvatar agentId={agent.id} size="sm" />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white">{agent.name}</p>
                    <p className="text-[10px] text-slate-400">{agent.role}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Messages area */}
          <GlassCard className="flex-1 flex flex-col min-h-0 p-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && !loading ? (
                /* ---- Empty state: suggested questions ---- */
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="h-16 w-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Como posso ajudar?
                  </h3>
                  <p className="text-sm text-slate-400 mb-6 max-w-md">
                    Selecione um agente ou faça uma pergunta. O sistema deteta automaticamente o especialista mais adequado.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                    {suggestedQuestions.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleSuggestedQuestion(q)}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))}

                  {/* Typing indicator */}
                  {loading && (
                    <div className="flex items-center gap-3">
                      {currentAgent && (
                        <AgentAvatar agentId={currentAgent} size="sm" />
                      )}
                      <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]" />
                          <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
                          <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input bar */}
            <div className="border-t border-white/10 p-3">
              <div className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    currentAgent
                      ? `Pergunte à ${AGENTS[currentAgent].name}...`
                      : 'Escreva a sua pergunta...'
                  }
                  disabled={loading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || loading}
                  size="icon"
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
