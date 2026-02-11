import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { GlassCard } from '@/components/shared/GlassCard'
import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Lock, Building2, Hash } from 'lucide-react'

export default function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '', nif: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.nif.length !== 9 || !/^\d{9}$/.test(form.nif)) {
      setError('NIF deve ter exatamente 9 dígitos')
      return
    }
    if (form.password.length < 8) {
      setError('Password deve ter pelo menos 8 caracteres')
      return
    }
    setLoading(true)
    try {
      const ok = await signup(form)
      if (ok) navigate('/')
    } catch {
      setError('Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { key: 'name', label: 'Nome Completo', type: 'text', placeholder: 'João Silva', icon: User },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'seu@email.pt', icon: Mail },
    { key: 'password', label: 'Palavra-passe', type: 'password', placeholder: '••••••••', icon: Lock },
    { key: 'company', label: 'Nome da Empresa', type: 'text', placeholder: 'Empresa Lda', icon: Building2 },
    { key: 'nif', label: 'NIF (9 dígitos)', type: 'text', placeholder: '123456789', icon: Hash },
  ]

  return (
    <GlassCard className="w-full max-w-md">
      <div className="mb-6 text-center">
        <Logo size="lg" className="justify-center" />
        <p className="text-sm text-slate-400 mt-2">Criar Nova Conta</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(f => (
          <div key={f.key} className="space-y-2">
            <Label htmlFor={f.key}>{f.label}</Label>
            <div className="relative">
              <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                id={f.key}
                type={f.type}
                placeholder={f.placeholder}
                className="pl-10"
                value={form[f.key as keyof typeof form]}
                onChange={set(f.key)}
                required
              />
            </div>
          </div>
        ))}

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? 'A criar...' : 'Criar Conta'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-400">
        Já tem conta?{' '}
        <Link to="/login" className="text-blue-400 hover:underline">Iniciar sessão</Link>
      </div>
    </GlassCard>
  )
}
