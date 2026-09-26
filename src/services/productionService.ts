import { ProductionItem, ProductionStage } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { logAudit } from '../lib/audit';

export const initialProductionItems: ProductionItem[] = [
  {
    id: 'prod-1',
    eventId: 'ev-maria-carlos',
    eventName: 'María Fernández & Carlos Rodríguez',
    clientName: 'María Fernández',
    clientEmail: 'maria@fernandez.do',
    eventDate: '24 de Octubre, 2026',
    plan: 'Imperial Gold ($4,200)',
    stage: 'revision_cliente',
    assignedTo: 'Patricia Ramos (Planner)',
    daysInStage: 3,
    priority: 'alta',
    unresolvedComments: 2,
    paymentStatus: 'al_dia',
    version: 'v2.4.0',
    notes: 'Los novios solicitaron ajuste en el horario de transporte del Hotel Gran Jimenoa y añadir logo familiar.',
    slug: 'maria-carlos',
  },
  {
    id: 'prod-2',
    eventId: 'ev-alejandro-valeria',
    eventName: 'Alejandro & Valeria Almonte',
    clientName: 'Valeria Almonte',
    clientEmail: 'valeria@almonte.com',
    eventDate: '14 de Noviembre, 2026',
    plan: 'Royal Heritage ($3,200)',
    stage: 'disenando',
    assignedTo: 'Eduardo Santos (Diseñador)',
    daysInStage: 5,
    priority: 'urgente',
    unresolvedComments: 0,
    paymentStatus: 'pendiente_saldo',
    version: 'v1.1.0',
    notes: 'Esperando fotos en alta resolución de la sesión de compromiso en Altos de Chavón.',
    slug: 'alejandro-valeria',
  },
  {
    id: 'prod-3',
    eventId: 'ev-gabriela-morales',
    eventName: 'Gala Benéfica Fundación Mir 2026',
    clientName: 'Vivian Morales',
    clientEmail: 'vivian@fundacionmir.org',
    eventDate: '05 de Diciembre, 2026',
    plan: 'Atelier Bespoke ($6,500)',
    stage: 'aprobada',
    assignedTo: 'Patricia Ramos (Planner)',
    daysInStage: 1,
    priority: 'alta',
    unresolvedComments: 0,
    paymentStatus: 'al_dia',
    version: 'v3.0.0',
    notes: 'Aprobación final recibida por el Patronato. Lista para programar fecha de publicación y pases QR.',
    slug: 'gala-mir-2026',
  },
  {
    id: 'prod-4',
    eventId: 'ev-sofia-bautizo',
    eventName: 'Bautizo Real Sofía Patricia',
    clientName: 'Doña Elena Rodríguez',
    clientEmail: 'elena@rodriguez.do',
    eventDate: '18 de Diciembre, 2026',
    plan: 'Signature ($2,400)',
    stage: 'info_recibida',
    assignedTo: 'Claudia Méndez (Diseñadora)',
    daysInStage: 2,
    priority: 'normal',
    unresolvedComments: 1,
    paymentStatus: 'por_verificar',
    version: 'v1.0.0',
    notes: 'Cuestionario de datos recibido. Padrinos confirmados. Falta definir lista de reproducción.',
    slug: 'bautizo-sofia',
  },
  {
    id: 'prod-5',
    eventId: 'ev-lucas-beatriz',
    eventName: 'Lucas Mendoza & Beatriz Fernández',
    clientName: 'Lucas Mendoza',
    clientEmail: 'lucas@mendoza.com',
    eventDate: '15 de Enero, 2027',
    plan: 'Imperial Gold ($4,200)',
    stage: 'pendiente_info',
    assignedTo: 'Carlos Vega (Operaciones)',
    daysInStage: 7,
    priority: 'normal',
    unresolvedComments: 0,
    paymentStatus: 'al_dia',
    version: 'v0.9.0',
    notes: 'Enviado recordatorio automático para completar el formulario de locaciones y comitiva.',
    slug: 'lucas-beatriz',
  },
  {
    id: 'prod-6',
    eventId: 'ev-corp-vicini',
    eventName: 'Aniversario Corporativo Grupo Vicini',
    clientName: 'Juan Carlos Vicini',
    clientEmail: 'jc@vicini.do',
    eventDate: '28 de Febrero, 2027',
    plan: 'Atelier Bespoke ($6,500)',
    stage: 'revision_interna',
    assignedTo: 'Eduardo Santos (Diseñador)',
    daysInStage: 2,
    priority: 'alta',
    unresolvedComments: 3,
    paymentStatus: 'al_dia',
    version: 'v2.0.0',
    notes: 'Revisando validación tipográfica de logos corporativos y audio de orquesta.',
    slug: 'vicini-aniversario',
  },
];

let inMemoryProduction = [...initialProductionItems];

export const productionService = {
  getItems: async (filter?: { stage?: ProductionStage; priority?: string; search?: string }): Promise<ProductionItem[]> => {
    const all = await productionService.getProductionItems();
    let result = [...all];
    if (filter?.stage) {
      result = result.filter(i => i.stage === filter.stage);
    }
    if (filter?.priority && filter.priority !== 'all') {
      result = result.filter(i => i.priority === filter.priority);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(i =>
        i.eventName.toLowerCase().includes(q) ||
        i.clientName.toLowerCase().includes(q) ||
        i.assignedTo.toLowerCase().includes(q)
      );
    }
    return result;
  },

  advanceStage: async (id: string, nextStage: ProductionStage): Promise<boolean> => {
    return productionService.updateStage(id, nextStage);
  },

  getProductionItems: async (): Promise<ProductionItem[]> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('produccion_eventos').select('*');
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            eventId: d.evento_id,
            eventName: d.evento_titulo || 'Evento en Producción',
            clientName: d.cliente_nombre || 'Cliente',
            clientEmail: d.cliente_email,
            eventDate: d.fecha_evento || 'Por definir',
            plan: d.plan || 'Imperial Gold',
            stage: d.etapa as ProductionStage,
            assignedTo: d.responsable_nombre || 'Equipo Atelier',
            daysInStage: d.dias_en_etapa || 1,
            priority: d.prioridad || 'normal',
            unresolvedComments: d.comentarios_pendientes || 0,
            paymentStatus: d.estado_pago || 'al_dia',
            version: d.version_actual || 'v1.0.0',
            notes: d.notas_produccion,
            slug: d.slug,
          }));
        }
      } catch (err) {
        console.warn('Supabase produccion_eventos query failed, using in-memory', err);
      }
    }
    return [...inMemoryProduction];
  },

  updateStage: async (
    id: string,
    newStage: ProductionStage,
    authorName: string = 'Patricia Ramos'
  ): Promise<boolean> => {
    const item = inMemoryProduction.find((p) => p.id === id);
    if (item) {
      const oldStage = item.stage;
      item.stage = newStage;
      item.daysInStage = 0;

      await logAudit({
        type: 'sistema',
        title: `Etapa de producción actualizada: ${item.eventName}`,
        description: `Se movió de "${oldStage}" a "${newStage}"`,
        author: authorName,
        action: 'UPDATE_PRODUCTION_STAGE',
        entityType: 'produccion',
        entityId: id,
        metadata: { oldStage, newStage, eventId: item.eventId },
      });
      return true;
    }
    return false;
  },

  assignResponsible: async (id: string, responsibleName: string): Promise<boolean> => {
    const item = inMemoryProduction.find((p) => p.id === id);
    if (item) {
      item.assignedTo = responsibleName;
      await logAudit({
        type: 'sistema',
        title: `Responsable reasignado en ${item.eventName}`,
        description: `Asignado a ${responsibleName}`,
        author: 'Admin Studio',
        action: 'REASSIGN_PRODUCTION',
        entityType: 'produccion',
        entityId: id,
      });
      return true;
    }
    return false;
  },

  addProductionNote: async (id: string, note: string): Promise<boolean> => {
    const item = inMemoryProduction.find((p) => p.id === id);
    if (item) {
      item.notes = `${item.notes ? item.notes + ' | ' : ''}${note}`;
      return true;
    }
    return false;
  },

  createNewVersion: async (id: string, newVersionTag: string): Promise<boolean> => {
    const item = inMemoryProduction.find((p) => p.id === id);
    if (item) {
      item.version = newVersionTag;
      await logAudit({
        type: 'aprobacion',
        title: `Nueva versión de invitación generada: ${newVersionTag}`,
        description: `Versión ${newVersionTag} creada para ${item.eventName}`,
        author: 'Equipo Atelier',
        action: 'CREATE_INVITATION_VERSION',
        entityType: 'invitaciones',
        entityId: item.eventId,
      });
      return true;
    }
    return false;
  },
};
