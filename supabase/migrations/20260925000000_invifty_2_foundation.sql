-- ==============================================================================
-- INVIFTY 2.0 - PHASE 1 FOUNDATION MIGRATION (ADDITIVE ONLY)
-- Safe, non-destructive migration extending existing Invifty schema.
-- Preserves existing tables: clientes, pedidos, pagos, formularios, invitaciones,
-- confirmaciones, invitados, leads, demos, historial_estados, auditoria, etc.
-- ==============================================================================

-- 1. Enable pgcrypto and uuid-ossp if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Audit Trail Extension (Ensure all audit events conform to strict schema)
CREATE TABLE IF NOT EXISTS public.auditoria_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    actor_role TEXT NOT NULL DEFAULT 'producer',
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auditoria_v2_entity ON public.auditoria_v2(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_v2_created_at ON public.auditoria_v2(created_at DESC);

-- 3. Templates & Template Versions (Sandboxed HTML/CSS/JS Atelier templates)
-- Per Invifty specification: No AI templates; professional human-engineered templates only.
CREATE TABLE IF NOT EXISTS public.plantillas_atelier (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    categoria TEXT NOT NULL DEFAULT 'Boda',
    thumbnail_url TEXT,
    preview_url TEXT,
    estilos_disponibles JSONB DEFAULT '["Imperial Gold Foil", "Minimal Editorial", "Botanical Velvet"]'::jsonb,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_por TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.versiones_plantilla (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plantilla_id UUID NOT NULL REFERENCES public.plantillas_atelier(id) ON DELETE RESTRICT,
    version_tag TEXT NOT NULL, -- e.g. 'v1.0.0', 'v1.2.0'
    changelog TEXT,
    codigo_html TEXT NOT NULL,
    codigo_css TEXT,
    codigo_js TEXT,
    dynamic_fields_schema JSONB NOT NULL DEFAULT '[]'::jsonb,
    capabilities JSONB NOT NULL DEFAULT '["rsvp", "qr", "gallery", "countdown", "gift_registry", "seating"]'::jsonb,
    es_inmutable BOOLEAN NOT NULL DEFAULT TRUE,
    publicado BOOLEAN NOT NULL DEFAULT FALSE,
    publicado_por TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_plantilla_version ON public.versiones_plantilla(plantilla_id, version_tag);

-- 4. Event Lifecycle & Workspace Extensions (Additive columns to existing 'pedidos' and 'invitaciones')
-- Ensures compatibility with existing schema while supporting separate business statuses:
-- EVENT STATUS: planning, upcoming, live, completed, archived, cancelled
-- ORDER STATUS: draft, pending_payment, partially_paid, paid, refunded, cancelled
-- PRODUCTION STATUS: waiting_for_information, information_received, designing, internal_review, client_review, changes_requested, approved, ready_to_publish, completed
-- INVITATION STATUS: draft, review, published, paused, expired, archived

DO $$
BEGIN
    -- Add columns to 'invitaciones' if they do not exist
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'invitaciones') THEN
        ALTER TABLE public.invitaciones ADD COLUMN IF NOT EXISTS version_plantilla_id UUID REFERENCES public.versiones_plantilla(id);
        ALTER TABLE public.invitaciones ADD COLUMN IF NOT EXISTS estado_produccion TEXT DEFAULT 'waiting_for_information';
        ALTER TABLE public.invitaciones ADD COLUMN IF NOT EXISTS estado_invitacion TEXT DEFAULT 'draft';
        ALTER TABLE public.invitaciones ADD COLUMN IF NOT EXISTS contenido_dinamico JSONB DEFAULT '{}'::jsonb;
        ALTER TABLE public.invitaciones ADD COLUMN IF NOT EXISTS cuenta_id TEXT;
        ALTER TABLE public.invitaciones ADD COLUMN IF NOT EXISTS fecha_boda TIMESTAMPTZ;
        ALTER TABLE public.invitaciones ADD COLUMN IF NOT EXISTS conteo_visitas INT DEFAULT 0;
        ALTER TABLE public.invitaciones ADD COLUMN IF NOT EXISTS visitantes_unicos INT DEFAULT 0;
    END IF;

    -- Add columns to 'invitados' if they do not exist
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'invitados') THEN
        ALTER TABLE public.invitados ADD COLUMN IF NOT EXISTS pases_permitidos INT DEFAULT 1;
        ALTER TABLE public.invitados ADD COLUMN IF NOT EXISTS pases_confirmados INT DEFAULT 0;
        ALTER TABLE public.invitados ADD COLUMN IF NOT EXISTS menu_seleccionado TEXT;
        ALTER TABLE public.invitados ADD COLUMN IF NOT EXISTS restricciones_alimentarias TEXT;
        ALTER TABLE public.invitados ADD COLUMN IF NOT EXISTS mesa_id TEXT;
        ALTER TABLE public.invitados ADD COLUMN IF NOT EXISTS qr_token TEXT;
        ALTER TABLE public.invitados ADD COLUMN IF NOT EXISTS checkin_completado BOOLEAN DEFAULT FALSE;
        ALTER TABLE public.invitados ADD COLUMN IF NOT EXISTS checkin_timestamp TIMESTAMPTZ;
        ALTER TABLE public.invitados ADD COLUMN IF NOT EXISTS integrantes JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;

-- 5. Row Level Security Policies (Enforced on auditoria_v2 and plantillas)
ALTER TABLE public.auditoria_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plantillas_atelier ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.versiones_plantilla ENABLE ROW LEVEL SECURITY;

-- Allow read-only access to published template versions for invitation runtime
CREATE POLICY IF NOT EXISTS "Allow read of published templates"
ON public.plantillas_atelier FOR SELECT
USING (activo = true);

CREATE POLICY IF NOT EXISTS "Allow read of published versions"
ON public.versiones_plantilla FOR SELECT
USING (publicado = true);

-- Internal studio role bypass / check via auth.jwt() claims
CREATE POLICY IF NOT EXISTS "Studio operators full template access"
ON public.plantillas_atelier FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'studio_operator' OR auth.jwt() ->> 'email' LIKE '%@invifty.com')
WITH CHECK (auth.jwt() ->> 'role' = 'studio_operator' OR auth.jwt() ->> 'email' LIKE '%@invifty.com');
