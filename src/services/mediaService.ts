import { MediaItem } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { logAudit } from '../lib/audit';

export const initialMediaItems: MediaItem[] = [
  {
    id: 'med-1',
    filename: 'boda_elena_diego_portada_4k.webp',
    type: 'image',
    sizeBytes: 2450000,
    sizeFormatted: '2.45 MB',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
    eventId: 'evt-1',
    eventName: 'Boda Elena & Diego',
    clientName: 'Elena Rostova & Diego Morales',
    usage: 'Portada Hero',
    createdAt: '2026-03-12T10:15:00Z',
    isPrivate: false,
  },
  {
    id: 'med-2',
    filename: 'save_the_date_teaser_1080p.mp4',
    type: 'video',
    sizeBytes: 18400000,
    sizeFormatted: '18.4 MB',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-bride-and-groom-holding-each-other-43521-large.mp4',
    eventId: 'evt-1',
    eventName: 'Boda Elena & Diego',
    clientName: 'Elena Rostova & Diego Morales',
    usage: 'Video Teaser',
    createdAt: '2026-03-14T16:20:00Z',
    isPrivate: false,
  },
  {
    id: 'med-3',
    filename: 'musica_vals_imperial_chopin.mp3',
    type: 'audio',
    sizeBytes: 4200000,
    sizeFormatted: '4.20 MB',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    eventId: 'evt-1',
    eventName: 'Boda Elena & Diego',
    clientName: 'Elena Rostova & Diego Morales',
    usage: 'Audio de Fondo',
    createdAt: '2026-03-15T11:05:00Z',
    isPrivate: false,
  },
  {
    id: 'med-4',
    filename: 'xv_valeria_sesion_estudio_01.webp',
    type: 'image',
    sizeBytes: 3100000,
    sizeFormatted: '3.10 MB',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
    eventId: 'evt-2',
    eventName: 'XV Valeria Montemayor',
    clientName: 'Dra. Carmen Montemayor',
    usage: 'Galería Principal',
    createdAt: '2026-03-16T14:40:00Z',
    isPrivate: false,
  },
  {
    id: 'med-5',
    filename: 'comprobante_bancario_anticipo_elena.pdf',
    type: 'document',
    sizeBytes: 850000,
    sizeFormatted: '850 KB',
    url: '#',
    eventId: 'evt-1',
    eventName: 'Boda Elena & Diego',
    clientName: 'Elena Rostova',
    usage: 'Comprobante de Pago',
    createdAt: '2026-03-10T09:00:00Z',
    isPrivate: true,
  }
];

class MediaService {
  private media: MediaItem[] = [...initialMediaItems];

  async getMedia(filter?: { eventId?: string; type?: string; search?: string }): Promise<MediaItem[]> {
    let result = [...this.media];
    if (filter?.eventId) {
      result = result.filter(m => m.eventId === filter.eventId);
    }
    if (filter?.type && filter.type !== 'all') {
      result = result.filter(m => m.type === filter.type);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(m =>
        m.filename.toLowerCase().includes(q) ||
        (m.eventName && m.eventName.toLowerCase().includes(q)) ||
        (m.clientName && m.clientName.toLowerCase().includes(q)) ||
        m.usage.toLowerCase().includes(q)
      );
    }
    return result;
  }

  async uploadItem(item: Omit<MediaItem, 'id' | 'createdAt'>): Promise<MediaItem> {
    const newItem: MediaItem = {
      ...item,
      id: `med-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.media.unshift(newItem);
    logAudit({
      actor: 'Studio Operaciones',
      action: 'Subida de activo multimedia',
      target: newItem.filename,
      details: `Archivo ${newItem.filename} (${newItem.sizeFormatted}) asociado a ${newItem.eventName || 'Global'}`
    });
    return newItem;
  }

  async deleteItem(id: string): Promise<boolean> {
    const idx = this.media.findIndex(m => m.id === id);
    if (idx !== -1) {
      const deleted = this.media.splice(idx, 1)[0];
      logAudit({
        actor: 'Studio Operaciones',
        action: 'Eliminación de multimedia',
        target: deleted.filename,
        details: `Activo ${deleted.filename} eliminado del repositorio`
      });
      return true;
    }
    return false;
  }
}

export const mediaService = new MediaService();
