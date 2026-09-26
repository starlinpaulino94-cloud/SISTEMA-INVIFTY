import { NotificationItem, NotificationCategory } from '../types';

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    category: 'reviews',
    title: 'Cambios solicitados en Boda Elena & Diego',
    message: 'El cliente ha añadido 3 comentarios en la sección Portada e Itinerario.',
    isRead: false,
    date: '2026-03-26T07:45:00Z',
    eventId: 'evt-1',
    priority: 'urgent'
  },
  {
    id: 'notif-2',
    category: 'payments',
    title: 'Comprobante de pago recibido',
    message: 'Valeria Montemayor ha enviado el comprobante de liquidación de $750 USD.',
    isRead: false,
    date: '2026-03-26T06:30:00Z',
    eventId: 'evt-2',
    priority: 'urgent'
  },
  {
    id: 'notif-3',
    category: 'guests',
    title: '15 Nuevas confirmaciones RSVP',
    message: 'Se confirmaron 15 pases para la Boda Elena & Diego en las últimas 12 horas.',
    isRead: false,
    date: '2026-03-25T22:15:00Z',
    eventId: 'evt-1',
    priority: 'normal'
  },
  {
    id: 'notif-4',
    category: 'leads',
    title: 'Nuevo Lead Calificado',
    message: 'Ingeniero Mauricio Garza solicitó cotización para Aniversario de Oro (250 invitados).',
    isRead: true,
    date: '2026-03-25T17:00:00Z',
    priority: 'normal'
  },
  {
    id: 'notif-5',
    category: 'system',
    title: 'Copia de seguridad completada',
    message: 'Snapshot de base de datos Supabase ejecutado exitosamente a las 03:00 UTC.',
    isRead: true,
    date: '2026-03-25T03:00:00Z',
    priority: 'normal'
  }
];

class NotificationsService {
  private notifications: NotificationItem[] = [...initialNotifications];

  async getNotifications(category?: NotificationCategory | 'all'): Promise<NotificationItem[]> {
    if (category && category !== 'all') {
      return this.notifications.filter(n => n.category === category);
    }
    return [...this.notifications];
  }

  async markAsRead(id: string): Promise<void> {
    const item = this.notifications.find(n => n.id === id);
    if (item) item.isRead = true;
  }

  async markAllAsRead(): Promise<void> {
    this.notifications.forEach(n => { n.isRead = true; });
  }

  async addNotification(notif: Omit<NotificationItem, 'id' | 'date'>): Promise<NotificationItem> {
    const newItem: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      date: new Date().toISOString()
    };
    this.notifications.unshift(newItem);
    return newItem;
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }
}

export const notificationsService = new NotificationsService();
