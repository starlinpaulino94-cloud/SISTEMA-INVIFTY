import { supabase, isSupabaseConfigured } from './supabase';
import { AuditRecord } from '../types';

const defaultSeedAudit: AuditRecord[] = [
  {
    id: 'aud-1',
    type: 'sistema',
    title: 'Migración Base Invifty 2.0 Aplicada',
    description: 'Sistema inicializado con esquemas seguros no destructivos',
    timestamp: 'Hace 1 hora',
    author: 'Ingeniería Atelier',
    actorName: 'Sistema Invifty Core',
    actorRole: 'Super Admin',
    action: 'MIGRACION_ESQUEMA_APLICADA',
    entityType: 'database',
    entityId: '20260925000000_invifty_2_foundation',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    metadata: { tables_created: ['leads_v2', 'eventos_workspace', 'huespedes_v2', 'auditoria_v2'] },
  },
  {
    id: 'aud-2',
    type: 'aprobacion',
    title: 'Plantilla Imperial Gold v2.4.0 Asignada',
    description: 'Aprobación oficial de versión sandboxed de alta joyería',
    timestamp: 'Hace 45 min',
    author: 'Patricia Ramos',
    actorName: 'Patricia Ramos',
    actorRole: 'Wedding Producer',
    action: 'APROBACION_PLANTILLA_DISENO',
    entityType: 'evento',
    entityId: 'ev-maria-carlos',
    createdAt: new Date(Date.now() - 2700000).toISOString(),
    metadata: { version: 'v2.4.0', status: 'approved' },
  },
  {
    id: 'aud-3',
    type: 'pago',
    title: 'Abono Hito Aprobación Conciliado',
    description: 'Pago recibido por $600 USD de María Fernández',
    timestamp: 'Hace 30 min',
    author: 'Concierge Finanzas',
    actorName: 'Concierge Finanzas',
    actorRole: 'Concierge Lead',
    action: 'REGISTRO_PAGO_CONCILIADO',
    entityType: 'facturacion',
    entityId: 'pay-8902',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    metadata: { amount: 600, currency: 'USD', method: 'Visa Signature' },
  },
  {
    id: 'aud-4',
    type: 'guests',
    title: 'RSVP Confirmado: Ana Gómez & Roberto Gómez',
    description: 'Confirmación registrada con requerimiento dietario celíaco',
    timestamp: 'Hace 8 min',
    author: 'PWA Runtime Guest',
    actorName: 'Ana Gómez',
    actorRole: 'Huésped VIP',
    action: 'RSVP_CONFIRMADO',
    entityType: 'huesped',
    entityId: 'gst-1',
    createdAt: new Date(Date.now() - 480000).toISOString(),
    metadata: { table: 'Mesa 01 Imperial', pax: 2, dietary: 'Celíaco severo' },
  },
];

export async function getAuditRecords(): Promise<AuditRecord[]> {
  const local = getLocalAuditRecords();
  return [...local, ...defaultSeedAudit];
}

export async function logAudit(params: {
  actor?: string;
  actorName?: string;
  actorRole?: string;
  action?: string;
  target?: string;
  details?: string;
  type?: AuditRecord['type'];
  title?: string;
  description?: string;
  author?: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  const actor = params.actor || params.actorName || params.author || 'Studio User';
  const role = params.actorRole || 'Studio Staff';
  const action = params.action || params.title || 'ACCIÓN';
  const entityType = params.entityType || 'general';
  const entityId = params.entityId || params.target || 'target';

  return recordAuditEvent({
    actorName: actor,
    actorRole: role,
    action: action,
    entityType,
    entityId,
    metadata: params.metadata || { details: params.details, description: params.description },
  });
}

export async function recordAuditEvent(params: {
  actorName: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  // Sanitize metadata to strip sensitive attributes (passwords, tokens, bank credentials)
  const sanitizedMetadata = { ...params.metadata };
  delete sanitizedMetadata.password;
  delete sanitizedMetadata.token;
  delete sanitizedMetadata.secret;
  delete sanitizedMetadata.cardNumber;
  delete sanitizedMetadata.cvv;

  if (isSupabaseConfigured) {
    try {
      await supabase.from('auditoria_v2').insert({
        actor_id: params.actorName.toLowerCase().replace(/\s+/g, '_'),
        actor_name: params.actorName,
        actor_role: params.actorRole,
        action: params.action,
        entity_type: params.entityType,
        entity_id: params.entityId,
        metadata: sanitizedMetadata,
      });
    } catch {
      // Graceful fallback to local session audit store
    }
  }

  // Also publish to in-memory event bus or local persistence for immediate UI responsiveness
  const localLogs = getLocalAuditRecords();
  const newLog: AuditRecord = {
    id: `audit-${Date.now()}`,
    type: getAuditTypeFromAction(params.action),
    title: params.action,
    description: `${params.actorName} (${params.actorRole}) - ${params.entityType}: ${params.entityId}`,
    timestamp: 'Hace un momento',
    author: params.actorName,
    actorName: params.actorName,
    actorRole: params.actorRole,
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
    createdAt: new Date().toISOString(),
    metadata: sanitizedMetadata,
  };
  
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem('invifty_audit_log', JSON.stringify([newLog, ...localLogs.slice(0, 49)]));
  }
}

export function getLocalAuditRecords(): AuditRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.sessionStorage.getItem('invifty_audit_log');
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

function getAuditTypeFromAction(action: string): AuditRecord['type'] {
  const lower = action.toLowerCase();
  if (lower.includes('aprob') || lower.includes('versión')) return 'aprobacion';
  if (lower.includes('pago') || lower.includes('recibo')) return 'pago';
  if (lower.includes('invitad') || lower.includes('mesa') || lower.includes('qr')) return 'guests';
  if (lower.includes('lead') || lower.includes('prospect')) return 'lead';
  return 'sistema';
}
