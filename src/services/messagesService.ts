import { MessageItem } from '../types';
import { logAudit } from '../lib/audit';

export const initialMessages: MessageItem[] = [
  {
    id: 'msg-1',
    eventId: 'evt-1',
    channel: 'whatsapp',
    recipientName: 'Elena Rostova',
    recipientContact: '+52 81 1234 5678',
    body: 'Hola Elena, tu invitación digital ya está disponible en su versión preliminar para revisión. Haz clic en el enlace adjunto para verla.',
    status: 'delivered',
    sentAt: '2026-03-24T12:00:00Z',
    sentBy: 'Carolina Herrera (Diseño)'
  },
  {
    id: 'msg-2',
    eventId: 'evt-1',
    channel: 'email',
    recipientName: 'Diego Morales',
    recipientContact: 'diego.morales@techholdings.mx',
    subject: 'Confirmación de Pago de Anticipo - Boda Elena & Diego',
    body: 'Estimado Diego, hemos verificado exitosamente tu transferencia por $1,200 USD. Tu proyecto ha avanzado a la etapa de Diseño.',
    status: 'opened',
    sentAt: '2026-03-10T14:30:00Z',
    sentBy: 'Sistema Invifty Concierge'
  },
  {
    id: 'msg-3',
    eventId: 'evt-1',
    channel: 'whatsapp',
    recipientName: 'Lic. Jorge Cavazos',
    recipientContact: '+52 81 8888 9999',
    body: 'Recordatorio cordial: Elena & Diego esperan contar con tu presencia. Tu mesa asignada es la Mesa 04.',
    status: 'delivered',
    sentAt: '2026-03-25T09:00:00Z',
    sentBy: 'Mateo Sandoval (Concierge)'
  }
];

class MessagesService {
  private messages: MessageItem[] = [...initialMessages];

  async getMessagesByEvent(eventId?: string): Promise<MessageItem[]> {
    if (eventId) {
      return this.messages.filter(m => m.eventId === eventId);
    }
    return [...this.messages];
  }

  async sendMessage(msg: Omit<MessageItem, 'id' | 'sentAt' | 'status'>): Promise<MessageItem> {
    const newMsg: MessageItem = {
      ...msg,
      id: `msg-${Date.now()}`,
      status: 'delivered',
      sentAt: new Date().toISOString()
    };
    this.messages.unshift(newMsg);
    logAudit({
      actor: msg.sentBy,
      action: `Envío de mensaje por ${msg.channel.toUpperCase()}`,
      target: msg.recipientName,
      details: `Mensaje enviado a ${msg.recipientContact}`
    });
    return newMsg;
  }
}

export const messagesService = new MessagesService();
