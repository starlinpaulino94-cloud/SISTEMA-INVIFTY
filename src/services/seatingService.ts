import { TableItem } from '../types';
import { logAudit } from '../lib/audit';

export const initialTables: TableItem[] = [
  {
    id: 'tbl-1',
    eventId: 'evt-1',
    number: '01',
    name: 'Mesa Presidencial / Novios',
    category: 'VIP Novios',
    capacity: 6,
    occupied: 6,
    assignedGuestNames: ['Elena Rostova', 'Diego Morales', 'Sofía Rostova (Madrina)', 'Carlos Morales (Padrino)', 'Sra. Carmen Morales', 'Dra. María Rostova'],
    dietaryAlert: '1 Celíaco, 1 Vegetariano'
  },
  {
    id: 'tbl-2',
    eventId: 'evt-1',
    number: '02',
    name: 'Familia Novia Directa',
    category: 'Familia',
    capacity: 10,
    occupied: 10,
    assignedGuestNames: ['Alejandro Rostova', 'Tía Beatriz', 'Primo Andrés', 'Lucía Rostova', 'Santiago Rostova', 'Mariana Garza', 'Ignacio Garza', 'Paulina Rostova', 'Mateo Rostova', 'Valeria Rostova'],
  },
  {
    id: 'tbl-3',
    eventId: 'evt-1',
    number: '03',
    name: 'Familia Novio Directa',
    category: 'Familia',
    capacity: 10,
    occupied: 9,
    assignedGuestNames: ['Don Ricardo Morales', 'Sra. Patricia Morales', 'Fernando Morales', 'Daniela Morales', 'Tío Roberto', 'Tía Mónica', 'Gabriel Morales', 'Cecilia Morales', 'Sebastián Morales'],
    dietaryAlert: 'Sin mariscos'
  },
  {
    id: 'tbl-4',
    eventId: 'evt-1',
    number: '04',
    name: 'Amigos Universidad Novios',
    category: 'Amigos',
    capacity: 10,
    occupied: 8,
    assignedGuestNames: ['Lic. Jorge Cavazos', 'Mariana Treviño', 'Dr. Pablo Sánchez', 'Camila Ortiz', 'Rodrigo Lozano', 'Fernanda Guerra', 'Javier Elizondo', 'Renata Garza'],
  },
  {
    id: 'tbl-5',
    eventId: 'evt-1',
    number: '05',
    name: 'Colegas Studio & Directivos',
    category: 'Corporativo',
    capacity: 8,
    occupied: 6,
    assignedGuestNames: ['Starlin Paulino', 'Carolina Herrera', 'Mateo Sandoval', 'Valeria Benítez', 'Rodrigo Albarrán', 'Invitado Especial'],
  }
];

class SeatingService {
  private tables: TableItem[] = [...initialTables];

  async getTablesByEvent(eventId: string): Promise<TableItem[]> {
    return this.tables.filter(t => t.eventId === eventId);
  }

  async addTable(table: Omit<TableItem, 'id' | 'occupied' | 'assignedGuestNames'>): Promise<TableItem> {
    const newTable: TableItem = {
      ...table,
      id: `tbl-${Date.now()}`,
      occupied: 0,
      assignedGuestNames: []
    };
    this.tables.push(newTable);
    logAudit({
      actor: 'Studio Concierge',
      action: 'Creación de Mesa en Plano',
      target: `Mesa ${newTable.number} - ${newTable.name}`,
      details: `Capacidad: ${newTable.capacity} asientos`
    });
    return newTable;
  }

  async updateTable(id: string, updates: Partial<TableItem>): Promise<TableItem | null> {
    const idx = this.tables.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.tables[idx] = { ...this.tables[idx], ...updates };
      return this.tables[idx];
    }
    return null;
  }

  async deleteTable(id: string): Promise<boolean> {
    const idx = this.tables.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.tables.splice(idx, 1);
      return true;
    }
    return false;
  }

  async assignGuestToTable(tableId: string, guestName: string): Promise<TableItem | null> {
    const table = this.tables.find(t => t.id === tableId);
    if (table) {
      if (table.occupied < table.capacity && !table.assignedGuestNames.includes(guestName)) {
        table.assignedGuestNames.push(guestName);
        table.occupied = table.assignedGuestNames.length;
        return table;
      }
    }
    return null;
  }

  async unassignGuestFromTable(tableId: string, guestName: string): Promise<TableItem | null> {
    const table = this.tables.find(t => t.id === tableId);
    if (table) {
      table.assignedGuestNames = table.assignedGuestNames.filter(g => g !== guestName);
      table.occupied = table.assignedGuestNames.length;
      return table;
    }
    return null;
  }
}

export const seatingService = new SeatingService();
