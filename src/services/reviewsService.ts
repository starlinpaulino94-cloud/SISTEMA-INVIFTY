import { ReviewItem, ReviewComment, ReviewStatus } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { logAudit } from '../lib/audit';

export const initialReviews: ReviewItem[] = [
  {
    id: 'rev-1',
    eventId: 'ev-maria-carlos',
    eventName: 'María Fernández & Carlos Rodríguez',
    clientName: 'María Fernández',
    clientEmail: 'maria@fernandez.do',
    invitationVersion: 'v2.4.0',
    dateSent: '2026-09-22T10:30:00Z',
    daysWaiting: 3,
    clientOpened: true,
    openedAt: '2026-09-22T11:15:00Z',
    commentsCount: 3,
    unresolvedComments: 2,
    responsibleEmployee: 'Eduardo Santos (Diseñador)',
    status: 'changes_requested',
    templateName: 'Imperial Gold Royal',
    comments: [
      {
        id: 'com-1',
        reviewId: 'rev-1',
        section: 'Programa & Transporte',
        message: 'Por favor cambiar la salida de los autobuses desde el Hotel Gran Jimenoa de 4:00 PM a 4:30 PM para que no coincida con el check-in.',
        author: 'María Fernández',
        authorRole: 'cliente',
        date: 'Hace 2 días',
        status: 'abierto',
      },
      {
        id: 'com-2',
        reviewId: 'rev-1',
        section: 'Mesa de Regalos',
        message: 'Añadir el número de cuenta corriente en dólares del Banco BHD León junto al enlace de Amazon Wedding.',
        author: 'Carlos Rodríguez',
        authorRole: 'cliente',
        date: 'Ayer',
        status: 'abierto',
      },
      {
        id: 'com-3',
        reviewId: 'rev-1',
        section: 'Portada Editorial',
        message: 'Ajustada la tipografía del monograma dorado para mayor legibilidad en iPhone con pantalla compacta.',
        author: 'Eduardo Santos',
        authorRole: 'disenador',
        date: 'Ayer',
        status: 'resuelto',
        isInternal: true,
      },
    ],
  },
  {
    id: 'rev-2',
    eventId: 'ev-alejandro-valeria',
    eventName: 'Alejandro & Valeria Almonte',
    clientName: 'Valeria Almonte',
    clientEmail: 'valeria@almonte.com',
    invitationVersion: 'v1.1.0',
    dateSent: '2026-09-24T16:00:00Z',
    daysWaiting: 1,
    clientOpened: true,
    openedAt: '2026-09-24T17:20:00Z',
    commentsCount: 1,
    unresolvedComments: 1,
    responsibleEmployee: 'Claudia Méndez (Diseñadora)',
    status: 'opened',
    templateName: 'Royal Heritage Classic',
    comments: [
      {
        id: 'com-4',
        reviewId: 'rev-2',
        section: 'Historia de Amor',
        message: 'Nos encanta cómo se ve, solo queremos sustituir el segundo párrafo por nuestros votos originales.',
        author: 'Valeria Almonte',
        authorRole: 'cliente',
        date: 'Hace 18 horas',
        status: 'abierto',
      },
    ],
  },
  {
    id: 'rev-3',
    eventId: 'ev-gabriela-morales',
    eventName: 'Gala Benéfica Fundación Mir 2026',
    clientName: 'Vivian Morales',
    clientEmail: 'vivian@fundacionmir.org',
    invitationVersion: 'v3.0.0',
    dateSent: '2026-09-20T09:00:00Z',
    daysWaiting: 5,
    clientOpened: true,
    openedAt: '2026-09-20T09:40:00Z',
    commentsCount: 4,
    unresolvedComments: 0,
    responsibleEmployee: 'Patricia Ramos (Planner)',
    status: 'approved',
    approvedVersionExact: 'v3.0.0',
    templateName: 'Atelier Velvet Gala',
    comments: [
      {
        id: 'com-5',
        reviewId: 'rev-3',
        section: 'Control de Acceso QR',
        message: 'Aprobado oficialmente por el patronato. La validación biométrica y los pases VIP quedaron impecables.',
        author: 'Vivian Morales',
        authorRole: 'cliente',
        date: 'Hace 3 días',
        status: 'resuelto',
      },
    ],
  },
  {
    id: 'rev-4',
    eventId: 'ev-corp-vicini',
    eventName: 'Aniversario Corporativo Grupo Vicini',
    clientName: 'Juan Carlos Vicini',
    clientEmail: 'jc@vicini.do',
    invitationVersion: 'v2.0.0',
    dateSent: '2026-09-25T14:00:00Z',
    daysWaiting: 0,
    clientOpened: false,
    commentsCount: 0,
    unresolvedComments: 0,
    responsibleEmployee: 'Eduardo Santos (Diseñador)',
    status: 'pending',
    templateName: 'Modern Monolith Corporate',
    comments: [],
  },
];

let inMemoryReviews = [...initialReviews];

export const reviewsService = {
  getReviews: async (filter?: { status?: ReviewStatus; search?: string }): Promise<ReviewItem[]> => {
    let result = [...inMemoryReviews];
    if (filter?.status) {
      result = result.filter((r) => r.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (r) =>
          r.eventName.toLowerCase().includes(q) ||
          r.clientName.toLowerCase().includes(q) ||
          r.clientEmail.toLowerCase().includes(q) ||
          r.responsibleEmployee.toLowerCase().includes(q)
      );
    }
    return result;
  },

  getReviewById: async (id: string): Promise<ReviewItem | null> => {
    const rev = inMemoryReviews.find((r) => r.id === id);
    return rev ? { ...rev } : null;
  },

  addComment: async (
    reviewId: string,
    sectionOrObj: string | { section: string; message: string; author?: string; authorRole?: 'cliente' | 'disenador' | 'planner' | 'concierge'; isInternal?: boolean },
    message?: string,
    author: string = 'Patricia Ramos',
    authorRole: 'cliente' | 'disenador' | 'planner' | 'concierge' = 'planner',
    isInternal: boolean = false
  ): Promise<ReviewComment> => {
    const rev = inMemoryReviews.find((r) => r.id === reviewId);
    let section = typeof sectionOrObj === 'string' ? sectionOrObj : sectionOrObj.section;
    let msg = typeof sectionOrObj === 'string' ? (message || '') : sectionOrObj.message;
    let auth = typeof sectionOrObj === 'object' && sectionOrObj.author ? sectionOrObj.author : author;
    let role = typeof sectionOrObj === 'object' && sectionOrObj.authorRole ? sectionOrObj.authorRole : authorRole;
    let intern = typeof sectionOrObj === 'object' && sectionOrObj.isInternal !== undefined ? sectionOrObj.isInternal : isInternal;

    const newComment: ReviewComment = {
      id: `com-${Date.now()}`,
      reviewId,
      section,
      message: msg,
      author: auth,
      authorRole: role,
      date: 'Ahora mismo',
      status: 'abierto',
      isInternal: intern,
    };
    if (rev) {
      rev.comments.push(newComment);
      rev.commentsCount += 1;
      rev.unresolvedComments += 1;
      rev.status = 'changes_requested';

      await logAudit({
        actor: auth,
        action: 'Comentario en revisión',
        target: rev.eventName,
        details: `Sección "${section}": ${msg.slice(0, 60)}...`,
      });
    }
    return newComment;
  },

  resolveComment: async (reviewId: string, commentId: string): Promise<boolean> => {
    const rev = inMemoryReviews.find((r) => r.id === reviewId);
    if (rev) {
      const comment = rev.comments.find((c) => c.id === commentId);
      if (comment && comment.status === 'abierto') {
        comment.status = 'resuelto';
        rev.unresolvedComments = Math.max(0, rev.unresolvedComments - 1);
        if (rev.unresolvedComments === 0 && rev.status === 'changes_requested') {
          rev.status = 'opened';
        }
        return true;
      }
    }
    return false;
  },

  reopenComment: async (reviewId: string, commentId: string): Promise<boolean> => {
    const rev = inMemoryReviews.find((r) => r.id === reviewId);
    if (rev) {
      const comment = rev.comments.find((c) => c.id === commentId);
      if (comment && comment.status === 'resuelto') {
        comment.status = 'abierto';
        rev.unresolvedComments += 1;
        rev.status = 'changes_requested';
        return true;
      }
    }
    return false;
  },

  approveReview: async (reviewId: string): Promise<boolean> => {
    return reviewsService.approveReviewVersion(reviewId);
  },

  approveReviewVersion: async (
    reviewId: string,
    approvedBy: string = 'Cliente Titular'
  ): Promise<boolean> => {
    const rev = inMemoryReviews.find((r) => r.id === reviewId);
    if (rev) {
      rev.status = 'approved';
      rev.approvedVersionExact = rev.invitationVersion;
      rev.unresolvedComments = 0;
      rev.comments.forEach((c) => (c.status = 'resuelto'));

      await logAudit({
        actor: approvedBy,
        action: 'Aprobación inmutable de versión',
        target: rev.eventName,
        details: `El evento "${rev.eventName}" fue formalmente aprobado en versión exacta ${rev.invitationVersion} por ${approvedBy}.`,
      });
      return true;
    }
    return false;
  },
};
