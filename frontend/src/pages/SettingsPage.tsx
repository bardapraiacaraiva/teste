import { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { GlassCard } from '@/components/shared/GlassCard'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { Settings, Building2, Bell, CreditCard } from 'lucide-react'

interface NotificationSetting {
  id: string
  label: string
  defaultOn: boolean
}

const notificationSettings: NotificationSetting[] = [
  { id: 'email_fiscal', label: 'Alertas fiscais por email', defaultOn: true },
  { id: 'sms_prazos', label: 'SMS para prazos críticos', defaultOn: false },
  { id: 'alertas_5dias', label: 'Alertas 5 dias antes de deadlines', defaultOn: true },
  { id: 'alteracoes_leg', label: 'Notificações de alterações legislativas', defaultOn: true },
]

export default function SettingsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    Object.fromEntries(notificationSettings.map((n) => [n.id, n.defaultOn]))
  )

  const toggleNotification = (id: string) => {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Definições"
        icon="⚙️"
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile Section */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-5">
            <Settings className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Perfil</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider">Nome</label>
              <p className="text-sm text-white mt-1 p-3 rounded-lg bg-white/5 border border-white/10">
                {user?.name || 'Utilizador Demo'}
              </p>
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider">Email</label>
              <p className="text-sm text-white mt-1 p-3 rounded-lg bg-white/5 border border-white/10">
                {user?.email || 'demo@lusaconta.pt'}
              </p>
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider">Função</label>
              <p className="text-sm text-white mt-1 p-3 rounded-lg bg-white/5 border border-white/10 capitalize">
                {user?.role || 'Owner'}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Company Section */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-5">
            <Building2 className="h-5 w-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Empresa</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider">Nome da Empresa</label>
              <p className="text-sm text-white mt-1 p-3 rounded-lg bg-white/5 border border-white/10">
                {user?.tenant_name || 'Empresa Demo Lusaconta'}
              </p>
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider">NIF</label>
              <p className="text-sm text-white mt-1 p-3 rounded-lg bg-white/5 border border-white/10">
                509 123 456
              </p>
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider">Segmento</label>
              <p className="text-sm text-white mt-1 p-3 rounded-lg bg-white/5 border border-white/10">
                PME - Serviços de Tecnologia
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Notifications Section */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-5">
          <Bell className="h-5 w-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-white">Notificações</h3>
        </div>
        <div className="space-y-4">
          {notificationSettings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <span className="text-sm text-white">{setting.label}</span>
              <button
                onClick={() => toggleNotification(setting.id)}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300',
                  notifications[setting.id] ? 'bg-blue-600' : 'bg-white/20'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 rounded-full bg-white transition-transform duration-300 shadow-sm',
                    notifications[setting.id] ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Plan Section */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-5">
          <CreditCard className="h-5 w-5 text-violet-400" />
          <h3 className="text-lg font-semibold text-white">Plano</h3>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-blue-500/10 border border-white/10">
          <div>
            <h4 className="text-lg font-bold text-white">Professional</h4>
            <p className="text-sm text-slate-400 mt-0.5">Faturação mensal</p>
          </div>
          <div className="text-right flex items-center gap-3">
            <div>
              <p className="text-2xl font-bold text-white">€249<span className="text-sm font-normal text-slate-400">/mês</span></p>
            </div>
            <Badge variant="success" className="text-xs">ATIVO</Badge>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
