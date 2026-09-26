import { CommercialPlan, CommercialExtra } from '../types';
import { logAudit } from '../lib/audit';

export const initialPlans: CommercialPlan[] = [
  {
    id: 'plan-1',
    name: 'Esencial',
    price: 390,
    currency: 'USD',
    durationMonths: 6,
    capabilities: [
      'Plantilla predefinida curada',
      'RSVP interactivo ilimitado',
      'Cuenta regresiva en vivo',
      'Mesa de regalos con datos bancarios',
      'Integración con Google Maps / Waze',
      'Soporte por email'
    ],
    reviewsIncluded: 2,
    isActive: true,
    featured: false
  },
  {
    id: 'plan-2',
    name: 'Popular',
    price: 690,
    currency: 'USD',
    durationMonths: 12,
    capabilities: [
      'Todo lo del Plan Esencial',
      'Personalización cromática y tipográfica completa',
      'Música de fondo ambiental con reproductor de lujo',
      'Gestor de pases nominativos con Código QR',
      'Módulo de Seating Plan & Asignación de mesas',
      'Dominio personalizado opcional',
      'Portal exclusivo para los anfitriones'
    ],
    reviewsIncluded: 4,
    isActive: true,
    featured: true
  },
  {
    id: 'plan-3',
    name: 'Premium Atelier',
    price: 1200,
    currency: 'USD',
    durationMonths: 24,
    capabilities: [
      'Todo lo del Plan Popular',
      'Diseño 100% a medida desde cero en Atelier Studio',
      'Animaciones y micro-interacciones de alta fidelidad',
      'Concierge WhatsApp dedicado 24/7',
      'PWA instalable para invitados y anfitriones',
      'Escáner QR para control de acceso en puerta',
      'Reporte analítico post-evento en PDF'
    ],
    reviewsIncluded: 8,
    isActive: true,
    featured: false
  }
];

export const initialExtras: CommercialExtra[] = [
  {
    id: 'ext-1',
    name: 'Ronda de revisión adicional',
    description: '1 iteración completa de cambios fuera del paquete base.',
    price: 75,
    currency: 'USD',
    isActive: true
  },
  {
    id: 'ext-2',
    name: 'Dominio personalizado (.com / .wedding)',
    description: 'Registro, certificado SSL y vinculación por 12 meses.',
    price: 49,
    currency: 'USD',
    isActive: true
  },
  {
    id: 'ext-3',
    name: 'Servicio de Concierge en Vivo en Recepción',
    description: 'Personal de Invifty operando la mesa de bienvenida con tableta para check-in QR.',
    price: 250,
    currency: 'USD',
    isActive: true
  },
  {
    id: 'ext-4',
    name: 'PWA Nativa App Store / Play Store wrapper',
    description: 'Empaquetado y publicación como aplicación descargable.',
    price: 350,
    currency: 'USD',
    isActive: true
  }
];

class PlansService {
  private plans: CommercialPlan[] = [...initialPlans];
  private extras: CommercialExtra[] = [...initialExtras];

  async getPlans(): Promise<CommercialPlan[]> {
    return [...this.plans];
  }

  async getExtras(): Promise<CommercialExtra[]> {
    return [...this.extras];
  }

  async updatePlan(id: string, updates: Partial<CommercialPlan>): Promise<CommercialPlan | null> {
    const idx = this.plans.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.plans[idx] = { ...this.plans[idx], ...updates };
      logAudit({
        actor: 'Superadmin',
        action: 'Actualización de Plan Comercial',
        target: this.plans[idx].name,
        details: `Precio o capacidades actualizadas`
      });
      return this.plans[idx];
    }
    return null;
  }

  async updateExtra(id: string, updates: Partial<CommercialExtra>): Promise<CommercialExtra | null> {
    const idx = this.extras.findIndex(e => e.id === id);
    if (idx !== -1) {
      this.extras[idx] = { ...this.extras[idx], ...updates };
      return this.extras[idx];
    }
    return null;
  }
}

export const plansService = new PlansService();
