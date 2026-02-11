-- ============================================================
-- L.U.C.A.S v2.0 - HEAL System (Auto-Healing)
-- ============================================================

CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES chat_messages(id),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    user_id UUID REFERENCES profiles(id),
    rating INT CHECK (rating IN (-1, 1)),
    category TEXT,
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feedback_tenant ON feedback(tenant_id);

CREATE TABLE heal_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    severity TEXT NOT NULL CHECK (severity IN ('P0', 'P1', 'P2', 'P3')),
    category TEXT,
    issue TEXT NOT NULL,
    resolution TEXT,
    proposed_fix TEXT,
    fix_type TEXT CHECK (fix_type IN ('prompt_patch', 'data_update', 'new_feature')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'healing', 'resolved', 'rejected')),
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    affected_conversations UUID[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_heal_severity ON heal_logs(severity);
CREATE INDEX idx_heal_status ON heal_logs(status);

CREATE TABLE health_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name TEXT NOT NULL,
    metric_value FLOAT NOT NULL,
    agent_id TEXT,
    metadata JSONB DEFAULT '{}',
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE heal_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "feedback_isolation" ON feedback FOR ALL USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY "heal_isolation" ON heal_logs FOR ALL USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid OR tenant_id IS NULL);
