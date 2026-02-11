-- ============================================================
-- L.U.C.A.S v2.0 - Core Schema
-- Multi-Tenant SaaS with Row Level Security
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- TENANTS
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    nif VARCHAR(9) UNIQUE NOT NULL CHECK (nif ~ '^[0-9]{9}$'),
    cae_code VARCHAR(5),
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    segment TEXT CHECK (segment IN ('autarquia', 'pme', 'particular', 'ipss', 'associacao')) NOT NULL,
    n_employees INT DEFAULT 0,
    fiscal_regime TEXT CHECK (fiscal_regime IN ('simplificado', 'organizado', 'isencao')),
    plan TEXT CHECK (plan IN ('starter', 'professional', 'enterprise')) DEFAULT 'starter',
    status TEXT CHECK (status IN ('active', 'trial', 'suspended', 'cancelled')) DEFAULT 'trial',
    trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
    onboarding_completed BOOLEAN DEFAULT false,
    settings JSONB DEFAULT '{"theme":"dark","language":"pt-PT"}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tenants_nif ON tenants(nif);
CREATE INDEX idx_tenants_status ON tenants(status);

-- USERS / PROFILES
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT CHECK (role IN ('owner', 'admin', 'accountant', 'viewer')) DEFAULT 'viewer',
    permissions JSONB DEFAULT '{"contabilidade":true,"fiscal":true,"pessoal":false,"oraculo":false}',
    is_active BOOLEAN DEFAULT true,
    last_seen TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_tenant ON profiles(tenant_id);

-- DOCUMENTS
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    filename TEXT NOT NULL,
    file_type TEXT,
    file_size BIGINT,
    storage_path TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'processed', 'error')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_tenant ON documents(tenant_id);

-- CHAT SESSIONS
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id),
    agent_id TEXT NOT NULL,
    title TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_tenant ON chat_sessions(tenant_id);

-- CHAT MESSAGES
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    agent_name TEXT,
    content TEXT NOT NULL,
    ctp_contexto TEXT,
    ctp_pensamento TEXT,
    ctp_proposta TEXT,
    tokens_used INT,
    latency_ms INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_session ON chat_messages(session_id);

-- SIMULATIONS (ORACULO)
CREATE TABLE simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    parameters JSONB NOT NULL,
    results JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_simulations_tenant ON simulations(tenant_id);

-- ROW LEVEL SECURITY
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON tenants FOR ALL USING (id = (auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY "profile_isolation" ON profiles FOR ALL USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY "document_isolation" ON documents FOR ALL USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY "session_isolation" ON chat_sessions FOR ALL USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY "message_isolation" ON chat_messages FOR ALL USING (session_id IN (SELECT id FROM chat_sessions WHERE tenant_id = (auth.jwt()->>'tenant_id')::uuid));
CREATE POLICY "simulation_isolation" ON simulations FOR ALL USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid);

-- TRIGGERS
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tenants_updated BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_sessions_updated BEFORE UPDATE ON chat_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- AUTO-CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, tenant_id, full_name, email, role)
  VALUES (NEW.id, (NEW.raw_user_meta_data->>'tenant_id')::uuid, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'), NEW.email, COALESCE(NEW.raw_user_meta_data->>'role', 'viewer'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();
