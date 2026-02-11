import { PageHeader } from '@/components/shared/PageHeader'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { GlassCard } from '@/components/shared/GlassCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Receipt, Wallet, Sparkles, MessageSquare, FileText, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const revenueData = [
  { month: 'Jul', receita: 42000, despesas: 28000 },
  { month: 'Ago', receita: 38000, despesas: 26000 },
  { month: 'Set', receita: 45000, despesas: 30000 },
  { month: 'Out', receita: 51000, despesas: 32000 },
  { month: 'Nov', receita: 55000, despesas: 34000 },
  { month: 'Dez', receita: 62000, despesas: 38000 },
  { month: 'Jan', receita: 58000, despesas: 36000 },
]

const recentActivity = [
  { id: 1, type: 'chat', text: 'Consulta IRC com Tomé', time: 'Há 2h', agent: 'Tomé' },
  { id: 2, type: 'doc', text: 'Balancete Janeiro processado', time: 'Há 5h', agent: null },
  { id: 3, type: 'oracle', text: 'Simulação Monte Carlo executada', time: 'Há 1d', agent: null },
  { id: 4, type: 'chat', text: 'Análise SNC com Mariana', time: 'Há 2d', agent: 'Mariana' },
]

export default function DashboardPage() {
  const navigate = useNavigate()

  const stats = [
    { title: 'Receita Mensal', value: '€58.000', change: 5.5, icon: TrendingUp, color: '#10b981' },
    { title: 'Despesas', value: '€36.000', change: -2.1, icon: TrendingDown, color: '#ef4444' },
    { title: 'IVA Estimado', value: '€4.620', change: 3.2, icon: Receipt, color: '#f59e0b' },
    { title: 'Lucro Líquido', value: '€17.380', change: 8.7, icon: Wallet, color: '#2563eb' },
  ]

  const quickActions = [
    { label: 'Simulação Oráculo', icon: Sparkles, path: '/oracle', color: '#f59e0b' },
    { label: 'Nova Consulta IA', icon: MessageSquare, path: '/chat', color: '#2563eb' },
    { label: 'Upload Documento', icon: FileText, path: '/documents', color: '#10b981' },
    { label: 'Auditoria Web3', icon: Shield, path: '/web3', color: '#8b5cf6' },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard Executivo"
        description="Visão geral do seu negócio"
        icon="📊"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <GlassCard className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">Evolução Receita vs Despesas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1f3a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f8fafc' }}
                  formatter={(value: number) => [`€${value.toLocaleString('pt-PT')}`, '']}
                />
                <Area type="monotone" dataKey="receita" stroke="#2563eb" fill="url(#colorReceita)" strokeWidth={2} name="Receita" />
                <Area type="monotone" dataKey="despesas" stroke="#ef4444" fill="url(#colorDespesas)" strokeWidth={2} name="Despesas" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Recent Activity */}
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">Atividade Recente</h3>
          <div className="space-y-3">
            {recentActivity.map(a => (
              <div key={a.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                <div className="h-2 w-2 rounded-full bg-blue-400 mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{a.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">{a.time}</span>
                    {a.agent && <Badge variant="secondary">{a.agent}</Badge>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map(a => (
            <button
              key={a.label}
              onClick={() => navigate(a.path)}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 text-center transition-all duration-300 hover:bg-white/10 hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${a.color}20` }}>
                <a.icon className="h-6 w-6" style={{ color: a.color }} />
              </div>
              <p className="text-sm font-medium text-white">{a.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
