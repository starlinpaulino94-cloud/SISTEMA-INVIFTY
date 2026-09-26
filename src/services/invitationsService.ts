import { InvitationItem, GlobalInvitationStatus, InvitationContent } from '../types';
import { logAudit } from '../lib/audit';

export const sampleInvitationContent: InvitationContent = {
  coverTitle: 'Nuestra Boda Real',
  subtitle: 'Con la bendición de Dios y de nuestros padres',
  brideName: 'María Fernández',
  groomName: 'Carlos Rodríguez',
  eventDate: '24 de Octubre, 2026',
  ceremonyTime: '5:00 PM',
  receptionTime: '7:00 PM',
  venueName: 'Villa Florencia',
  locationAddress: 'Carretera Jarabacoa - Manabao Km 4, Jarabacoa, República Dominicana',
  dressCode: 'Black Tie Elegante (Damas Traje Largo / Caballeros Smoking)',
  storyTitle: 'Nuestra Historia',
  storyText: 'Nos conocimos hace siete años en una tarde de café en la Zona Colonial. Desde aquel primer día supimos que cada camino nos llevaba al mismo destino.',
  countdownDate: '2026-10-24T17:00:00Z',
  giftRegistryInfo: 'Su presencia es nuestro mayor regalo. Para quienes deseen honrarnos con un detalle, hemos preparado opciones digitales y mesa de regalos.',
  bankAccountInfo: 'Banco BHD León • Cuenta Corriente USD #09812-441-2 • RNC/ID titular',
  musicTitle: 'Canon in D Major (Orchestral Harp & Strings)',
  closingMessage: 'Esperamos celebrar juntos esta noche mágica e inolvidable.',
  scheduleItems: [
    { time: '4:30 PM', title: 'Llegada de Huéspedes & Cóctel de Bienvenida', description: 'Recepción en jardines frontales' },
    { time: '5:00 PM', title: 'Ceremonia Religiosa', description: 'Parroquia San Juan Bautista' },
    { time: '6:30 PM', title: 'Sesión Fotográfica & Champagne Hour', description: 'Terraza de los Pinos' },
    { time: '7:30 PM', title: 'Entrada de los Novios & Banquete de Gala', description: 'Gran Salón Imperial' },
    { time: '9:30 PM', title: 'Primer Baile & Fiesta con Orquesta', description: 'Pista de baile central' },
    { time: '2:00 AM', title: 'After Party & Caldo de Medianoche', description: 'Zona Lounge' },
  ],
  galleryUrls: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
  ],
};

export const initialInvitations: InvitationItem[] = [
  {
    id: 'inv-1',
    eventId: 'ev-maria-carlos',
    eventName: 'María Fernández & Carlos Rodríguez',
    clientName: 'María Fernández',
    templateId: 'tpl-1',
    templateName: 'Imperial Gold Royal',
    templateVersion: 'v2.4.0',
    status: 'published',
    publishedDate: '2026-09-01',
    expirationDate: '2026-11-24',
    views: 1284,
    rsvpCount: 224,
    slug: 'maria-carlos',
    customDomain: 'boda.maria-carlos.com',
    content: sampleInvitationContent,
  },
  {
    id: 'inv-2',
    eventId: 'ev-alejandro-valeria',
    eventName: 'Alejandro & Valeria Almonte',
    clientName: 'Valeria Almonte',
    templateId: 'tpl-2',
    templateName: 'Royal Heritage Classic',
    templateVersion: 'v1.1.0',
    status: 'review',
    views: 142,
    rsvpCount: 45,
    slug: 'alejandro-valeria',
    content: {
      ...sampleInvitationContent,
      coverTitle: 'Enlace Nupcial',
      brideName: 'Valeria Almonte',
      groomName: 'Alejandro Ramos',
      venueName: 'Casa de Campo Resort & Villas',
      eventDate: '14 de Noviembre, 2026',
    },
  },
  {
    id: 'inv-3',
    eventId: 'ev-gabriela-morales',
    eventName: 'Gala Benéfica Fundación Mir 2026',
    clientName: 'Vivian Morales',
    templateId: 'tpl-3',
    templateName: 'Atelier Velvet Gala',
    templateVersion: 'v3.0.0',
    status: 'published',
    publishedDate: '2026-08-15',
    expirationDate: '2026-12-15',
    views: 3410,
    rsvpCount: 380,
    slug: 'gala-mir-2026',
    content: {
      ...sampleInvitationContent,
      coverTitle: 'Gala Anual Benéfica 2026',
      brideName: 'Fundación MIR',
      groomName: 'Patronato de Gala',
      venueName: 'Anfiteatro Altos de Chavón',
      eventDate: '05 de Diciembre, 2026',
    },
  },
  {
    id: 'inv-4',
    eventId: 'ev-sofia-bautizo',
    eventName: 'Bautizo Real Sofía Patricia',
    clientName: 'Doña Elena Rodríguez',
    templateId: 'tpl-4',
    templateName: 'Signature Pearl Minimal',
    templateVersion: 'v1.0.0',
    status: 'draft',
    views: 24,
    rsvpCount: 0,
    slug: 'bautizo-sofia',
    content: {
      ...sampleInvitationContent,
      coverTitle: 'Bautizo de Sofía Patricia',
      brideName: 'Sofía Patricia',
      groomName: 'Familia Rodríguez Peña',
      venueName: 'Club Hemingway',
      eventDate: '18 de Diciembre, 2026',
    },
  },
];

let inMemoryInvitations = [...initialInvitations];

export const invitationsService = {
  getInvitations: async (filter?: { status?: GlobalInvitationStatus; search?: string }): Promise<InvitationItem[]> => {
    let result = [...inMemoryInvitations];
    if (filter?.status) {
      result = result.filter(i => i.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(i =>
        i.eventName.toLowerCase().includes(q) ||
        i.clientName.toLowerCase().includes(q) ||
        i.slug.toLowerCase().includes(q)
      );
    }
    return result;
  },

  getInvitationById: async (id: string): Promise<InvitationItem | null> => {
    const inv = inMemoryInvitations.find((item) => item.id === id);
    return inv ? { ...inv } : null;
  },

  updateContent: async (id: string, newContent: Partial<InvitationContent>): Promise<boolean> => {
    const inv = inMemoryInvitations.find((item) => item.id === id);
    if (inv) {
      inv.content = { ...inv.content, ...newContent };
      await logAudit({
        type: 'sistema',
        title: `Contenido de invitación actualizado: ${inv.eventName}`,
        description: 'Se modificaron datos editoriales y textos de la invitación.',
        author: 'Editor de Contenido',
        action: 'UPDATE_INVITATION_CONTENT',
        entityType: 'invitaciones',
        entityId: id,
      });
      return true;
    }
    return false;
  },

  updateStatus: async (id: string, newStatus: GlobalInvitationStatus): Promise<boolean> => {
    const inv = inMemoryInvitations.find((item) => item.id === id);
    if (inv) {
      inv.status = newStatus;
      if (newStatus === 'published' && !inv.publishedDate) {
        inv.publishedDate = new Date().toISOString().split('T')[0];
      }
      await logAudit({
        type: 'aprobacion',
        title: `Estado de invitación cambiado a "${newStatus}": ${inv.eventName}`,
        description: `Invitación ${inv.slug} ahora está en estado ${newStatus}`,
        author: 'Admin Studio',
        action: 'CHANGE_INVITATION_STATUS',
        entityType: 'invitaciones',
        entityId: id,
      });
      return true;
    }
    return false;
  },
};
