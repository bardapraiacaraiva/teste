import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/shared/Logo'
import {
  LayoutDashboard, Sparkles, MessageSquare, FileText,
  Shield, Heart, Settings, LogOut, X
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const iconMap = {
  LayoutDashboard, Sparkles, MessageSquare, FileText, Shield, Heart, Settings,
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' as const },
  { path: '/oracle', label: 'Oráculo', icon: 'Sparkles' as const },
  { path: '/chat', label: 'Chat IA', icon: 'MessageSquare' as const },
  { path: '/documents', label: 'Documentos', icon: 'FileText' as const },
  { path: '/web3', label: 'Web3 / RWA', icon: 'Shield' as const },
  { path: '/heal', label: 'HEAL', icon: 'Heart' as const },
  { path: '/settings', label: 'Definições', icon: 'Settings' as const },
]

interface SidebarProps {
  open?: boolean
  onClose?: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { logout, user } = useAuth()
  const Icon = ({ name }: { name: keyof typeof iconMap }) => {
    const Comp = iconMap[name]
    return <Comp className="h-5 w-5" />
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 border-r border-white/10 bg-[#0A0E27]/95 backdrop-blur-xl flex flex-col transition-transform duration-300",
        "lg:translate-x-0 lg:static",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <Logo size="md" />
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onClose}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon name={item.icon} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="h-8 w-8 rounded-full bg-blue-600/30 flex items-center justify-center text-sm font-bold text-blue-400">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Utilizador'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.tenant_name || 'Empresa'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Terminar Sessão
          </button>
        </div>
      </aside>
    </>
  )
}
