import { Guest } from '../types';
import { recordAuditEvent } from '../lib/audit';

let memoryGuests: Guest[] = [
  {
    id: 'gst-1',
    code: '#INV-8901',
    name: 'Ana Gómez',
    companionName: 'Roberto Gómez',
    category: 'Familia Novia',
    phone: '+1 (829) 555-0142',
    email: 'ana.gomez@gmail.com',
    passesAllowed: 2,
    passesConfirmed: 2,
    status: 'confirmado',
    tableNumber: 2,
    tableName: 'Mesa 2 · Terraza Jardín',
    menu: 'Vegetariano Gourmet (Risotto de Hongos Silvestres)',
    allergies: 'Roberto Gómez: Alergia severa a Mariscos',
    isVip: true,
    notes: 'Amiga de la universidad de María. Sentarla cerca de la pista de baile y lejos de las bocinas principales.',
    qrPassSent: true,
    checkedIn: true,
    checkedInCount: 2,
    members: [
      {
        id: 'm-1',
        name: 'Ana Gómez',
        role: 'titular',
        qrCode: 'QR-ANA-8901-1',
        menu: 'Vegetariano Gourmet (Risotto de Hongos)',
        checkedIn: true,
        checkedInTime: '8:08 PM',
      },
      {
        id: 'm-2',
        name: 'Roberto Gómez',
        role: 'acompaniante',
        qrCode: 'QR-ANA-8901-2',
        menu: 'Clásico Premium (Filete Angus al Malbec)',
        allergies: 'Alergia a Mariscos',
        checkedIn: true,
        checkedInTime: '8:08 PM',
      },
    ],
  },
  {
    id: 'gst-2',
    code: '#INV-8902',
    name: 'Familia Pérez',
    companionName: 'Carmen, Diego & Sofía Pérez',
    category: 'Familia Novio',
    phone: '+1 (809) 555-9871',
    passesAllowed: 4,
    passesConfirmed: 4,
    status: 'confirmado',
    tableNumber: 5,
    tableName: 'Mesa 5 · Jardín Central',
    menu: 'Estándar Premium',
    allergies: 'Carmen Pérez: Menú Celíaco Especial (Gluten Free)',
    isVip: false,
    notes: 'Avisar a jefa de cocina sobre plato especial sin gluten para Carmen en mesa 5.',
    qrPassSent: true,
    checkedIn: true,
    checkedInCount: 4,
    members: [
      { id: 'p-1', name: 'Roberto Pérez', role: 'titular', qrCode: 'QR-PEREZ-1', menu: 'Estándar', checkedIn: true, checkedInTime: '8:14 PM' },
      { id: 'p-2', name: 'Carmen Pérez', role: 'acompaniante', qrCode: 'QR-PEREZ-2', menu: 'Celíaco Especial', allergies: 'Gluten Free', checkedIn: true, checkedInTime: '8:14 PM' },
      { id: 'p-3', name: 'Diego Pérez', role: 'acompaniante', qrCode: 'QR-PEREZ-3', menu: 'Estándar', checkedIn: true, checkedInTime: '8:14 PM' },
      { id: 'p-4', name: 'Sofía Pérez', role: 'acompaniante', qrCode: 'QR-PEREZ-4', menu: 'Estándar', checkedIn: true, checkedInTime: '8:14 PM' },
    ],
  },
  {
    id: 'gst-3',
    code: '#INV-8924',
    name: 'Familia Álvarez Vega',
    companionName: '4 Integrantes Confirmados',
    category: 'VIP',
    phone: '+1 (849) 555-2234',
    passesAllowed: 4,
    passesConfirmed: 4,
    status: 'confirmado',
    tableNumber: 2,
    tableName: 'Mesa 2 · Terraza Jardín (Honor)',
    menu: 'Menú Gourmet Signature',
    isVip: true,
    notes: 'Tíos directos del novio. Asientos reservados preferenciales.',
    qrPassSent: true,
    checkedIn: true,
    checkedInCount: 4,
    members: [
      { id: 'av-1', name: 'Dr. Álvarez', role: 'titular', qrCode: 'QR-ALV-1', menu: 'Gourmet', checkedIn: true, checkedInTime: '7:55 PM' },
      { id: 'av-2', name: 'Sra. Vega de Álvarez', role: 'acompaniante', qrCode: 'QR-ALV-2', menu: 'Gourmet', checkedIn: true, checkedInTime: '7:55 PM' },
    ],
  },
  {
    id: 'gst-4',
    code: '#INV-8940',
    name: 'Carlos Morales & Acompañante',
    companionName: 'Acompañante por definir',
    category: 'Amigos',
    phone: '+1 (829) 555-0144',
    passesAllowed: 2,
    passesConfirmed: 0,
    status: 'pendiente',
    tableNumber: 0,
    tableName: 'Sin mesa asignada',
    menu: 'Pendiente selección',
    isVip: false,
    notes: 'Pendiente enviar recordatorio vía WhatsApp.',
    qrPassSent: false,
    checkedIn: false,
    checkedInCount: 0,
    members: [],
  },
  {
    id: 'gst-5',
    code: '#INV-8955',
    name: 'Diego Morales',
    companionName: 'No asistirá (Viaje de trabajo fuera)',
    category: 'Amigos',
    phone: '+1 (809) 555-3399',
    passesAllowed: 1,
    passesConfirmed: 0,
    status: 'declinado',
    tableNumber: 0,
    tableName: 'Liberó 1 puesto en Mesa',
    menu: 'N/A',
    isVip: false,
    notes: 'Mensaje de novios: "Muchas felicidades María y Carlos, un abrazo enorme desde Madrid. Estaré de viaje de trabajo."',
    qrPassSent: false,
    checkedIn: false,
    checkedInCount: 0,
    members: [],
  },
];

export const guestsService = {
  getAll: async (): Promise<Guest[]> => {
    return [...memoryGuests];
  },

  getById: async (id: string): Promise<Guest | undefined> => {
    return memoryGuests.find(g => g.id === id);
  },

  updateGuestSeating: async (guestId: string, tableNumber: number, tableName: string): Promise<Guest> => {
    const guest = memoryGuests.find(g => g.id === guestId);
    if (!guest) throw new Error('Guest not found');
    guest.tableNumber = tableNumber;
    guest.tableName = tableName;
    
    await recordAuditEvent({
      actorName: 'María Fernández',
      actorRole: 'Host / Novia',
      action: `Asignación de mesa actualizada para ${guest.name}: Mesa ${tableNumber}`,
      entityType: 'guest',
      entityId: guest.id,
    });
    return guest;
  },

  toggleCheckIn: async (guestId: string, memberId?: string): Promise<Guest> => {
    const guest = memoryGuests.find(g => g.id === guestId);
    if (!guest) throw new Error('Guest not found');

    const members = guest.members || [];
    if (memberId) {
      const member = members.find(m => m.id === memberId);
      if (member) {
        member.checkedIn = !member.checkedIn;
        member.checkedInTime = member.checkedIn ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined;
      }
      guest.checkedInCount = members.filter(m => m.checkedIn).length;
      guest.checkedIn = guest.checkedInCount > 0;
    } else {
      guest.checkedIn = !guest.checkedIn;
      guest.checkedInCount = guest.checkedIn ? (guest.passesConfirmed || 1) : 0;
      members.forEach(m => {
        m.checkedIn = guest.checkedIn || false;
        m.checkedInTime = guest.checkedIn ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined;
      });
    }

    await recordAuditEvent({
      actorName: 'Control Puerta Principal 1',
      actorRole: 'Check-in Operator',
      action: `Acceso en puerta registrado: ${guest.name} (${guest.checkedInCount}/${guest.passesConfirmed})`,
      entityType: 'checkin',
      entityId: guest.id,
    });

    return guest;
  },

  getGuests: async (_eventId?: string): Promise<Guest[]> => {
    return [...memoryGuests];
  },

  createGuest: async (newGuest: any): Promise<Guest> => {
    const created: Guest = {
      ...newGuest,
      id: `gst-${Date.now()}`,
      code: `#INV-${Math.floor(8900 + Math.random() * 99)}`,
      checkedIn: false,
      checkedInCount: 0,
      members: [
        {
          id: `m-${Date.now()}`,
          name: newGuest.name,
          role: 'titular',
          qrCode: `QR-${Date.now()}`,
          menu: newGuest.menu,
          allergies: newGuest.allergies || newGuest.dietaryNotes,
          checkedIn: false,
        },
      ],
    };
    memoryGuests = [created, ...memoryGuests];
    return created;
  },

  addGuest: async (newGuest: any): Promise<Guest> => {
    return guestsService.createGuest(newGuest);
  },

  updateGuest: async (id: string, updates: Partial<Guest>): Promise<Guest> => {
    const guest = memoryGuests.find(g => g.id === id);
    if (!guest) throw new Error('Guest not found');
    Object.assign(guest, updates);
    return guest;
  },

  deleteGuest: async (id: string): Promise<void> => {
    memoryGuests = memoryGuests.filter(g => g.id !== id);
  },

  updateRsvpByCode: async (code: string, updates: Partial<Guest>): Promise<void> => {
    const guest = memoryGuests.find(g => g.code === code);
    if (guest) {
      Object.assign(guest, updates);
    }
  },
};
