import { EventWorkspaceData } from '../types';
import { recordAuditEvent } from '../lib/audit';

export const primaryDemoEvent: EventWorkspaceData = {
  id: 'ev-maria-carlos',
  code: '#EV-2026-904',
  title: 'María Fernández & Carlos Rodríguez',
  eventType: 'Boda Elegante Nocturna',
  date: '24 de Octubre, 2026',
  dateFormatted: '24 de Octubre, 2026',
  ceremonyTime: '5:00 PM',
  countdownDays: 29,
  venue: 'Villa Florencia Luxury Estate',
  location: 'Jarabacoa, La Vega',
  venueCoordinates: '19.1245,-70.6432',
  plan: 'Imperial Gold ($4,200 USD)',
  slug: 'maria-carlos',
  publicUrl: '/invitation/maria-carlos',
  status: 'live',
  
  contractCode: '#CT-2026-F4',
  totalContracted: 4200,
  totalPaid: 2700,
  balanceDue: 1500,
  lastPaymentRef: '#BP-8819024',
  
  productionStatus: 'revision_cliente',
  productionStep: 3,
  version: 'v2.4.0',
  
  totalGuestsTarget: 280,
  totalGuests: 280,
  confirmedGuests: 194,
  pendingGuests: 58,
  declinedGuests: 28,
  qrPassesReady: 89,
  
  totalVisits: 1284,
  uniqueVisitors: 734,
  qrPassesDownloaded: 68,
  
  brideName: 'María Fernández',
  bridePhone: '+1 (829) 555-0142',
  groomName: 'Carlos Rodríguez',
  groomPhone: '+1 (809) 555-4422',
  plannerName: 'Lic. Patricia Ramos',
  plannerPhone: '+1 (849) 555-8810',
  dressCode: 'Black Tie / Gala Clásica',

  primaryContact: {
    name: 'María Fernández',
    role: 'Novia',
    email: 'maria.fernandez@gmail.com',
    phone: '+1 (829) 555-0142',
  },
  secondaryContact: {
    name: 'Carlos Rodríguez',
    role: 'Novio',
    email: 'carlos.rdgz@corp.do',
    phone: '+1 (809) 555-4422',
  },
  planner: {
    name: 'Lic. Patricia Ramos',
    role: 'Wedding Planner Certificada',
    phone: '+1 (849) 555-8810',
    agency: 'Ramos Event Atelier',
  },

  timeline: [
    { title: 'Aprobación de Boceto y Tipografía Editorial', time: '12 Ago 2026', status: 'completed' },
    { title: 'Lanzamiento de Pre-Invitación (Save the Date)', time: '28 Ago 2026', status: 'completed' },
    { title: 'Apertura de Confirmación RSVP Dinámica PWA', time: '10 Sep 2026', status: 'completed' },
    { title: 'Cierre de Lista y Generación de Pases QR Apple Wallet', time: '14 Oct 2026', status: 'pending' },
    { title: 'Día de la Boda — Control de Acceso en Puerta', time: '24 Oct 2026', status: 'pending' },
  ],

  recentActivity: [
    { id: '1', user: 'Ana Gómez', time: 'Hace 8 min', description: 'Confirmó asistencia con acompañante (Roberto Gómez)' },
    { id: '2', user: 'Lic. Patricia Ramos', time: 'Hace 1h', description: 'Revisó seating plan y asignó Mesa 01 Imperial' },
    { id: '3', user: 'Concierge Finanzas', time: 'Hace 3h', description: 'Abono de $600 USD verificado' },
  ],
  
  immediateActions: [
    {
      id: 'act-1',
      type: 'review',
      title: 'Comentarios en Diseño (V4)',
      description: 'La novia revisó la versión 4 y dejó 2 observaciones críticas en la sección Portada (ajuste de tipografía) y Código de Vestimenta (especificación Black Tie).',
      urgencyText: 'Hace 4h',
      actionLabel: 'Resolver Comentarios',
    },
    {
      id: 'act-2',
      type: 'payment',
      title: 'Segundo Pago Pendiente',
      description: 'Comprobante de saldo acordado por valor de RD$1,500 pendiente de emisión o recepción de comprobante bancario por parte del cliente.',
      urgencyText: 'Vence en 5 días',
      actionLabel: 'Subir Comprobante',
    },
  ],
};

let allEvents: EventWorkspaceData[] = [primaryDemoEvent];

export const eventsService = {
  getWorkspaceData: async (_eventId?: string): Promise<EventWorkspaceData> => {
    return { ...primaryDemoEvent };
  },

  getEventById: async (id: string): Promise<EventWorkspaceData | undefined> => {
    return allEvents.find(e => e.id === id) || primaryDemoEvent;
  },

  getAllEvents: async (): Promise<EventWorkspaceData[]> => {
    return [...allEvents];
  },

  updateProductionStep: async (eventId: string, step: number): Promise<void> => {
    const event = allEvents.find(e => e.id === eventId || e.id === 'ev-maria-carlos');
    if (event) {
      event.productionStep = step;
      await recordAuditEvent({
        actorName: 'Starlin',
        actorRole: 'Lead Producer & Ops',
        action: `Paso de producción actualizado al Paso ${step}`,
        entityType: 'event',
        entityId: event.id,
      });
    }
  },

  registerPayment: async (amount: number, reference: string): Promise<void> => {
    primaryDemoEvent.totalPaid = (primaryDemoEvent.totalPaid || 0) + amount;
    primaryDemoEvent.balanceDue = Math.max(0, (primaryDemoEvent.totalContracted || 4200) - (primaryDemoEvent.totalPaid || 0));
    primaryDemoEvent.lastPaymentRef = reference;

    await recordAuditEvent({
      actorName: 'Starlin',
      actorRole: 'Finanzas & Ops',
      action: `Pago registrado: RD$${amount.toLocaleString()} (Ref: ${reference})`,
      entityType: 'pago',
      entityId: reference,
      metadata: { amount, balanceRemaining: primaryDemoEvent.balanceDue },
    });
  },
};
