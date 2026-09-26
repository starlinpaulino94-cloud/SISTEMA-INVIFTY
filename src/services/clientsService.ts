import { Client } from '../types';
import { recordAuditEvent } from '../lib/audit';

let memoryClients: Client[] = [
  {
    id: 'cli-1',
    name: 'María Fernández',
    title: 'Novia Titular',
    email: 'maria.fernandez@gmail.com',
    phone: '+1 (829) 555-0142',
    totalEvents: 1,
    activeEvents: 1,
    activeSlug: 'invifty.com/i/maria-carlos',
    activeSlugStatus: 'en_vivo',
    totalContracted: 4000,
    balanceDue: 1500,
    isVip: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    eventsList: [
      {
        id: 'ev-1',
        title: 'Boda María & Carlos',
        date: '14 Nov 2026',
        status: 'En Producción (Revisión V4)',
      },
    ],
  },
  {
    id: 'cli-2',
    name: 'Lic. María Almonte',
    title: 'Wedding Planner / Partner VIP',
    email: 'maria@almonteevents.com',
    phone: '+1 (809) 555-8810',
    totalEvents: 3,
    activeEvents: 2,
    activeSlug: 'almonte.invifty.pro',
    activeSlugStatus: 'en_vivo',
    totalContracted: 12500,
    balanceDue: 0,
    isVip: true,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    eventsList: [
      {
        id: 'ev-almonte-1',
        title: 'Boda Magna Jardín Botánico',
        date: 'Hoy 6:00 PM',
        status: 'Revisión Cliente',
      },
      {
        id: 'ev-almonte-2',
        title: 'Gala Aniversario Punta Cana',
        date: '12 Dic 2026',
        status: 'Diseño & Arte',
      },
    ],
  },
  {
    id: 'cli-3',
    name: 'Andrea Gómez & Fam.',
    title: 'Anfitriones XV Años',
    email: 'andrea.gomez@gmail.com',
    phone: '+1 (809) 555-3412',
    totalEvents: 1,
    activeEvents: 1,
    activeSlug: 'invifty.com/i/andrea-xv',
    activeSlugStatus: 'revision',
    totalContracted: 2800,
    balanceDue: 1400,
    isVip: false,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    eventsList: [
      {
        id: 'ev-gomez',
        title: '15 Años Andrea Gómez',
        date: '21 Dic 2026',
        status: 'Borrador v2 · En Revisión',
      },
    ],
  },
  {
    id: 'cli-4',
    name: 'Juan Rodríguez & Fam.',
    title: 'Constructora Rodríguez',
    email: 'j.rodriguez@constructora.do',
    phone: '+1 (849) 555-4321',
    totalEvents: 1,
    activeEvents: 1,
    activeSlug: 'invifty.com/i/juan-50',
    activeSlugStatus: 'en_vivo',
    totalContracted: 5000,
    balanceDue: 0,
    isVip: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    eventsList: [
      {
        id: 'ev-juan',
        title: 'Cumpleaños Casa de Campo',
        date: '02 Nov 2026',
        status: 'PWA En Vivo (Acceso QR)',
      },
    ],
  },
  {
    id: 'cli-5',
    name: 'Carla Peña & Miguel V.',
    title: 'Novios Casa de Campo',
    email: 'carla.pena@hotmail.com',
    phone: '+1 (829) 555-9012',
    totalEvents: 1,
    activeEvents: 1,
    activeSlug: 'invifty.com/i/carla-miguel',
    activeSlugStatus: 'expirado',
    totalContracted: 3800,
    balanceDue: 0,
    isVip: false,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    eventsList: [
      {
        id: 'ev-carla',
        title: 'Boda Marina Casa de Campo',
        date: '28 Sep 2026',
        status: 'Expira en 4 días',
      },
    ],
  },
];

export const clientsService = {
  getAll: async (): Promise<Client[]> => {
    return [...memoryClients];
  },

  getClients: async (): Promise<Client[]> => {
    return [...memoryClients];
  },

  getById: async (id: string): Promise<Client | undefined> => {
    return memoryClients.find(c => c.id === id);
  },

  create: async (data: Omit<Client, 'id' | 'eventsList'>): Promise<Client> => {
    const newClient: Client = {
      ...data,
      id: `cli-${Date.now()}`,
      eventsList: [],
    };
    memoryClients = [newClient, ...memoryClients];

    await recordAuditEvent({
      actorName: 'Starlin',
      actorRole: 'Lead Producer & Ops',
      action: `Nuevo cliente registrado: ${newClient.name}`,
      entityType: 'client',
      entityId: newClient.id,
    });

    return newClient;
  },
};
