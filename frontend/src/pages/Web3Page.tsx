import { PageHeader } from '@/components/shared/PageHeader'
import { GlassCard } from '@/components/shared/GlassCard'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Shield, ExternalLink, Wallet } from 'lucide-react'
import { truncateHash } from '@/lib/utils'

const topStats = [
  { label: 'Transações Auditadas', value: '342', icon: Shield },
  { label: 'Carteiras Monitorizadas', value: '5', icon: Wallet },
  { label: 'RWA Colateralizado', value: '€2.4M', icon: ExternalLink },
]

const auditTrail = [
  { hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', bloco: 19284751, tipo: 'Verificação', data: '2026-02-10 14:32', status: 'Confirmado' },
  { hash: '0x9f8e7d6c5b4a3029182736455463728190abcdef01', bloco: 19284688, tipo: 'Auditoria', data: '2026-02-10 11:15', status: 'Confirmado' },
  { hash: '0x2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d', bloco: 19284512, tipo: 'Colateralização', data: '2026-02-09 16:45', status: 'Confirmado' },
  { hash: '0x4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f', bloco: 19284401, tipo: 'Verificação', data: '2026-02-09 09:22', status: 'Confirmado' },
  { hash: '0x6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b', bloco: 19284290, tipo: 'Auditoria', data: '2026-02-08 17:50', status: 'Confirmado' },
  { hash: '0x8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d', bloco: 19284180, tipo: 'Colateralização', data: '2026-02-08 08:10', status: 'Confirmado' },
]

const wallets = [
  { address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38', label: 'Carteira Principal', balance: '12.5 ETH', chain: 'Ethereum' },
  { address: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72', label: 'Carteira Reservas', balance: '8.2 ETH', chain: 'Ethereum' },
]

const rwaDistribution = [
  { label: 'Imóveis', percent: 40, color: 'bg-blue-500' },
  { label: 'Equipamentos', percent: 25, color: 'bg-emerald-500' },
  { label: 'Recebíveis', percent: 20, color: 'bg-amber-500' },
  { label: 'Outros', percent: 15, color: 'bg-violet-500' },
]

function getTipoBadgeVariant(tipo: string) {
  switch (tipo) {
    case 'Verificação':
      return 'default'
    case 'Auditoria':
      return 'warning'
    case 'Colateralização':
      return 'secondary'
    default:
      return 'outline'
  }
}

export default function Web3Page() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Auditoria Blockchain"
        description="Proof of Reserves & RWA"
        icon="🛡️"
      />

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {topStats.map((stat) => (
          <GlassCard key={stat.label} hover>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
                <stat.icon className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-0.5">{stat.value}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Audit Trail */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-violet-400" />
          <h3 className="text-lg font-semibold text-white">Audit Trail</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Hash</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Bloco</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Tipo</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Data</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {auditTrail.map((entry, idx) => (
                <tr
                  key={idx}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <code className="text-xs text-blue-400 font-mono">{truncateHash(entry.hash)}</code>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-mono text-xs">{entry.bloco.toLocaleString('pt-PT')}</td>
                  <td className="py-3 px-4">
                    <Badge variant={getTipoBadgeVariant(entry.tipo) as 'default' | 'warning' | 'secondary'}>
                      {entry.tipo}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-300 whitespace-nowrap">{entry.data}</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">{entry.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Wallets */}
      <div className="grid md:grid-cols-2 gap-4">
        {wallets.map((wallet) => (
          <GlassCard key={wallet.address} hover>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-blue-400" />
                <h4 className="text-sm font-semibold text-white">{wallet.label}</h4>
              </div>
              <Badge variant="outline">{wallet.chain}</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <code className="text-xs text-slate-400 font-mono">{truncateHash(wallet.address, 10, 8)}</code>
                <ExternalLink className="h-3 w-3 text-slate-500 cursor-pointer hover:text-blue-400 transition-colors" />
              </div>
              <p className="text-xl font-bold text-white">{wallet.balance}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* RWA Distribution */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-white mb-4">Distribuição RWA</h3>
        {/* Stacked bar */}
        <div className="h-8 w-full rounded-full overflow-hidden flex">
          {rwaDistribution.map((segment) => (
            <div
              key={segment.label}
              className={cn('h-full transition-all duration-500', segment.color)}
              style={{ width: `${segment.percent}%` }}
              title={`${segment.label}: ${segment.percent}%`}
            />
          ))}
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4">
          {rwaDistribution.map((segment) => (
            <div key={segment.label} className="flex items-center gap-2">
              <div className={cn('h-3 w-3 rounded-full', segment.color)} />
              <span className="text-sm text-slate-300">{segment.label}</span>
              <span className="text-sm font-semibold text-white">{segment.percent}%</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Selo Auditado */}
      <GlassCard className="text-center">
        <div className="inline-flex flex-col items-center gap-3">
          <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Shield className="h-8 w-8 text-emerald-400" />
          </div>
          <div>
            <Badge variant="success" className="text-sm px-4 py-1">
              Selo L.U.C.A.S Auditado
            </Badge>
            <p className="text-xs text-slate-500 mt-2">Verificação contínua de integridade on-chain</p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
