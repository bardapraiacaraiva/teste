import { Menu, Bell } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Badge } from '@/components/ui/badge'

interface TopBarProps {
  onMenuClick: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-white/10 bg-[#0A0E27]/80 backdrop-blur-xl flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-400 hover:text-white transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div>
          <p className="text-sm text-slate-400">Lusaconta + L.U.C.A.S</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant="success">Sistema Operacional</Badge>
        <button className="relative text-slate-400 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-[#0A0E27]" />
        </button>
        <div className="h-8 w-8 rounded-full bg-blue-600/30 flex items-center justify-center text-sm font-bold text-blue-400">
          {user?.name?.charAt(0) || 'U'}
        </div>
      </div>
    </header>
  )
}
