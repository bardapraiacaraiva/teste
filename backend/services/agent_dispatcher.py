"""
L.U.C.A.S v2.0 - Agent Dispatcher
Routes messages to the appropriate specialist agent
"""

import re
import uuid
from datetime import datetime
from models.oracle_models import ChatRequest, ChatResponse, CTPResponse

AGENT_KEYWORDS = {
    "tome": ["iva", "irc", "irs", "imposto", "fiscal", "dedução", "deducao", "taxa", "benefício", "beneficio", "sifide", "rfai", "dlrr", "tributação", "tributacao", "declaração", "declaracao", "ies", "at ", "finanças", "financas"],
    "beatriz": ["salário", "salario", "férias", "ferias", "contrato", "funcionário", "funcionario", "segurança social", "seguranca social", "rh", "pessoal", "subsídio", "subsidio", "trabalho", "empregado", "período experimental", "periodo experimental", "despedimento"],
    "mariana": ["balanço", "balanco", "balancete", "snc", "demonstração", "demonstracao", "contabilidade", "amortização", "amortizacao", "ativo", "passivo", "capital", "conta", "lançamento", "lancamento", "razão", "razao", "diário", "diario", "inventário", "inventario"],
}

AGENT_RESPONSES = {
    "mariana": [
        CTPResponse(
            contexto="A questão relaciona-se com o registo contabilístico no âmbito do Sistema de Normalização Contabilística (SNC), conforme as NCRF aplicáveis ao caso.",
            pensamento="Analisando a estrutura do SNC e as normas NCRF relevantes, é fundamental garantir que os registos reflitam a substância económica das transações, respeitando os princípios da competência e da prudência.",
            proposta="Recomendo: 1) Verificar a classificação nas contas apropriadas do SNC; 2) Registar o lançamento no diário com débito e crédito corretos; 3) Assegurar que o balancete reflete a posição real. Se necessário, podemos rever o balancete analítico para confirmar a consistência dos saldos.",
        ),
        CTPResponse(
            contexto="As demonstrações financeiras são peças fundamentais da prestação de contas, reguladas pelo SNC e obrigatórias para todas as entidades sujeitas a contabilidade organizada.",
            pensamento="O Balanço, a Demonstração de Resultados, a DACP, a DFC e o Anexo formam o conjunto completo. Para PMEs, pode aplicar-se o regime simplificado conforme a NCRF-PE.",
            proposta="Sugiro: 1) Preparar o Balanço com base no balancete de encerramento; 2) Elaborar a DR por naturezas (modelo mais comum em Portugal); 3) Completar o Anexo com as divulgações obrigatórias. Posso ajudar a estruturar cada peça.",
        ),
        CTPResponse(
            contexto="As amortizações e depreciações são reguladas pela NCRF 7 (Ativos Fixos Tangíveis) e NCRF 6 (Ativos Intangíveis), com implicações fiscais definidas no Decreto Regulamentar 25/2009.",
            pensamento="É essencial distinguir entre a vida útil contabilística e a taxa fiscal aceite. O método da linha reta é o mais utilizado em Portugal, embora o método das quotas degressivas possa ser fiscalmente mais vantajoso em certos casos.",
            proposta="Recomendo: 1) Aplicar as taxas do DR 25/2009 como referência fiscal; 2) Calcular a depreciação mensal: Valor Aquisição / Vida Útil / 12; 3) Registar: Débito 64x (Gastos de depreciação) / Crédito 438/448 (Depreciações acumuladas). Quer que faça a simulação para os seus ativos?",
        ),
    ],
    "tome": [
        CTPResponse(
            contexto="A questão enquadra-se no âmbito do Código do IRC (CIRC), nomeadamente as obrigações declarativas e as taxas aplicáveis às empresas residentes em Portugal.",
            pensamento="A taxa normal de IRC em 2026 é de 21% sobre a matéria coletável. Empresas com lucro tributável até €50.000 beneficiam de uma taxa reduzida de 17% sobre esse montante (regime PME). Acrescem a derrama municipal (até 1.5%) e, para lucros superiores a €1.5M, a derrama estadual.",
            proposta="Para o cálculo do IRC: 1) Matéria coletável = Lucro contabilístico ± Correções fiscais; 2) Primeiros €50k × 17% + Restante × 21%; 3) Adicionar derrama municipal do concelho; 4) Pagamentos por conta: 3 prestações (Jul, Set, Dez) baseadas no IRC do ano anterior. Prazo de entrega da Modelo 22: até 31 de maio.",
        ),
        CTPResponse(
            contexto="O IVA (Imposto sobre o Valor Acrescentado) é regulado pelo CIVA e aplicável a todas as transações de bens e serviços em território nacional.",
            pensamento="As taxas de IVA em vigor em Portugal Continental são: 23% (taxa normal), 13% (taxa intermédia - restauração, por exemplo) e 6% (taxa reduzida - bens essenciais). As declarações periódicas são mensais (volume negócios > €650k) ou trimestrais.",
            proposta="Recomendo: 1) Classificar todas as operações pela taxa correta; 2) Submeter a DP de IVA até dia 10 do 2º mês seguinte (mensal) ou até dia 15 do 2º mês (trimestral); 3) Verificar direito à dedução nos termos do Art. 19º e 20º do CIVA. Posso rever as suas faturas para confirmar a classificação.",
        ),
        CTPResponse(
            contexto="Os benefícios fiscais SIFIDE III e RFAI são instrumentos de apoio ao investimento e I&D previstos no Código Fiscal do Investimento.",
            pensamento="O SIFIDE III permite deduzir até 32.5% das despesas de I&D (base) + 50% do acréscimo face à média dos 2 anos anteriores. O RFAI permite deduzir até 25% do investimento em ativos relevantes para regiões menos desenvolvidas. Ambos são cumuláveis sob certas condições.",
            proposta="Para maximizar os benefícios: 1) Documentar todas as despesas de I&D elegíveis para SIFIDE; 2) Verificar se os investimentos em ativos fixos qualificam para RFAI; 3) Submeter candidatura SIFIDE até à entrega da Modelo 22; 4) Considerar também a DLRR (Dedução por Lucros Retidos e Reinvestidos). Poupança potencial estimada: 10-15% do IRC.",
        ),
    ],
    "beatriz": [
        CTPResponse(
            contexto="A questão relaciona-se com a legislação laboral portuguesa, regulada pelo Código do Trabalho (Lei 7/2009) e legislação complementar.",
            pensamento="O período experimental varia conforme o tipo de contrato: 90 dias para contratos sem termo (generalidade), 180 dias para cargos de complexidade técnica ou direção, 240 dias para cargos de direção/quadros superiores, e 15/30 dias para contratos a termo.",
            proposta="Informações chave: 1) Durante o período experimental, qualquer das partes pode denunciar sem aviso prévio (até 60 dias) nem indemnização; 2) Após 60 dias, o empregador deve dar aviso prévio de 7 dias; 3) Após 120 dias, aviso de 15 dias. Recomendo formalizar sempre a comunicação por escrito.",
        ),
        CTPResponse(
            contexto="O subsídio de férias e o subsídio de Natal são direitos irrenunciáveis dos trabalhadores, previstos nos artigos 263º e 264º do Código do Trabalho.",
            pensamento="Cada trabalhador tem direito a 22 dias úteis de férias por ano. O subsídio de férias é igual à retribuição base + diuturnidades e deve ser pago antes do início do período de férias. No ano de admissão, o direito a férias vence após 6 meses de trabalho.",
            proposta="Cálculos a considerar: 1) Subsídio de férias = Retribuição base mensal + Diuturnidades; 2) Proporcional no ano de admissão/cessação: (Meses trabalhados / 12) × 22 dias; 3) Encargos SS patronais: 23.75% sobre o subsídio; 4) Retenção IRS conforme tabelas em vigor. Quer que calcule para um trabalhador específico?",
        ),
        CTPResponse(
            contexto="A Segurança Social em Portugal é regulada pelo Código dos Regimes Contributivos (Lei 110/2009), com obrigações tanto para entidades empregadoras como para trabalhadores.",
            pensamento="As taxas contributivas para o regime geral são: 23.75% a cargo da entidade empregadora e 11% a cargo do trabalhador (total 34.75%). Para membros de órgãos estatutários, a taxa do MOE pode ser diferente conforme a remuneração.",
            proposta="Obrigações mensais: 1) Submeter a Declaração de Remunerações até dia 10 do mês seguinte; 2) Pagamento das contribuições até dia 20 do mês seguinte; 3) Para novos trabalhadores, comunicar admissão 24h antes do início da atividade; 4) Considerar isenções/reduções para jovens (ATIVAR.PT) e criação de emprego. Posso detalhar algum destes pontos?",
        ),
    ],
}


def detect_agent(message: str) -> str:
    text = message.lower()
    scores = {"mariana": 0, "tome": 0, "beatriz": 0}
    for agent_id, keywords in AGENT_KEYWORDS.items():
        for kw in keywords:
            if kw in text:
                scores[agent_id] += 1
    best = max(scores, key=scores.get)
    if scores[best] == 0:
        return "mariana"  # default
    return best


def get_response(request: ChatRequest) -> ChatResponse:
    agent_id = request.agent_id or detect_agent(request.message)

    agent_names = {"mariana": "Mariana", "tome": "Tomé", "beatriz": "Beatriz"}
    agent_name = agent_names.get(agent_id, "Mariana")

    responses = AGENT_RESPONSES.get(agent_id, AGENT_RESPONSES["mariana"])
    # Pick response based on message hash for consistency
    idx = hash(request.message) % len(responses)
    ctp = responses[idx]

    return ChatResponse(
        message_id=str(uuid.uuid4()),
        agent_id=agent_id,
        agent_name=agent_name,
        content=ctp.proposta,
        ctp=ctp,
        timestamp=datetime.now().isoformat(),
    )
