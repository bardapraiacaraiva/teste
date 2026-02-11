export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export type AgentId = 'mariana' | 'tome' | 'beatriz'

export interface Agent {
  id: AgentId
  name: string
  role: string
  description: string
  emoji: string
  color: string
  borderColor: string
  bgColor: string
  keywords: string[]
}

export const AGENTS: Record<AgentId, Agent> = {
  mariana: {
    id: 'mariana',
    name: 'Mariana',
    role: 'Contabilidade',
    description: 'Especialista em SNC, demonstrações financeiras, balancetes e amortizações.',
    emoji: '📊',
    color: '#2563eb',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-500/20',
    keywords: ['balanço', 'balancete', 'snc', 'demonstração', 'contabilidade', 'amortização', 'amortizações', 'ativo', 'passivo', 'capital', 'registar', 'lançamento'],
  },
  tome: {
    id: 'tome',
    name: 'Tomé',
    role: 'Fiscalidade',
    description: 'Especialista em IRC, IVA, IRS, benefícios fiscais e prazos declarativos.',
    emoji: '⚖️',
    color: '#f59e0b',
    borderColor: 'border-amber-500',
    bgColor: 'bg-amber-500/20',
    keywords: ['iva', 'irc', 'irs', 'imposto', 'fiscal', 'dedução', 'sifide', 'rfai', 'ies', 'taxa', 'tributação', 'benefício'],
  },
  beatriz: {
    id: 'beatriz',
    name: 'Beatriz',
    role: 'Recursos Humanos',
    description: 'Especialista em legislação laboral, segurança social e processamento salarial.',
    emoji: '👥',
    color: '#10b981',
    borderColor: 'border-emerald-500',
    bgColor: 'bg-emerald-500/20',
    keywords: ['salário', 'férias', 'contrato', 'funcionário', 'segurança social', 'período experimental', 'subsídio', 'trabalho', 'laboral', 'despedimento'],
  },
}
