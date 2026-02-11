import { PageHeader } from '@/components/shared/PageHeader'
import { GlassCard } from '@/components/shared/GlassCard'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Heart, AlertTriangle, CheckCircle, ThumbsUp, ThumbsDown } from 'lucide-react'

const stats = [
  { label: 'Respostas Validadas', value: '1.247' },
  { label: 'Precisão Média', value: '94.2%' },
  { label: 'Alertas P1', value: '2' },
  { label: 'Correções Aplicadas', value: '38' },
]

const alerts = [
  {
    id: 1,
    message: 'Imprecisão detectada na taxa de derrama municipal para Braga',
    priority: 'P1',
    time: 'Há 2h',
  },
  {
    id: 2,
    message: 'Atualização pendente: Alteração OE 2026 Art. 88º CIRC',
    priority: 'P1',
    time: 'Há 6h',
  },
]

const feedbackLog = [
  { id: 1, data: '2026-02-10', agente: 'Mariana', tipo: 'up', comentario: 'Cálculo IRC correto e bem fundamentado', status: 'Resolvido' },
  { id: 2, data: '2026-02-10', agente: 'Tomé', tipo: 'down', comentario: 'Taxa de derrama incorreta para Braga', status: 'Pendente' },
  { id: 3, data: '2026-02-09', agente: 'Beatriz', tipo: 'up', comentario: 'Análise SNC detalhada e precisa', status: 'Resolvido' },
  { id: 4, data: '2026-02-08', agente: 'Mariana', tipo: 'up', comentario: 'Simulação IVA trimestral validada', status: 'Resolvido' },
  { id: 5, data: '2026-02-07', agente: 'Tomé', tipo: 'down', comentario: 'Referência legislativa desatualizada', status: 'Em Análise' },
]

const agentAccuracy = [
  { name: 'Mariana', accuracy: 96, color: 'bg-blue-500' },
  { name: 'Tomé', accuracy: 93, color: 'bg-emerald-500' },
  { name: 'Beatriz', accuracy: 91, color: 'bg-violet-500' },
]

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'Resolvido':
      return 'success'
    case 'Pendente':
      return 'warning'
    case 'Em Análise':
      return 'default'
    default:
      return 'secondary'
  }
}

export default function HealPage() {
  const healthScore = 92

  return (
    <div className="space-y-8">
      <PageHeader
        title="Sistema HEAL"
        description="Auto-cura e melhoria contínua"
        icon="❤️"
      />

      {/* Health Score + Stats Row */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Circular Health Score */}
        <GlassCard className="lg:col-span-1 flex flex-col items-center justify-center">
          <div className="relative w-36 h-36">
            {/* Background circle */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="url(#healthGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(healthScore / 100) * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
              />
              <defs>
                <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{healthScore}%</span>
              <span className="text-xs text-slate-400 mt-1">Saúde</span>
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-3">System Health</p>
        </GlassCard>

        {/* Stats Cards */}
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <GlassCard key={stat.label} hover>
              <p className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Alerts Section */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <h3 className="text-lg font-semibold text-white">Alertas Ativos</h3>
          <Badge variant="destructive" className="ml-auto">{alerts.length} P1</Badge>
        </div>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20"
            >
              <div className="mt-0.5 shrink-0">
                <AlertTriangle className="h-4 w-4 text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">{alert.message}</p>
                <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
              </div>
              <Badge variant="destructive">P1</Badge>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Feedback Log Table */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <Heart className="h-5 w-5 text-pink-400" />
          <h3 className="text-lg font-semibold text-white">Log de Feedback Recente</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Data</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Agente</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Tipo</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Comentário</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {feedbackLog.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-4 text-slate-300 whitespace-nowrap">{entry.data}</td>
                  <td className="py-3 px-4 text-white font-medium">{entry.agente}</td>
                  <td className="py-3 px-4">
                    {entry.tipo === 'up' ? (
                      <ThumbsUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <ThumbsDown className="h-4 w-4 text-red-400" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-300 max-w-xs truncate">{entry.comentario}</td>
                  <td className="py-3 px-4">
                    <Badge variant={getStatusBadgeVariant(entry.status) as 'success' | 'warning' | 'default'}>
                      {entry.status === 'Resolvido' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {entry.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Agent Accuracy */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-white mb-4">Precisão por Agente</h3>
        <div className="space-y-4">
          {agentAccuracy.map((agent) => (
            <div key={agent.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">{agent.name}</span>
                <span className="text-sm font-semibold text-slate-300">{agent.accuracy}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-700', agent.color)}
                  style={{ width: `${agent.accuracy}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
