import { useState, useCallback } from 'react'
import type { AgentId } from '@/lib/constants'
import {
  getAgentResponse,
  detectAgentFromMessage,
  type ChatMessage,
} from '@/services/mock/chatService'

interface UseChatReturn {
  messages: ChatMessage[]
  currentAgent: AgentId | null
  loading: boolean
  sendMessage: (text: string) => Promise<void>
  setAgent: (agentId: AgentId) => void
  clearMessages: () => void
}

let userMsgCounter = 0

function generateUserMsgId(): string {
  userMsgCounter += 1
  return `user-${Date.now()}-${userMsgCounter}`
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentAgent, setCurrentAgent] = useState<AgentId | null>(null)
  const [loading, setLoading] = useState(false)

  const setAgent = useCallback((agentId: AgentId) => {
    setCurrentAgent(agentId)
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return

      // Determine agent: use selected agent or auto-detect from keywords
      const agentId = currentAgent ?? detectAgentFromMessage(text)

      // If no agent was selected, auto-select the detected one
      if (!currentAgent) {
        setCurrentAgent(agentId)
      }

      // Add user message
      const userMessage: ChatMessage = {
        id: generateUserMsgId(),
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setLoading(true)

      try {
        const response = await getAgentResponse(agentId, text)
        setMessages((prev) => [...prev, response])
      } catch {
        // Silently handle errors in mock service
        const errorMessage: ChatMessage = {
          id: generateUserMsgId(),
          role: 'assistant',
          content: 'Desculpe, ocorreu um erro ao processar o seu pedido. Tente novamente.',
          agentId,
          agentName: agentId.charAt(0).toUpperCase() + agentId.slice(1),
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setLoading(false)
      }
    },
    [currentAgent, loading],
  )

  return {
    messages,
    currentAgent,
    loading,
    sendMessage,
    setAgent,
    clearMessages,
  }
}
