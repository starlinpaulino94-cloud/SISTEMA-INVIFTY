import { Lead } from '../types';
import { recordAuditEvent } from '../lib/audit';

// Initial high-fidelity leads dataset matching Stitch Screens (Image 5, 25, 27)
let memoryLeads: Lead[] = [
  {
    id: 'lead-1',
    code: '#LD-2026-089',
    name: 'María Fernández',
    partnerName: 'Carlos Rodríguez',
    email: 'maria.fernandez@gmail.com',
    phone: '+1 (829) 555-0142',
    eventType: 'Boda con Carlos Rodríguez',
    eventDate: '14 de Noviembre 2026',
    venue: 'Villa Florencia Luxury Estate, Jarabacoa',
    estimatedGuests: 150,
    plan: 'Premium',
    estimatedValue: 4000,
    status: 'calificado',
    origin: 'Instagram Ad · Campaña Bodas 2026',
    assignedTo: {
      id: 'usr-starlin',
      name: 'Starlin',
      role: 'Lead Producer & Ops',
    },
    notes: 'Cliente confirmó fecha fija y locación reservada. Solicita paquete con pases QR individuales y confirmación WhatsApp con save-the-date dinámico. Cotización #COT-2026-118 enviada formalmente.',
    closingProbability: 85,
    timeline: [
      {
        id: 't-1',
        author: 'Starlin (Lead Producer & Ops)',
        role: 'Lead Producer & Ops',
        date: 'Hoy, 10:30 AM',
        content: 'Cliente confirmó fecha fija y locación reservada. Solicita paquete con pases QR individuales y confirmación WhatsApp con save-the-date dinámico.',
      },
      {
        id: 't-2',
        author: 'Camila S.',
        role: 'Concierge Qualifier',
        date: 'Ayer, 4:00 PM',
        content: 'Llamada inicial de calificación de 12 minutos. Muy buena receptividad. Presupuesto pre-aprobado por ambos novios.',
      },
      {
        id: 't-3',
        author: 'Web Form Inbound',
        role: 'System Event',
        date: '23 Sep, 4:20 PM',
        content: 'Formulario completado desde Instagram Ads en landing page /bodas-lujo.',
      },
    ],
    createdAt: '2026-09-23T16:20:00Z',
  },
  {
    id: 'lead-2',
    code: '#LD-2026-090',
    name: 'Andrea Gómez',
    partnerName: 'Familia Gómez',
    email: 'andrea.gomez@gmail.com',
    phone: '+1 (809) 555-3412',
    eventType: 'Fiesta de 15 Años',
    eventDate: '21 Dic 2026',
    venue: 'JW Marriott Santo Domingo',
    estimatedGuests: 184,
    plan: 'Popular',
    estimatedValue: 2800,
    status: 'propuesta',
    origin: 'Web Directo · Formulario Landing',
    assignedTo: {
      id: 'usr-camila',
      name: 'Camila Santana',
      role: 'Event Stylist & Concierge',
    },
    notes: 'Padres solicitan pase digital interactivo con control estricto de seguridad en puerta.',
    closingProbability: 70,
    timeline: [
      {
        id: 't-21',
        author: 'Camila S.',
        role: 'Event Stylist',
        date: 'Ayer, 11:00 AM',
        content: 'Propuesta digital enviada vía WhatsApp con demo de plantilla Quinceañera Elegance.',
      },
    ],
    createdAt: '2026-09-22T10:00:00Z',
  },
  {
    id: 'lead-3',
    code: '#LD-2026-091',
    name: 'Lic. Roberto Almonte',
    partnerName: 'Dra. Álvarez Abreu',
    email: 'roberto.almonte@estudios.do',
    phone: '+1 (849) 555-8910',
    eventType: 'Bautizo & Almuerzo Privado',
    eventDate: '05 Oct 2026',
    venue: 'Los Cacicazgos, D.N.',
    estimatedGuests: 60,
    plan: 'Esencial',
    estimatedValue: 1800,
    status: 'nuevo',
    origin: 'Referido VIP · Dr. Álvarez',
    assignedTo: {
      id: 'usr-pedro',
      name: 'Pedro Morales',
      role: 'Account Manager',
    },
    notes: 'Referido VIP directo. Monograma y lista de invitados breve.',
    closingProbability: 90,
    timeline: [
      {
        id: 't-31',
        author: 'Pedro Morales',
        role: 'Account Manager',
        date: 'Hoy, 10:15 AM',
        content: 'Lead ingresado vía recomendación VIP. Asignado para primer contacto WhatsApp.',
      },
    ],
    createdAt: '2026-09-24T10:15:00Z',
  },
  {
    id: 'lead-4',
    code: '#LD-2026-092',
    name: 'Dra. Elena Tavárez',
    partnerName: 'Dr. Manuel Peña',
    email: 'elena.tavarez@cardio.do',
    phone: '+1 (809) 555-7762',
    eventType: 'Cumpleaños 50 Gala',
    eventDate: '18 Ene 2027',
    venue: 'Penthouse Piantini',
    estimatedGuests: 110,
    plan: 'Premium',
    estimatedValue: 4000,
    status: 'negociacion',
    origin: 'Instagram Reel · Viral Luxury',
    assignedTo: {
      id: 'usr-camila',
      name: 'Camila Santana',
      role: 'Event Stylist',
    },
    notes: 'Interesada en foil metálico y animaciones en pan de oro.',
    closingProbability: 75,
    timeline: [
      {
        id: 't-41',
        author: 'Camila Santana',
        role: 'Event Stylist',
        date: 'Ayer, 5:30 PM',
        content: 'Negociando inclusión de Save-The-Date vertical y catering RSVP.',
      },
    ],
    createdAt: '2026-09-21T14:30:00Z',
  },
  {
    id: 'lead-5',
    code: '#LD-2026-093',
    name: 'Sofía & Diego',
    partnerName: 'Diego Morales',
    email: 'sofia.nupcial@outlook.com',
    phone: '+1 (829) 555-6621',
    eventType: 'Boda Destino Punta Cana',
    eventDate: '28 Feb 2027',
    venue: 'Cap Cana Marina & Resort',
    estimatedGuests: 220,
    plan: 'A Medida',
    estimatedValue: 6500,
    status: 'nuevo',
    origin: 'TikTok Organic · Mensaje Directo',
    assignedTo: {
      id: 'usr-starlin',
      name: 'Starlin',
      role: 'Lead Producer & Ops',
    },
    notes: 'Boda bilingüe español/inglés con invitados viajando desde Madrid y Miami.',
    closingProbability: 60,
    timeline: [
      {
        id: 't-51',
        author: 'Starlin',
        role: 'Lead Producer',
        date: 'Ayer, 11:20 PM',
        content: 'Prospecto recibido por redes. Calificado para paquete A Medida.',
      },
    ],
    createdAt: '2026-09-23T23:20:00Z',
  },
];

export const leadsService = {
  getAll: async (): Promise<Lead[]> => {
    return [...memoryLeads];
  },

  getLeads: async (): Promise<Lead[]> => {
    return [...memoryLeads];
  },

  getById: async (id: string): Promise<Lead | undefined> => {
    return memoryLeads.find(l => l.id === id);
  },

  create: async (data: any): Promise<Lead> => {
    const newLead: Lead = {
      ...data,
      id: `lead-${Date.now()}`,
      code: `#LD-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          id: `t-${Date.now()}`,
          author: 'Starlin (Lead Producer & Ops)',
          role: 'Lead Producer',
          date: 'Ahora mismo',
          content: 'Prospecto registrado exitosamente en el sistema Invifty Atelier.',
        },
      ],
    };
    memoryLeads = [newLead, ...memoryLeads];

    await recordAuditEvent({
      actorName: 'Starlin',
      actorRole: 'Lead Producer & Ops',
      action: `Nuevo prospecto registrado: ${newLead.name}`,
      entityType: 'lead',
      entityId: newLead.id,
      metadata: { code: newLead.code, value: newLead.estimatedValue },
    });

    return newLead;
  },

  createLead: async (data: any): Promise<Lead> => {
    return leadsService.create(data);
  },

  updateStatus: async (id: string, status: any): Promise<Lead> => {
    const lead = memoryLeads.find(l => l.id === id);
    if (!lead) throw new Error('Lead not found');
    lead.status = status;
    lead.timeline = lead.timeline || [];
    lead.timeline.unshift({
      id: `t-${Date.now()}`,
      author: 'Starlin (Lead Producer & Ops)',
      role: 'Lead Producer',
      date: 'Hace un momento',
      content: `Estado actualizado a "${status.toUpperCase()}".`,
    });

    await recordAuditEvent({
      actorName: 'Starlin',
      actorRole: 'Lead Producer & Ops',
      action: `Estado de lead cambiado a: ${status}`,
      entityType: 'lead',
      entityId: lead.id,
    });

    return lead;
  },

  updateLeadStatus: async (id: string, status: any): Promise<Lead> => {
    return leadsService.updateStatus(id, status);
  },

  convertToClientAndEvent: async (leadId: string): Promise<{ success: boolean; eventId?: string }> => {
    const lead = memoryLeads.find(l => l.id === leadId);
    if (!lead) return { success: false };
    lead.status = 'convertido';

    await recordAuditEvent({
      actorName: 'Starlin',
      actorRole: 'Lead Producer & Ops',
      action: `Lead ${lead.code} (${lead.name}) convertido a Cliente y Evento de Producción`,
      entityType: 'lead',
      entityId: lead.id,
    });

    return { success: true, eventId: 'ev-maria-carlos' };
  },

  addTimelineNote: async (leadId: string, noteText: string): Promise<void> => {
    const lead = memoryLeads.find(l => l.id === leadId);
    if (!lead) return;
    lead.timeline = lead.timeline || [];
    lead.timeline.unshift({
      id: `t-${Date.now()}`,
      author: 'Starlin (Lead Producer & Ops)',
      role: 'Lead Producer & Ops',
      date: 'Ahora',
      content: noteText,
    });
  },
};
