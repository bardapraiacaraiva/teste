import { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { GlassCard } from '@/components/shared/GlassCard'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { FileText, Search, Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface Document {
  id: number
  nome: string
  tipo: 'Fatura' | 'Balanço' | 'Declaração' | 'Contrato'
  data: string
  status: 'Processado' | 'Pendente' | 'Erro'
}

const documents: Document[] = [
  { id: 1, nome: 'Balancete_Jan2026.pdf', tipo: 'Balanço', data: '2026-02-10', status: 'Processado' },
  { id: 2, nome: 'Fatura_Fornecedor_001.pdf', tipo: 'Fatura', data: '2026-02-09', status: 'Processado' },
  { id: 3, nome: 'Declaração_IVA_Q4.pdf', tipo: 'Declaração', data: '2026-02-08', status: 'Processado' },
  { id: 4, nome: 'Contrato_Trabalho_JS.pdf', tipo: 'Contrato', data: '2026-02-07', status: 'Processado' },
  { id: 5, nome: 'Fatura_Cliente_042.pdf', tipo: 'Fatura', data: '2026-02-06', status: 'Processado' },
  { id: 6, nome: 'Balancete_Dez2025.pdf', tipo: 'Balanço', data: '2026-02-05', status: 'Processado' },
  { id: 7, nome: 'Declaração_IRC_Anual.pdf', tipo: 'Declaração', data: '2026-02-04', status: 'Pendente' },
  { id: 8, nome: 'Fatura_Serviços_TI.pdf', tipo: 'Fatura', data: '2026-02-03', status: 'Pendente' },
]

function getTipoBadgeVariant(tipo: Document['tipo']) {
  switch (tipo) {
    case 'Fatura':
      return 'default'
    case 'Balanço':
      return 'secondary'
    case 'Declaração':
      return 'warning'
    case 'Contrato':
      return 'outline'
  }
}

function getStatusIcon(status: Document['status']) {
  switch (status) {
    case 'Processado':
      return <CheckCircle className="h-3.5 w-3.5 mr-1" />
    case 'Pendente':
      return <Clock className="h-3.5 w-3.5 mr-1" />
    case 'Erro':
      return <AlertCircle className="h-3.5 w-3.5 mr-1" />
  }
}

function getStatusBadgeVariant(status: Document['status']) {
  switch (status) {
    case 'Processado':
      return 'success'
    case 'Pendente':
      return 'warning'
    case 'Erro':
      return 'destructive'
  }
}

export default function DocumentsPage() {
  const [search, setSearch] = useState('')

  const filteredDocs = documents.filter((doc) =>
    doc.nome.toLowerCase().includes(search.toLowerCase()) ||
    doc.tipo.toLowerCase().includes(search.toLowerCase())
  )

  const processados = documents.filter((d) => d.status === 'Processado').length
  const pendentes = documents.filter((d) => d.status === 'Pendente').length

  return (
    <div className="space-y-8">
      <PageHeader
        title="Gestão de Documentos"
        description="Upload e processamento RAG"
        icon="📄"
      />

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input
          placeholder="Pesquisar documentos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Upload Zone */}
      <div
        className={cn(
          'rounded-2xl border-2 border-dashed border-white/20 bg-white/[0.02] p-10',
          'flex flex-col items-center justify-center gap-3 text-center',
          'transition-colors hover:border-blue-500/40 hover:bg-white/5 cursor-pointer'
        )}
      >
        <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <Upload className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">Arraste ficheiros ou clique para upload</p>
          <p className="text-xs text-slate-500 mt-1">PDF, XLSX, CSV - Máximo 25MB</p>
        </div>
      </div>

      {/* Document List */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Documentos</h3>
          </div>
          <p className="text-xs text-slate-400">
            {documents.length} documentos | {processados} processados | {pendentes} pendentes
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Nome</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Tipo</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Data</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="text-white font-medium">{doc.nome}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={getTipoBadgeVariant(doc.tipo) as 'default' | 'secondary' | 'warning' | 'outline'}>
                      {doc.tipo}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-300 whitespace-nowrap">{doc.data}</td>
                  <td className="py-3 px-4">
                    <Badge variant={getStatusBadgeVariant(doc.status) as 'success' | 'warning' | 'destructive'}>
                      {getStatusIcon(doc.status)}
                      {doc.status}
                    </Badge>
                  </td>
                </tr>
              ))}
              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    Nenhum documento encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
