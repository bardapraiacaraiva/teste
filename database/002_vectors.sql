-- ============================================================
-- L.U.C.A.S v2.0 - Vector Search (RAG)
-- pgvector extension for document embeddings
-- ============================================================

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    source_pdf TEXT CHECK (source_pdf IN ('IRC', 'IRS', 'IVA', 'IES', 'Contabilidade', 'Outro')),
    page_number INT,
    section_title TEXT,
    legal_article TEXT,
    content TEXT NOT NULL,
    content_hash TEXT UNIQUE NOT NULL,
    embedding vector(1536),
    category TEXT,
    keywords TEXT[],
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chunks_embedding ON document_chunks USING hnsw (embedding vector_cosine_ops);
CREATE INDEX idx_chunks_tenant ON document_chunks(tenant_id);
CREATE INDEX idx_chunks_source ON document_chunks(source_pdf);

ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chunks_isolation" ON document_chunks FOR ALL USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid);

-- Semantic search function
CREATE OR REPLACE FUNCTION match_documents(
    query_embedding vector(1536),
    match_tenant_id UUID,
    match_count INT DEFAULT 5,
    match_threshold FLOAT DEFAULT 0.7,
    filter_source TEXT DEFAULT NULL
)
RETURNS TABLE (id UUID, content TEXT, source_pdf TEXT, legal_article TEXT, similarity FLOAT)
LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT dc.id, dc.content, dc.source_pdf, dc.legal_article,
           1 - (dc.embedding <=> query_embedding) AS similarity
    FROM document_chunks dc
    WHERE dc.tenant_id = match_tenant_id
      AND (filter_source IS NULL OR dc.source_pdf = filter_source)
      AND 1 - (dc.embedding <=> query_embedding) > match_threshold
    ORDER BY dc.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
