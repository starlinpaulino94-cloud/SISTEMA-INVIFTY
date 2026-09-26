-- ==============================================================================
-- INVIFTY 2.0 - COMPLETE MODULES SAFE EXTENSION (ADDITIVE ONLY)
-- Safe, non-destructive migration extending Supabase schema for all studio & client modules.
-- ==============================================================================

-- 1. Production stages & tracking
CREATE TABLE IF NOT EXISTS public.produccion_eventos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evento_id TEXT NOT NULL,
    etapa TEXT NOT NULL DEFAULT 'pendiente_info', -- pendiente_info, info_recibida, disenando, revision_interna, revision_cliente, cambios_solicitados, aprobada, lista_publicar, completada
    responsable_id TEXT,
    responsable_nombre TEXT,
    prioridad TEXT NOT NULL DEFAULT 'normal', -- baja, normal, alta, urgente
    dias_en_etapa INT NOT NULL DEFAULT 1,
    comentarios_pendientes INT NOT NULL DEFAULT 0,
    version_actual TEXT DEFAULT 'v1.0.0',
    notas_produccion TEXT,
    fecha_limite TIMESTAMPTZ,
    historial_etapas JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_produccion_evento_id ON public.produccion_eventos(evento_id);
CREATE INDEX IF NOT EXISTS idx_produccion_etapa ON public.produccion_eventos(etapa);

-- 2. Global reviews & comments
CREATE TABLE IF NOT EXISTS public.revisiones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evento_id TEXT NOT NULL,
    evento_titulo TEXT NOT NULL,
    cliente_nombre TEXT NOT NULL,
    cliente_email TEXT,
    version_invitacion TEXT NOT NULL DEFAULT 'v1.0',
    plantilla_id TEXT,
    fecha_envio TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    dias_espera INT NOT NULL DEFAULT 0,
    abierto_por_cliente BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_apertura TIMESTAMPTZ,
    estado TEXT NOT NULL DEFAULT 'pending', -- pending, opened, changes_requested, approved, expired, revoked
    responsable_nombre TEXT NOT NULL DEFAULT 'Equipo Atelier',
    version_aprobada_exacta TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_revisiones_evento ON public.revisiones(evento_id);
CREATE INDEX IF NOT EXISTS idx_revisiones_estado ON public.revisiones(estado);

CREATE TABLE IF NOT EXISTS public.comentarios_revision (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    revision_id UUID NOT NULL REFERENCES public.revisiones(id) ON DELETE CASCADE,
    seccion TEXT NOT NULL, -- Portada, Historia, Programa, Dress Code, Itinerario, Mapa, RSVP, etc.
    mensaje TEXT NOT NULL,
    imagen_referencia TEXT,
    autor_nombre TEXT NOT NULL,
    autor_rol TEXT NOT NULL DEFAULT 'cliente', -- cliente, disenador, planner, concierge
    estado TEXT NOT NULL DEFAULT 'abierto', -- abierto, resuelto, reabierto
    nota_interna BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_comentarios_revision_id ON public.comentarios_revision(revision_id);

-- 3. Payments & Bank Transfer Verifications
CREATE TABLE IF NOT EXISTS public.pagos_transacciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evento_id TEXT NOT NULL,
    cliente_id TEXT NOT NULL,
    cliente_nombre TEXT NOT NULL,
    evento_titulo TEXT NOT NULL,
    plan_nombre TEXT NOT NULL,
    monto_total NUMERIC(10,2) NOT NULL DEFAULT 0,
    monto_pagado NUMERIC(10,2) NOT NULL DEFAULT 0,
    monto_balance NUMERIC(10,2) NOT NULL DEFAULT 0,
    monto_transaccion NUMERIC(10,2) NOT NULL DEFAULT 0,
    estado_pago TEXT NOT NULL DEFAULT 'verificado', -- verificado, pendiente, por_verificar, rechazado, reembolsado, anulado
    metodo_pago TEXT NOT NULL DEFAULT 'transferencia', -- transferencia, tarjeta, stripe, efectivo
    banco_origen TEXT,
    numero_referencia TEXT,
    comprobante_url TEXT,
    motivo_rechazo TEXT,
    notas TEXT,
    fecha_pago TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verificado_por TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pagos_evento ON public.pagos_transacciones(evento_id);
CREATE INDEX IF NOT EXISTS idx_pagos_estado ON public.pagos_transacciones(estado_pago);

-- 4. Public Demonstration Invitations
CREATE TABLE IF NOT EXISTS public.demostraciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    plantilla_id TEXT NOT NULL,
    plantilla_nombre TEXT NOT NULL,
    categoria TEXT NOT NULL DEFAULT 'Boda',
    slug TEXT UNIQUE NOT NULL,
    estado TEXT NOT NULL DEFAULT 'publicado', -- publicado, borrador, pausado
    visitas INT NOT NULL DEFAULT 0,
    url_publica TEXT NOT NULL,
    descripcion TEXT,
    thumbnail_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Media Library
CREATE TABLE IF NOT EXISTS public.media_archivos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_archivo TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'image', -- image, video, audio, document
    mime_type TEXT,
    peso_bytes BIGINT NOT NULL DEFAULT 0,
    url TEXT NOT NULL,
    evento_id TEXT,
    cliente_nombre TEXT,
    uso TEXT, -- portada, galeria, cancion_fondo, documento_contrato, audio_invitacion
    es_privado BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_media_evento ON public.media_archivos(evento_id);
CREATE INDEX IF NOT EXISTS idx_media_tipo ON public.media_archivos(tipo);

-- 6. Team & Permissions
CREATE TABLE IF NOT EXISTS public.equipo_usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    rol TEXT NOT NULL DEFAULT 'operaciones', -- superadmin, admin, ventas, operaciones, disenador
    estado TEXT NOT NULL DEFAULT 'activo', -- activo, suspendido, invitado
    avatar_url TEXT,
    eventos_asignados INT NOT NULL DEFAULT 0,
    permisos JSONB NOT NULL DEFAULT '["ver_dashboard", "gestionar_eventos"]'::jsonb,
    ultima_actividad TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Internal System Notifications
CREATE TABLE IF NOT EXISTS public.notificaciones_sistema (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    categoria TEXT NOT NULL DEFAULT 'events', -- reviews, payments, events, leads, guests, system
    titulo TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN NOT NULL DEFAULT FALSE,
    evento_id TEXT,
    accion_url TEXT,
    prioridad TEXT DEFAULT 'normal',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leida ON public.notificaciones_sistema(leida);
CREATE INDEX IF NOT EXISTS idx_notificaciones_categoria ON public.notificaciones_sistema(categoria);

-- 8. Seating & Mesas
CREATE TABLE IF NOT EXISTS public.mesas_distribucion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evento_id TEXT NOT NULL,
    numero_mesa TEXT NOT NULL,
    nombre TEXT NOT NULL,
    categoria TEXT NOT NULL DEFAULT 'Familia',
    capacidad INT NOT NULL DEFAULT 10,
    asientos_ocupados INT NOT NULL DEFAULT 0,
    ubicacion_plano TEXT,
    alerta_alergenos TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mesas_evento ON public.mesas_distribucion(evento_id);

-- 9. Check-in event day tracking
CREATE TABLE IF NOT EXISTS public.checkin_registros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evento_id TEXT NOT NULL,
    invitado_id TEXT NOT NULL,
    invitado_nombre TEXT NOT NULL,
    mesa TEXT,
    pases_totales INT NOT NULL DEFAULT 1,
    pases_ingresados INT NOT NULL DEFAULT 1,
    hora_ingreso TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metodo TEXT NOT NULL DEFAULT 'qr_scan', -- qr_scan, manual, reingreso
    operador_nombre TEXT NOT NULL DEFAULT 'Recepción Principal',
    anulado BOOLEAN NOT NULL DEFAULT FALSE,
    motivo_anulacion TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_checkin_evento ON public.checkin_registros(evento_id);

-- 10. Messages / WhatsApp Concierge History
CREATE TABLE IF NOT EXISTS public.comunicaciones_mensajes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evento_id TEXT NOT NULL,
    canal TEXT NOT NULL DEFAULT 'whatsapp', -- whatsapp, email, in_app
    destinatario_nombre TEXT NOT NULL,
    destinatario_contacto TEXT NOT NULL,
    asunto TEXT,
    contenido TEXT NOT NULL,
    estado TEXT NOT NULL DEFAULT 'sent', -- draft, queued, sent, delivered, opened, failed, manual
    plantilla_usada TEXT,
    enviado_por TEXT NOT NULL DEFAULT 'Concierge AI & Team',
    enviado_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_comunicaciones_evento ON public.comunicaciones_mensajes(evento_id);
