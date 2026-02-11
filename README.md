# L.U.C.A.S v2.0 - Lusaconta AI SaaS

Sistema de Inteligencia Artificial para Contabilidade e Fiscalidade Portuguesa.

## Stack Tecnologica

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS + shadcn/ui + Recharts
- **Backend**: Python FastAPI + Motor Monte Carlo (numpy/scipy)
- **Base de Dados**: PostgreSQL + pgvector (Supabase-ready)

## Como Executar

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

## Funcionalidades

- Autenticacao Multi-Tenant com RLS
- Oraculo Fiscal (Simulacao Monte Carlo 10.000 cenarios)
- Chat IA Multi-Agente (Mariana, Tome, Beatriz)
- Sistema HEAL (Auto-Cura)
- Dashboard Web3/RWA
- Gestao de Documentos com RAG
