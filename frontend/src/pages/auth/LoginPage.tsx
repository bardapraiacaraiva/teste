import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { GlassCard } from '@/components/shared/GlassCard'
import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Mail, Lock, TrendingUp, Network, Brain, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const ok = await login(email, password)
      if (ok) navigate('/')
    } catch {
      setError('Credenciais invalidas')
    } finally {
      setLoading(false)
    }
  }

  const features = [
    { icon: TrendingUp, label: 'Oráculo Fiscal Preditivo', desc: 'Monte Carlo com 10.000 cenários' },
    { icon: Network, label: 'Rede Colmeia de Inteligência', desc: 'Insights coletivos anonimizados' },
    { icon: Brain, label: 'Ressonância Límbica', desc: 'Análise emocional adaptativa' },
    { icon: ShieldCheck, label: 'Sistema Auto-Cura HEAL', desc: 'Melhoria contínua automática' },
  ]

  return (
    <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
      {/* Left Column */}
      <div className="hidden lg:block space-y-8">
        <Logo size="lg" />
        <div>
          <h1 className="text-3xl font-bold text-white leading-tight">
            Bem-vindo à<br />
            <span className="bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
              Singularidade Contabilística
            </span>
          </h1>
          <p className="text-slate-400 mt-3">
            Inteligência Artificial + 42 Anos de Excelência
          </p>
        </div>

        <div className="space-y-4">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-3 text-slate-300">
              <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 mt-0.5">
                <f.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{f.label}</p>
                <p className="text-xs text-slate-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Badge variant="warning">TOP 5 PME Portugal | 42 Anos</Badge>
      </div>

      {/* Right Column */}
      <GlassCard className="w-full max-w-md mx-auto">
        <div className="lg:hidden mb-6 text-center">
          <Logo size="lg" className="justify-center" />
          <p className="text-sm text-slate-400 mt-2">Singularidade Contabilística</p>
        </div>

        <h2 className="text-xl font-semibold text-white mb-6">Iniciar Sessão</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.pt"
                className="pl-10"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Palavra-passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'A entrar...' : 'Entrar na Singularidade'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Ainda não tem conta?{' '}
          <Link to="/signup" className="text-blue-400 hover:underline">Criar conta</Link>
        </div>
      </GlassCard>
    </div>
  )
}
