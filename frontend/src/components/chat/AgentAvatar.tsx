import { AGENTS, type AgentId } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface AgentAvatarProps {
  agentId: AgentId
  size?: 'sm' | 'md'
}

export function AgentAvatar({ agentId, size = 'sm' }: AgentAvatarProps) {
  const agent = AGENTS[agentId]

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full border-2 shrink-0',
        agent.borderColor,
        agent.bgColor,
        size === 'sm' && 'h-8 w-8 text-sm',
        size === 'md' && 'h-10 w-10 text-lg',
      )}
    >
      <span role="img" aria-label={agent.name}>
        {agent.emoji}
      </span>
    </div>
  )
}
