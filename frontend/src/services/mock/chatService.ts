import { AGENTS, type AgentId } from '@/lib/constants'

export interface CTPResponse {
  contexto: string
  pensamento: string
  proposta: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  agentId?: string
  agentName?: string
  ctp?: CTPResponse
  timestamp: Date
}

// ---------------------------------------------------------------------------
// Pre-built responses per agent (3-5 each, real Portuguese accounting content)
// ---------------------------------------------------------------------------

const marianaResponses: { keywords: string[]; ctp: CTPResponse }[] = [
  {
    keywords: ['balancete', 'balanço'],
    ctp: {
      contexto:
        'O balancete é um mapa contabilístico que lista todos os saldos das contas do razão num determinado período, sendo obrigatório nos termos do SNC (Sistema de Normalização Contabilística) aprovado pelo Decreto-Lei n.º 158/2009.',
      pensamento:
        'Para preparar o balancete mensal, é necessário verificar se todos os lançamentos do período estão registados, incluindo acréscimos e diferimentos. Devemos assegurar que o total dos débitos iguala o total dos créditos e que as contas de classe 6 (gastos) e classe 7 (rendimentos) refletem corretamente a atividade do mês.',
      proposta:
        'Recomendo a extração do balancete analítico com data de fecho do período pretendido. Verifique as seguintes classes: Classe 1 (Meios Financeiros Líquidos), Classe 2 (Contas a Receber e a Pagar), Classe 3 (Inventários), Classe 4 (Investimentos) e Classes 6/7 para gastos e rendimentos. Se encontrar desvios, confirme os lançamentos de regularização pendentes.',
    },
  },
  {
    keywords: ['snc', 'norma', 'contabilidade'],
    ctp: {
      contexto:
        'O SNC (Sistema de Normalização Contabilística) é o referencial contabilístico aplicável em Portugal desde 2010, substituindo o antigo POC. Está alinhado com as Normas Internacionais de Contabilidade (IAS/IFRS) e compreende 28 NCRF (Normas Contabilísticas e de Relato Financeiro).',
      pensamento:
        'A escolha da NCRF aplicável depende do tipo de operação. Para microentidades aplica-se a NC-ME, para pequenas entidades a NCRF-PE, e para entidades do setor não lucrativo a NCRF-ESNL. É fundamental classificar corretamente a entidade para aplicar o normativo adequado.',
      proposta:
        'Para uma correta aplicação do SNC, sugiro: 1) Classificar a entidade por dimensão (micro, pequena ou geral) conforme os limites do artigo 9.º do DL 158/2009; 2) Adotar o código de contas correspondente; 3) Preparar as demonstrações financeiras obrigatórias — Balanço, Demonstração de Resultados e Anexo (para microentidades, apenas Balanço e DR simplificados).',
    },
  },
  {
    keywords: ['amortização', 'amortizações', 'depreciação'],
    ctp: {
      contexto:
        'As depreciações e amortizações representam o desgaste dos ativos fixos tangíveis e intangíveis ao longo da sua vida útil, reguladas pela NCRF 7 (Ativos Fixos Tangíveis) e NCRF 6 (Ativos Intangíveis), e fiscalmente pelo Decreto Regulamentar n.º 25/2009.',
      pensamento:
        'O método mais utilizado em Portugal é o da linha reta (quotas constantes). As taxas fiscais máximas estão definidas no DR 25/2009: equipamento informático 33,33%, viaturas ligeiras 25%, edifícios 2-5%, equipamento básico 12,5-20%. Para efeitos contabilísticos, a vida útil real pode diferir da fiscal.',
      proposta:
        'Para registar amortizações no SNC: debitar a conta 64x (Gastos de Depreciação e Amortização) por contrapartida da conta 438/448 (Depreciações/Amortizações Acumuladas). Exemplo: computador adquirido por €1.200 com vida útil de 3 anos → amortização anual de €400. Lançamento: D 6420 / C 4382 pelo valor de €400. Recomendo manter o mapa de depreciações atualizado mensalmente.',
    },
  },
  {
    keywords: ['demonstração', 'resultado', 'financeira'],
    ctp: {
      contexto:
        'A Demonstração de Resultados (DR) é uma das peças fundamentais das demonstrações financeiras obrigatórias pelo SNC, evidenciando os rendimentos e gastos do período e o respetivo resultado líquido.',
      pensamento:
        'A DR por naturezas (modelo mais usado em Portugal) organiza os gastos e rendimentos pela sua natureza: vendas e serviços prestados (classe 7), CMVMC, fornecimentos e serviços externos, gastos com pessoal, depreciações, gastos financeiros, e imposto sobre o rendimento. O resultado líquido do período é a última linha.',
      proposta:
        'Para preparar a DR, siga esta estrutura: Vendas e Serviços Prestados (+), Subsídios à Exploração (+), Variação nos Inventários da Produção (+/-), CMVMC (-), FSE (-), Gastos com Pessoal (-) = EBITDA. Depois subtraia Depreciações/Amortizações = EBIT. Subtraia Gastos Financeiros Líquidos = RAI. Aplique o IRC estimado (21% taxa normal) = Resultado Líquido do Período.',
    },
  },
  {
    keywords: ['lançamento', 'registar', 'ativo', 'passivo'],
    ctp: {
      contexto:
        'Os lançamentos contabilísticos no SNC seguem o método das partidas dobradas e devem ser classificados de acordo com o Código de Contas previsto na Portaria n.º 218/2015.',
      pensamento:
        'Cada operação económica requer pelo menos um débito e um crédito de igual valor. A classificação correta das contas é essencial para a fiabilidade das demonstrações financeiras. As contas de classe 1-5 são patrimoniais (Balanço) e as de classe 6-7 são de resultados (DR).',
      proposta:
        'Exemplos práticos de lançamentos: 1) Compra de mercadorias a crédito: D 312 (Compras de Mercadorias) / C 221 (Fornecedores c/c); 2) Recebimento de cliente: D 12 (Depósitos à Ordem) / C 211 (Clientes c/c); 3) Pagamento de renda: D 6261 (Rendas e Alugueres) / C 12 (Depósitos à Ordem). Lembre-se de incluir sempre o IVA nas operações sujeitas.',
    },
  },
]

const tomeResponses: { keywords: string[]; ctp: CTPResponse }[] = [
  {
    keywords: ['irc', 'taxa'],
    ctp: {
      contexto:
        'O IRC (Imposto sobre o Rendimento das Pessoas Coletivas) incide sobre o lucro tributável das empresas. A taxa geral é de 21%, mas existem regimes especiais: PME pagam 17% sobre os primeiros €50.000 de matéria coletável, e a Derrama Municipal pode adicionar até 1,5%.',
      pensamento:
        'Para calcular o IRC a pagar, é necessário partir do resultado contabilístico e efetuar as correções fiscais previstas no CIRC (Código do IRC): acrescer gastos não aceites fiscalmente (multas, depreciações excessivas, etc.) e deduzir benefícios fiscais. Os pagamentos por conta trimestrais (julho, setembro e dezembro) devem ser considerados.',
      proposta:
        'Cálculo simplificado do IRC: 1) Resultado Líquido Contabilístico → 2) + Correções fiscais positivas (art.º 23.º e seguintes CIRC) → 3) - Correções fiscais negativas → 4) = Matéria Coletável → 5) × 17% (primeiros €50k se PME) + 21% (excedente) → 6) - Pagamentos por conta já efetuados = IRC a pagar/recuperar. Prazo de entrega: Modelo 22 até 31 de maio (ou 5.º mês após fecho do exercício).',
    },
  },
  {
    keywords: ['iva', 'taxa', 'restauração'],
    ctp: {
      contexto:
        'O IVA (Imposto sobre o Valor Acrescentado) em Portugal tem três taxas: taxa normal de 23% (continente), taxa intermédia de 13% e taxa reduzida de 6%. Nas Regiões Autónomas, as taxas são inferiores: Açores (16%, 9%, 4%) e Madeira (22%, 12%, 5%).',
      pensamento:
        'A classificação correta da taxa de IVA é fundamental. A restauração beneficia da taxa intermédia de 13% para alimentação e bebidas não alcoólicas (Lista II do CIVA). Bebidas alcoólicas na restauração estão sujeitas a 23%. Produtos alimentares essenciais (pão, leite, fruta) beneficiam de 6%.',
      proposta:
        'Resumo das taxas de IVA aplicáveis: 1) Taxa normal 23%: regra geral para bens e serviços; 2) Taxa intermédia 13%: restauração (alimentação), conservas, óleos alimentares, entradas em espetáculos; 3) Taxa reduzida 6%: produtos alimentares essenciais, livros, jornais, medicamentos, transporte de passageiros, alojamento. Atenção: a declaração periódica de IVA é mensal (volume de negócios > €650.000) ou trimestral.',
    },
  },
  {
    keywords: ['sifide', 'rfai', 'benefício', 'fiscal'],
    ctp: {
      contexto:
        'Portugal oferece benefícios fiscais relevantes para empresas que investem em I&D e na economia. O SIFIDE II (Sistema de Incentivos Fiscais à I&D Empresarial) permite deduzir ao IRC entre 32,5% e 82,5% das despesas de investigação e desenvolvimento. O RFAI (Regime Fiscal de Apoio ao Investimento) deduz até 25% do investimento em ativos fixos.',
      pensamento:
        'O SIFIDE II permite uma taxa base de 32,5% sobre a despesa total em I&D + taxa incremental de 50% sobre o acréscimo face à média dos dois anos anteriores, até ao limite de €1.500.000. O RFAI aplica-se a investimentos em regiões elegíveis e permite deduzir 25% dos primeiros €15M e 10% do excedente. Ambos requerem candidatura prévia e certificação.',
      proposta:
        'Para maximizar os benefícios fiscais, recomendo: 1) SIFIDE II — identificar todas as despesas elegíveis (pessoal afeto a I&D, aquisição de patentes, despesas com participação em projetos de I&D), submeter candidatura à ANI até maio; 2) RFAI — verificar se o investimento é em região elegível e se cumpre os requisitos de criação de emprego; 3) Considerar também o DLRR (Dedução por Lucros Retidos e Reinvestidos) para PME — dedução de 10% dos lucros retidos e reinvestidos em ativos elegíveis.',
    },
  },
  {
    keywords: ['ies', 'prazo', 'declaração', 'entrega'],
    ctp: {
      contexto:
        'A IES (Informação Empresarial Simplificada) é uma obrigação declarativa anual que agrega informação contabilística, fiscal e estatística. Substitui várias declarações anteriormente exigidas por diferentes entidades (AT, INE, Banco de Portugal, DGEEC).',
      pensamento:
        'A IES deve ser entregue por via eletrónica no Portal das Finanças até ao 15.º dia do 7.º mês posterior ao termo do período de tributação. Para empresas com período de tributação coincidente com o ano civil (janeiro a dezembro), o prazo é 15 de julho. O não cumprimento implica coimas entre €150 e €3.750.',
      proposta:
        'Calendário fiscal completo: 1) IES/DA: até 15 de julho; 2) Modelo 22 IRC: até 31 de maio; 3) Modelo 3 IRS: 1 abril a 30 junho; 4) Declaração periódica IVA: até dia 10 do 2.º mês seguinte (mensal) ou até dia 15 do 2.º mês seguinte ao trimestre; 5) DMR (Declaração Mensal de Remunerações): até dia 10 do mês seguinte; 6) Pagamentos por conta IRC: julho, setembro e 15 de dezembro.',
    },
  },
  {
    keywords: ['irs', 'imposto', 'dedução', 'fiscal'],
    ctp: {
      contexto:
        'O IRS (Imposto sobre o Rendimento das Pessoas Singulares) incide sobre os rendimentos dos contribuintes residentes em Portugal. Existem 9 escalões progressivos, de 13,25% a 48%, mais a taxa adicional de solidariedade de 2,5% (rendimentos > €80.000) e 5% (rendimentos > €250.000).',
      pensamento:
        'As deduções à coleta são essenciais para reduzir o IRS: despesas gerais familiares (35%, max €250/titular), saúde (15%, max €1.000), educação (30%, max €800), imóveis (15% de rendas, max €502), lares (25%, max €403,75). O e-fatura deve estar atualizado para validação automática. Trabalhadores independentes podem optar pelo regime simplificado ou contabilidade organizada.',
      proposta:
        'Para otimizar o IRS dos seus clientes, recomendo: 1) Verificar todas as faturas no e-fatura e classificar corretamente os setores (saúde, educação, etc.); 2) Para trabalhadores independentes, avaliar se a contabilidade organizada é mais vantajosa que o regime simplificado (coeficientes de 0,75 para serviços e 0,15 para vendas); 3) Considerar entregas ao PPR para dedução de 20% (max €400 até 35 anos, €350 até 50 anos, €300 acima de 50 anos); 4) Prazo de entrega: 1 de abril a 30 de junho.',
    },
  },
]

const beatrizResponses: { keywords: string[]; ctp: CTPResponse }[] = [
  {
    keywords: ['subsídio', 'férias'],
    ctp: {
      contexto:
        'O subsídio de férias é uma prestação obrigatória prevista no Código do Trabalho (artigos 237.º a 247.º). O trabalhador tem direito a um período anual de férias retribuídas de 22 dias úteis, com direito a subsídio de férias de valor igual à retribuição base e outras prestações retributivas.',
      pensamento:
        'O subsídio de férias deve ser pago antes do início do período de férias ou, por acordo, proporcionalmente em duodécimos ao longo do ano. Para trabalhadores admitidos no ano civil, o direito a férias é de 2 dias úteis por cada mês completo de trabalho. A retribuição do subsídio inclui a retribuição base e as diuturnidades, mas exclui subsídio de alimentação.',
      proposta:
        'Cálculo do subsídio de férias: Retribuição Base + Diuturnidades = valor mensal do subsídio. Exemplo: salário base €1.200 + diuturnidade €50 = €1.250 de subsídio de férias. Para trabalhadores em duodécimos: €1.250 / 12 = €104,17/mês. Atenção: em caso de cessação de contrato, o trabalhador tem direito à proporção de férias e subsídio não gozados. Incidência de Segurança Social: 34,75% (23,75% entidade empregadora + 11% trabalhador).',
    },
  },
  {
    keywords: ['segurança social', 'contribuição', 'taxa'],
    ctp: {
      contexto:
        'O regime geral de Segurança Social para trabalhadores por conta de outrem prevê uma taxa contributiva global de 34,75%, repartida entre a entidade empregadora (23,75%) e o trabalhador (11%). Esta taxa aplica-se sobre a remuneração base e outras prestações retributivas regulares.',
      pensamento:
        'A base de incidência contributiva inclui: retribuição base, diuturnidades, subsídio de férias, subsídio de Natal, comissões regulares e prémios de produtividade regulares. Estão excluídos: subsídio de alimentação (até ao limite legal de €6,00/dia em dinheiro ou €10,20 em cartão), ajudas de custo dentro dos limites legais, e abono para falhas.',
      proposta:
        'Resumo das obrigações de Segurança Social: 1) Taxa global: 34,75% (23,75% patronal + 11% trabalhador); 2) Prazo de pagamento: até dia 20 do mês seguinte; 3) Entrega da Declaração de Remunerações (DR): até dia 10 do mês seguinte; 4) Para trabalhadores independentes: taxa de 21,4% (regime obrigatório), calculada sobre 70% do rendimento relevante; 5) Primeiro emprego ou desempregado longa duração: isenção/redução da TSU patronal durante 3 anos.',
    },
  },
  {
    keywords: ['período experimental', 'contrato', 'experiência'],
    ctp: {
      contexto:
        'O período experimental corresponde ao tempo inicial de execução do contrato de trabalho, durante o qual qualquer das partes pode denunciar o contrato sem aviso prévio, sem necessidade de justa causa e sem direito a indemnização (artigos 111.º a 114.º do Código do Trabalho).',
      pensamento:
        'A duração do período experimental varia conforme o tipo de contrato e a complexidade da função: contratos sem termo — 90 dias (regra geral), 180 dias (cargos de complexidade técnica, elevado grau de responsabilidade, ou funções de confiança), 240 dias (cargos de direção ou quadros superiores). Contratos a termo — 30 dias (contratos ≥ 6 meses) ou 15 dias (contratos < 6 meses).',
      proposta:
        'Tabela de períodos experimentais: 1) Contrato sem termo, função geral: 90 dias; 2) Contrato sem termo, função complexa/responsabilidade: 180 dias; 3) Contrato sem termo, cargo direção/quadro superior: 240 dias; 4) Contrato a termo ≥ 6 meses: 30 dias; 5) Contrato a termo < 6 meses: 15 dias; 6) Contrato a termo incerto: 15 ou 30 dias conforme duração previsível. Nota: o período experimental pode ser reduzido ou excluído por acordo escrito.',
    },
  },
  {
    keywords: ['salário', 'retribuição', 'funcionário', 'vencimento'],
    ctp: {
      contexto:
        'A retribuição do trabalhador compreende a retribuição base e outras prestações regulares e periódicas. O salário mínimo nacional (RMMG) em 2025 é de €870. A entidade empregadora é obrigada a processar o recibo de vencimento com discriminação de todas as rubricas.',
      pensamento:
        'O processamento salarial mensal deve incluir: retribuição base, subsídio de alimentação, horas extraordinárias (se aplicável), duodécimos de subsídio de férias e Natal (se acordado), e descontos obrigatórios (IRS na fonte conforme tabelas de retenção e Segurança Social 11%). As tabelas de retenção na fonte de IRS variam conforme o estado civil, número de dependentes e rendimento.',
      proposta:
        'Estrutura do recibo de vencimento: Rendimentos: Retribuição Base + Subsídio Alimentação (€6,00/dia × dias úteis) + Outros (horas extra, prémios) = Total Bruto. Descontos: SS Trabalhador (11% sobre base de incidência) + IRS Retenção na Fonte (conforme tabela) = Total Descontos. Líquido a Receber = Total Bruto - Total Descontos. Custo empresa: Total Bruto + TSU Patronal (23,75%) + Seguro de Acidentes de Trabalho (±1%).',
    },
  },
  {
    keywords: ['despedimento', 'cessação', 'trabalho', 'laboral'],
    ctp: {
      contexto:
        'A cessação do contrato de trabalho pode ocorrer por várias formas: caducidade, revogação por acordo (mútuo acordo), despedimento por iniciativa do empregador (com justa causa, coletivo, por extinção do posto de trabalho, ou por inadaptação), e denúncia pelo trabalhador.',
      pensamento:
        'Em caso de despedimento, os direitos do trabalhador dependem da modalidade: despedimento coletivo ou extinção de posto — compensação de 14 dias de retribuição base + diuturnidades por cada ano completo de antiguidade (contratos desde 2013). Mútuo acordo — compensação livre, mínimo legal se houver. Denúncia pelo trabalhador — aviso prévio de 30 dias (até 2 anos) ou 60 dias (mais de 2 anos), sem direito a compensação.',
      proposta:
        'Valores a pagar na cessação: 1) Compensação por despedimento: 14 dias × (retribuição base + diuturnidades) / 30 × anos de antiguidade; 2) Férias não gozadas + respetivo subsídio; 3) Proporcionais de férias e subsídio do ano de cessação; 4) Proporcional de subsídio de Natal; 5) Horas de formação não ministradas (crédito de 40h/ano). Exemplo: trabalhador com 5 anos, salário €1.200 → compensação ≈ €1.200 × 14/30 × 5 = €2.800.',
    },
  },
]

// ---------------------------------------------------------------------------
// Keyword detection helper
// ---------------------------------------------------------------------------

function detectAgent(message: string): AgentId {
  const lower = message.toLowerCase()

  for (const agent of Object.values(AGENTS)) {
    if (agent.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return agent.id
    }
  }

  // Default to Mariana (contabilidade) when no keyword matches
  return 'mariana'
}

function pickResponse(agentId: AgentId, message: string): CTPResponse {
  const lower = message.toLowerCase()
  let pool: { keywords: string[]; ctp: CTPResponse }[]

  switch (agentId) {
    case 'mariana':
      pool = marianaResponses
      break
    case 'tome':
      pool = tomeResponses
      break
    case 'beatriz':
      pool = beatrizResponses
      break
  }

  // Find the best matching response by keyword overlap
  let best = pool[0]
  let bestScore = 0

  for (const entry of pool) {
    const score = entry.keywords.filter((kw) => lower.includes(kw.toLowerCase())).length
    if (score > bestScore) {
      bestScore = score
      best = entry
    }
  }

  return best.ctp
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

let messageCounter = 0

function generateId(): string {
  messageCounter += 1
  return `msg-${Date.now()}-${messageCounter}`
}

export function detectAgentFromMessage(message: string): AgentId {
  return detectAgent(message)
}

export async function getAgentResponse(
  agentId: string,
  userMessage: string,
): Promise<ChatMessage> {
  // Simulate network delay (1-2s)
  const delay = 1000 + Math.random() * 1000
  await new Promise((resolve) => setTimeout(resolve, delay))

  const aid = agentId as AgentId
  const agent = AGENTS[aid]
  const ctp = pickResponse(aid, userMessage)

  return {
    id: generateId(),
    role: 'assistant',
    content: ctp.proposta,
    agentId: aid,
    agentName: agent.name,
    ctp,
    timestamp: new Date(),
  }
}
