/**
 * Core Domain Types for Invifty 2.0 Operating System
 */

export type Role = 'superadmin' | 'admin' | 'producer' | 'concierge' | 'designer' | 'host' | 'planner';

export type EventStatus = 'planning' | 'upcoming' | 'live' | 'completed' | 'archived' | 'cancelled';

export type OrderStatus = 'draft' | 'pending_payment' | 'partially_paid' | 'paid' | 'refunded' | 'cancelled';

export type ProductionStatus = 
  | 'info_pendiente'
  | 'en_diseno'
  | 'revision_interna'
  | 'revision_cliente'
  | 'aprobado'
  | 'publicar';

export type InvitationStatus = 'draft' | 'review' | 'published' | 'paused' | 'expired' | 'archived';

export type LeadStatus = 'todos' | 'nuevos' | 'contactados' | 'calificados' | 'propuesta' | 'negociacion' | 'convertidos';

export type RsvpStatus = 'confirmado' | 'pendiente' | 'declinado' | 'rechazado';

export interface Lead {
  id: string;
  code: string; // e.g. #LD-2026-089
  name: string;
  partnerName?: string;
  email: string;
  phone: string;
  eventType: string; // 'Boda', 'Quinceañera', 'Bautizo', etc.
  eventDate: string;
  venue?: string;
  location?: string;
  estimatedGuests: number;
  plan: 'Esencial' | 'Popular' | 'Premium' | 'A Medida' | string;
  estimatedValue?: number; // in RD$ or USD
  estimatedBudget?: string;
  status: 'nuevo' | 'contactado' | 'calificado' | 'propuesta' | 'negociacion' | 'convertido' | 'en_negociacion' | 'ganado' | 'perdido';
  origin?: string; // 'Instagram Ad', 'TikTok', 'Referido VIP', 'Web Directo'
  source?: string;
  assignedTo?: {
    id: string;
    name: string;
    role: string;
  };
  notes?: string;
  closingProbability?: number; // percentage
  timeline?: {
    id: string;
    author: string;
    role: string;
    date: string;
    content: string;
  }[];
  createdAt?: string;
}

export interface Client {
  id: string;
  name: string;
  title: string; // e.g. 'Novia Titular' or 'Wedding Planner / Partner VIP'
  email: string;
  phone: string;
  totalEvents?: number;
  activeEvents?: number;
  activeSlug?: string;
  activeSlugStatus?: 'en_vivo' | 'revision' | 'expirado';
  totalContracted?: number;
  balanceDue?: number;
  isVip?: boolean;
  avatarUrl?: string;
  eventName?: string;
  eventSlug?: string;
  eventId?: string;
  status?: string;
  totalSpent?: string;
  paymentStatus?: string;
  eventsList?: {
    id: string;
    title: string;
    date: string;
    status: string;
  }[];
}

export interface EventWorkspaceData {
  id: string;
  code: string; // #EV-2026-904
  title: string; // María Fernández & Carlos Rodríguez
  eventType?: string;
  date?: string; // 14 de Noviembre, 2026
  dateFormatted?: string;
  ceremonyTime?: string;
  countdownDays?: number;
  venue: string;
  location?: string;
  venueCoordinates?: string;
  plan: 'Esencial' | 'Popular' | 'Premium' | 'A Medida' | string;
  slug: string; // invifty.com/i/maria-carlos
  publicUrl?: string;
  
  // Financial
  contractCode?: string;
  totalContracted?: number;
  totalPaid?: number;
  balanceDue?: number;
  lastPaymentRef?: string;
  
  // Production
  productionStatus?: ProductionStatus;
  productionStep?: number; // 1 to 6
  version?: string; // v4.2
  
  // Guests & RSVP
  totalGuestsTarget?: number;
  totalGuests?: number;
  confirmedGuests: number;
  pendingGuests?: number;
  declinedGuests?: number;
  qrPassesReady?: number;
  status?: EventStatus | string;
  
  // Web Metrics
  totalVisits?: number;
  uniqueVisitors?: number;
  qrPassesDownloaded?: number;
  
  // Contacts
  primaryContact?: {
    name: string;
    role: string;
    email: string;
    phone: string;
  };
  secondaryContact?: {
    name: string;
    role: string;
    email: string;
    phone: string;
  };
  planner?: {
    name: string;
    role: string;
    phone: string;
    agency: string;
  };
  brideName?: string;
  bridePhone?: string;
  groomName?: string;
  groomPhone?: string;
  plannerName?: string;
  plannerPhone?: string;
  dressCode?: string;

  timeline?: {
    title: string;
    time: string;
    status: string;
  }[];
  recentActivity?: {
    id: string;
    user: string;
    time: string;
    description: string;
  }[];
  
  // Attention flags
  immediateActions?: {
    id: string;
    type: 'review' | 'payment' | 'rsvp' | 'info';
    title: string;
    description: string;
    urgencyText: string;
    actionLabel: string;
  }[];
}

export interface GuestMember {
  id: string;
  name: string;
  role: 'titular' | 'acompaniante';
  qrCode: string;
  menu?: string;
  allergies?: string;
  checkedIn: boolean;
  checkedInTime?: string;
}

export interface Guest {
  id: string;
  eventId?: string;
  code: string; // #INV-8901
  name: string;
  companionName?: string;
  category: string;
  phone?: string;
  email?: string;
  passesAllowed?: number;
  passesConfirmed?: number;
  pax?: number;
  status: RsvpStatus | string;
  tableNumber: number | string;
  tableName?: string;
  menu?: string;
  allergies?: string;
  dietaryNotes?: string;
  isVip?: boolean;
  notes?: string;
  qrPassSent?: boolean;
  checkedIn?: boolean;
  checkedInCount?: number;
  hotelRequired?: boolean;
  transportRequired?: boolean;
  members?: GuestMember[];
}

export interface Template {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  thumbnailUrl: string;
  styles: string[];
  activeVersion: string;
  versionsCount: number;
  createdAt: string;
  code?: string;
  status?: string;
  version?: string;
  colors?: { primary: string; secondary?: string; accent?: string };
  htmlCode?: string;
}

export interface TemplateVersion {
  id: string;
  templateId: string;
  versionTag: string;
  changelog: string;
  htmlSource: string;
  cssSource?: string;
  jsSource?: string;
  capabilities: string[];
  isImmutable: boolean;
  isPublished: boolean;
  publishedAt: string;
}

export interface AuditRecord {
  id: string;
  type: 'aprobacion' | 'pago' | 'guests' | 'lead' | 'sistema';
  title: string;
  description: string;
  timestamp: string;
  author: string;
  actorName: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface PriorityAction {
  id: string;
  severity: 'urgente' | 'alta' | 'verificacion' | 'atencion_rsvp';
  timing: string;
  title: string;
  subtitle: string;
  description: string;
  assignedTo: string;
  assignedRole: string;
  previewTag?: string;
  actionText: string;
  actionRoute: string;
}

// ==========================================
// 1. Producción
// ==========================================
export type ProductionStage =
  | 'pendiente_info'
  | 'info_recibida'
  | 'disenando'
  | 'revision_interna'
  | 'revision_cliente'
  | 'cambios_solicitados'
  | 'aprobada'
  | 'lista_publicar'
  | 'completada';

export interface ProductionItem {
  id: string;
  eventId: string;
  eventName: string;
  clientName: string;
  clientEmail?: string;
  eventDate: string;
  plan: string;
  stage: ProductionStage;
  assignedTo: string;
  daysInStage: number;
  priority: 'baja' | 'normal' | 'alta' | 'urgente';
  unresolvedComments: number;
  paymentStatus: 'al_dia' | 'pendiente_saldo' | 'por_verificar';
  version: string;
  notes?: string;
  slug?: string;
}

// ==========================================
// 2. Revisiones
// ==========================================
export type ReviewStatus = 'pending' | 'opened' | 'changes_requested' | 'approved' | 'expired' | 'revoked';

export interface ReviewComment {
  id: string;
  reviewId: string;
  section: string; // Portada, Historia, Programa, Dress Code, Itinerario, etc.
  message: string;
  referenceImage?: string;
  author: string;
  authorRole: 'cliente' | 'disenador' | 'planner' | 'concierge';
  date: string;
  status: 'abierto' | 'resuelto' | 'reabierto';
  isInternal?: boolean;
}

export interface ReviewItem {
  id: string;
  eventId: string;
  eventName: string;
  clientName: string;
  clientEmail: string;
  invitationVersion: string;
  dateSent: string;
  daysWaiting: number;
  clientOpened: boolean;
  openedAt?: string;
  commentsCount: number;
  unresolvedComments: number;
  responsibleEmployee: string;
  status: ReviewStatus;
  templateName?: string;
  htmlPreview?: string;
  approvedVersionExact?: string;
  comments: ReviewComment[];
}

// ==========================================
// 3. Pagos
// ==========================================
export type PaymentStatus = 'verificado' | 'pendiente' | 'por_verificar' | 'rechazado' | 'reembolsado';

export interface PaymentTransaction {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone?: string;
  eventId: string;
  eventName: string;
  plan: string;
  totalContracted: number;
  paidAmount: number;
  balanceDue: number;
  lastPaymentDate: string;
  paymentMethod: 'transferencia' | 'tarjeta' | 'efectivo' | 'stripe';
  status: PaymentStatus;
  bank?: string;
  reference?: string;
  receiptUrl?: string;
  rejectionReason?: string;
  notes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

// ==========================================
// 4. Invitaciones
// ==========================================
export type GlobalInvitationStatus = 'draft' | 'review' | 'published' | 'paused' | 'expired' | 'archived';

export interface InvitationContent {
  coverTitle: string;
  subtitle: string;
  brideName: string;
  groomName: string;
  eventDate: string;
  ceremonyTime: string;
  receptionTime: string;
  venueName: string;
  locationAddress: string;
  dressCode: string;
  storyTitle: string;
  storyText: string;
  countdownDate: string;
  giftRegistryInfo: string;
  bankAccountInfo?: string;
  musicTitle: string;
  closingMessage: string;
  scheduleItems: { time: string; title: string; description?: string }[];
  galleryUrls: string[];
}

export interface InvitationItem {
  id: string;
  eventId: string;
  eventName: string;
  clientName: string;
  templateId: string;
  templateName: string;
  templateVersion: string;
  status: GlobalInvitationStatus;
  publishedDate?: string;
  expirationDate?: string;
  views: number;
  rsvpCount: number;
  slug: string;
  customDomain?: string;
  content: InvitationContent;
}

// ==========================================
// 6. Demos
// ==========================================
export interface DemoItem {
  id: string;
  title: string;
  templateId: string;
  templateName: string;
  category: string;
  slug: string;
  status: 'published' | 'draft' | 'archived';
  views: number;
  createdDate: string;
  thumbnailUrl: string;
  url: string;
}

// ==========================================
// 7. Media
// ==========================================
export interface MediaItem {
  id: string;
  filename: string;
  type: 'image' | 'video' | 'audio' | 'document';
  sizeBytes: number;
  sizeFormatted: string;
  url: string;
  eventId?: string;
  eventName?: string;
  clientName?: string;
  usage: string;
  createdAt: string;
  isPrivate: boolean;
}

// ==========================================
// 8. Equipo
// ==========================================
export type TeamRole = 'superadmin' | 'admin' | 'ventas' | 'operaciones' | 'disenador';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  status: 'activo' | 'inactivo';
  assignedEvents: number;
  lastActivity: string;
  avatarUrl?: string;
  permissions: string[];
}

// ==========================================
// 9. Notificaciones
// ==========================================
export type NotificationCategory = 'reviews' | 'payments' | 'events' | 'leads' | 'guests' | 'system';

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  isRead: boolean;
  date: string;
  eventId?: string;
  actionUrl?: string;
  priority?: 'normal' | 'urgent';
}

// ==========================================
// 10. Mesas & Seating
// ==========================================
export interface TableItem {
  id: string;
  eventId: string;
  number: string;
  name: string;
  category: string;
  capacity: number;
  occupied: number;
  assignedGuestNames: string[];
  dietaryAlert?: string;
}

// ==========================================
// 11. Check-in
// ==========================================
export interface CheckinItem {
  id: string;
  eventId: string;
  guestId: string;
  guestName: string;
  tableNumber: string;
  passesTotal: number;
  passesCheckedIn: number;
  timestamp: string;
  method: 'qr_scan' | 'manual' | 'reingreso';
  operator: string;
  isVoided?: boolean;
  voidReason?: string;
}

// ==========================================
// 12. Mensajes / Comunicaciones
// ==========================================
export interface MessageItem {
  id: string;
  eventId: string;
  channel: 'whatsapp' | 'email' | 'in_app';
  recipientName: string;
  recipientContact: string;
  subject?: string;
  body: string;
  status: 'draft' | 'queued' | 'sent' | 'delivered' | 'opened' | 'failed' | 'manual';
  templateName?: string;
  sentAt: string;
  sentBy: string;
}

// ==========================================
// 13. Planes & Extras
// ==========================================
export interface CommercialPlan {
  id: string;
  name: 'Esencial' | 'Popular' | 'Premium' | 'A Medida' | string;
  price: number;
  currency: string;
  durationMonths: number;
  capabilities: string[];
  reviewsIncluded: number;
  isActive: boolean;
  featured?: boolean;
}

export interface CommercialExtra {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  isActive: boolean;
}
