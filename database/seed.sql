-- ============================================================
-- L.U.C.A.S v2.0 - Seed Data (Demo)
-- ============================================================

-- Demo Tenant
INSERT INTO tenants (id, name, nif, cae_code, email, segment, plan, status, onboarding_completed) VALUES
('00000000-0000-0000-0000-000000000001', 'TechSoft Portugal Lda', '999999999', '62010', 'demo@lusaconta.pt', 'pme', 'professional', 'active', true);

-- Demo Heal Logs
INSERT INTO heal_logs (tenant_id, severity, category, issue, resolution, status) VALUES
(NULL, 'P1', 'erro_factual', 'Imprecisão na taxa de derrama municipal para Braga', 'Atualização da base de dados de derrama', 'open'),
(NULL, 'P1', 'lacuna_critica', 'Atualização pendente: Alteração OE 2026 Art. 88º CIRC', NULL, 'open'),
(NULL, 'P2', 'suboptimizacao', 'Resposta sobre SIFIDE não incluiu alterações 2026', 'Prompt atualizado com legislação 2026', 'resolved'),
(NULL, 'P3', 'melhoria', 'Utilizador sugeriu incluir exemplos numéricos nas respostas IRC', 'Adicionados templates com exemplos', 'resolved');
