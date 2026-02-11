import { useState } from 'react'
import type { ChatMessage } from '@/services/mock/chatService'
import type { AgentId } from '@/lib/constants'
import { AgentAvatar } from '@/components/chat/AgentAvatar'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface MessageBubbleProps {
  message: ChatMessage
}

interface CTPSectionProps {
  title: string
  content: string
  borderColorClass: string
  defaultExpanded: boolean
}

function CTPSection({ title, content, borderColorClass, defaultExpanded }: CTPSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <div className={cn('border-l-4 rounded-r-lg', borderColorClass)}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-white/5 transition-colors rounded-r-lg cursor-pointer"
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
        )}
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          {title}
        </span>
      </button>
      {expanded && (
        <div className="px-3 pb-3 text-sm text-slate-300 leading-relaxed">
          {content}
        </div>
      )}
    </div>
  )
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] md:max-w-[70%]">
          <div className="rounded-2xl rounded-br-md border border-white/10 bg-white/10 backdrop-blur-xl px-4 py-3">
            <p className="text-sm text-white leading-relaxed">{message.content}</p>
          </div>
          <p className="text-[10px] text-slate-500 text-right mt-1 mr-1">
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    )
  }

  // Assistant message
  return (
    <div className="flex justify-start gap-3">
      {message.agentId && (
        <AgentAvatar agentId={message.agentId as AgentId} size="sm" />
      )}
      <div className="max-w-[80%] md:max-w-[70%] flex-1 min-w-0">
        {message.agentName && (
          <p className="text-xs font-medium text-slate-400 mb-1 ml-1">
            {message.agentName}
          </p>
        )}
        <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-3">
          {message.ctp ? (
            <div className="space-y-2">
              <CTPSection
                title="Contexto"
                content={message.ctp.contexto}
                borderColorClass="border-blue-500"
                defaultExpanded={false}
              />
              <CTPSection
                title="Pensamento"
                content={message.ctp.pensamento}
                borderColorClass="border-amber-500"
                defaultExpanded={false}
              />
              <CTPSection
                title="Proposta"
                content={message.ctp.proposta}
                borderColorClass="border-emerald-500"
                defaultExpanded={true}
              />
            </div>
          ) : (
            <p className="text-sm text-slate-300 leading-relaxed">{message.content}</p>
          )}
        </div>
        <p className="text-[10px] text-slate-500 mt-1 ml-1">
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  )
}
