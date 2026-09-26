import { CheckinItem } from '../types';
import { logAudit } from '../lib/audit';

export const initialCheckins: CheckinItem[] = [
  {
    id: 'chk-1',
    eventId: 'evt-1',
    guestId: 'gst-1',
    guestName: 'Elena Rostova',
    tableNumber: '01',
    passesTotal: 2,
    passesCheckedIn: 2,
    timestamp: '2026-03-25T18:05:00Z',
    method: 'qr_scan',
    operator: 'Mateo Sandoval (Concierge)'
  },
  {
    id: 'chk-2',
    eventId: 'evt-1',
    guestId: 'gst-2',
    guestName: 'Lic. Jorge Cavazos',
    tableNumber: '04',
    passesTotal: 2,
    passesCheckedIn: 2,
    timestamp: '2026-03-25T18:22:15Z',
    method: 'qr_scan',
    operator: 'Mateo Sandoval (Concierge)'
  },
  {
    id: 'chk-3',
    eventId: 'evt-1',
    guestId: 'gst-3',
    guestName: 'Mariana Treviño',
    tableNumber: '04',
    passesTotal: 1,
    passesCheckedIn: 1,
    timestamp: '2026-03-25T18:31:00Z',
    method: 'manual',
    operator: 'Carolina Herrera (Check-in Hostess)'
  }
];

class CheckinService {
  private checkins: CheckinItem[] = [...initialCheckins];

  async getCheckinsByEvent(eventId: string): Promise<CheckinItem[]> {
    return this.checkins.filter(c => c.eventId === eventId);
  }

  async recordCheckin(data: Omit<CheckinItem, 'id' | 'timestamp'>): Promise<CheckinItem> {
    const newRecord: CheckinItem = {
      ...data,
      id: `chk-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    this.checkins.unshift(newRecord);
    logAudit({
      actor: data.operator,
      action: 'Registro de Check-in en Puerta',
      target: data.guestName,
      details: `${data.passesCheckedIn}/${data.passesTotal} pases validados por ${data.method === 'qr_scan' ? 'Escáner QR' : 'Búsqueda Manual'}`
    });
    return newRecord;
  }

  async voidCheckin(id: string, reason: string): Promise<boolean> {
    const item = this.checkins.find(c => c.id === id);
    if (item) {
      item.isVoided = true;
      item.voidReason = reason;
      logAudit({
        actor: 'Studio Supervisor',
        action: 'Anulación de Check-in',
        target: item.guestName,
        details: `Check-in anulado. Motivo: ${reason}`
      });
      return true;
    }
    return false;
  }
}

export const checkinService = new CheckinService();
