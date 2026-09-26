import { DemoItem } from '../types';
import { logAudit } from '../lib/audit';

export const initialDemos: DemoItem[] = [
  {
    id: 'demo-1',
    title: 'Gala Imperial Gold (Boda Clásica de Lujo)',
    templateId: 'tpl-1',
    templateName: 'Imperial Gold Royal',
    category: 'Boda',
    slug: 'demo-imperial-gold',
    status: 'published',
    views: 8940,
    createdDate: '2026-08-01',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
    url: 'https://invifty.com/demo/imperial-gold',
  },
  {
    id: 'demo-2',
    title: 'Minimal Velvet Editorial (Bodas Contemporáneas)',
    templateId: 'tpl-2',
    templateName: 'Royal Heritage Classic',
    category: 'Boda',
    slug: 'demo-velvet-editorial',
    status: 'published',
    views: 4520,
    createdDate: '2026-08-10',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600',
    url: 'https://invifty.com/demo/velvet-editorial',
  },
  {
    id: 'demo-3',
    title: 'Gala Benéfica & Eventos Institucionales',
    templateId: 'tpl-3',
    templateName: 'Atelier Velvet Gala',
    category: 'Gala / Corporativo',
    slug: 'demo-gala-institucional',
    status: 'published',
    views: 3180,
    createdDate: '2026-08-20',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600',
    url: 'https://invifty.com/demo/gala-institucional',
  },
  {
    id: 'demo-4',
    title: 'Bautizo & Baby Shower Real',
    templateId: 'tpl-4',
    templateName: 'Signature Pearl Minimal',
    category: 'Social / Infantil',
    slug: 'demo-bautizo-real',
    status: 'draft',
    views: 310,
    createdDate: '2026-09-05',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
    url: 'https://invifty.com/demo/bautizo-real',
  },
];

let inMemoryDemos = [...initialDemos];

export const demosService = {
  getDemos: async (filter?: { category?: string; search?: string }): Promise<DemoItem[]> => {
    let result = [...inMemoryDemos];
    if (filter?.category && filter.category !== 'all') {
      result = result.filter(d => d.category.toLowerCase().includes(filter.category!.toLowerCase()));
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(d => d.title.toLowerCase().includes(q) || d.templateName.toLowerCase().includes(q) || d.slug.toLowerCase().includes(q));
    }
    return result;
  },

  toggleStatus: async (id: string): Promise<boolean> => {
    const demo = inMemoryDemos.find((d) => d.id === id);
    if (demo) {
      demo.status = demo.status === 'published' ? 'draft' : 'published';
      await logAudit({
        type: 'sistema',
        title: `Estado de demostración cambiado: ${demo.title}`,
        description: `Nuevo estado: ${demo.status}`,
        author: 'Admin Studio',
        action: 'TOGGLE_DEMO_STATUS',
        entityType: 'demos',
        entityId: id,
      });
      return true;
    }
    return false;
  },

  createDemo: async (data: Partial<DemoItem>): Promise<DemoItem> => {
    const newDemo: DemoItem = {
      id: `demo-${Date.now()}`,
      title: data.title || 'Nueva Demostración',
      templateId: data.templateId || 'tpl-1',
      templateName: data.templateName || 'Imperial Gold Royal',
      category: data.category || 'Boda',
      slug: data.slug || `demo-${Date.now()}`,
      status: 'draft',
      views: 0,
      createdDate: new Date().toISOString().split('T')[0],
      thumbnailUrl: data.thumbnailUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
      url: `https://invifty.com/demo/${data.slug || Date.now()}`,
    };
    inMemoryDemos.unshift(newDemo);
    await logAudit({
      type: 'sistema',
      title: `Demostración creada: ${newDemo.title}`,
      description: `URL: ${newDemo.url}`,
      author: 'Admin Studio',
      action: 'CREATE_DEMO',
      entityType: 'demos',
      entityId: newDemo.id,
    });
    return newDemo;
  },
};
