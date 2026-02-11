-- ============================================================
-- L.U.C.A.S v2.0 - Web3 & RWA Module
-- ============================================================

CREATE TABLE audit_trail (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    tx_hash VARCHAR(66),
    block_number BIGINT,
    action_type TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    data_hash VARCHAR(66),
    chain TEXT DEFAULT 'ethereum',
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_tenant ON audit_trail(tenant_id);

CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    address VARCHAR(42) NOT NULL,
    label TEXT,
    chain TEXT DEFAULT 'ethereum',
    balance DECIMAL(18,8),
    last_synced TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE rwa_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    token_name TEXT NOT NULL,
    asset_type TEXT NOT NULL,
    collateral_value DECIMAL(18,2),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'liquidated')),
    contract_address VARCHAR(42),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE rwa_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit_isolation" ON audit_trail FOR ALL USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY "wallet_isolation" ON wallets FOR ALL USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY "rwa_isolation" ON rwa_tokens FOR ALL USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid);
