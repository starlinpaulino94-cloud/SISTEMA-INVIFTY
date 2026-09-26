import { PaymentTransaction, PaymentStatus } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { logAudit } from '../lib/audit';

export const initialPayments: PaymentTransaction[] = [
  {
    id: 'pay-1',
    clientId: 'cli-1',
    clientName: 'María Fernández & Carlos Rodríguez',
    clientPhone: '+1 (809) 555-0144',
    eventId: 'ev-maria-carlos',
    eventName: 'Boda María Fernández & Carlos Rodríguez',
    plan: 'Imperial Gold ($4,200)',
    totalContracted: 4200,
    paidAmount: 2700,
    balanceDue: 1500,
    lastPaymentDate: '2026-09-18',
    paymentMethod: 'transferencia',
    status: 'verificado',
    bank: 'Banco BHD León',
    reference: 'TR-98012',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400',
    notes: 'Anticipo 50% ($2,100) + Hito Aprobación Atelier ($600). Saldo pendiente vence 10 días antes.',
    verifiedBy: 'Lic. Patricia Ramos (Planner)',
    verifiedAt: '2026-09-18T15:20:00Z',
  },
  {
    id: 'pay-2',
    clientId: 'cli-2',
    clientName: 'Alejandro & Valeria Almonte',
    clientPhone: '+1 (809) 555-0199',
    eventId: 'ev-alejandro-valeria',
    eventName: 'Alejandro & Valeria Almonte',
    plan: 'Royal Heritage ($3,200)',
    totalContracted: 3200,
    paidAmount: 1600,
    balanceDue: 1600,
    lastPaymentDate: '2026-09-24',
    paymentMethod: 'transferencia',
    status: 'por_verificar',
    bank: 'Banco Popular Dominicano',
    reference: 'BPD-449102',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400',
    notes: 'Comprobante de transferencia subido por el anfitrión por $1,600 USD para inicio de diseño.',
  },
  {
    id: 'pay-3',
    clientId: 'cli-3',
    clientName: 'Vivian Morales (Fundación Mir)',
    clientPhone: '+1 (809) 555-0205',
    eventId: 'ev-gabriela-morales',
    eventName: 'Gala Benéfica Fundación Mir 2026',
    plan: 'Atelier Bespoke ($6,500)',
    totalContracted: 6500,
    paidAmount: 6500,
    balanceDue: 0,
    lastPaymentDate: '2026-09-12',
    paymentMethod: 'tarjeta',
    status: 'verificado',
    reference: 'ST-VISA-8842',
    notes: 'Liquidación completa 100% bajo patrocinio corporativo. Factura con crédito fiscal emitida.',
    verifiedBy: 'Contabilidad Invifty',
    verifiedAt: '2026-09-12T11:00:00Z',
  },
  {
    id: 'pay-4',
    clientId: 'cli-4',
    clientName: 'Doña Elena Rodríguez',
    clientPhone: '+1 (809) 555-0311',
    eventId: 'ev-sofia-bautizo',
    eventName: 'Bautizo Real Sofía Patricia',
    plan: 'Signature ($2,400)',
    totalContracted: 2400,
    paidAmount: 1200,
    balanceDue: 1200,
    lastPaymentDate: '2026-09-25',
    paymentMethod: 'transferencia',
    status: 'por_verificar',
    bank: 'Banreservas',
    reference: 'BR-771920',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400',
    notes: 'Anticipo reportado para reserva de fecha de producción de Diciembre.',
  },
  {
    id: 'pay-5',
    clientId: 'cli-5',
    clientName: 'Juan Carlos Vicini',
    clientPhone: '+1 (809) 555-0100',
    eventId: 'ev-corp-vicini',
    eventName: 'Aniversario Corporativo Grupo Vicini',
    plan: 'Atelier Bespoke ($6,500)',
    totalContracted: 6500,
    paidAmount: 3250,
    balanceDue: 3250,
    lastPaymentDate: '2026-09-20',
    paymentMethod: 'transferencia',
    status: 'verificado',
    bank: 'Banco BHD León',
    reference: 'BHD-901244',
    notes: 'Primer hito 50% conciliado en cuenta fiscal corporativa.',
    verifiedBy: 'Contabilidad Invifty',
    verifiedAt: '2026-09-20T17:00:00Z',
  },
  {
    id: 'pay-6',
    clientId: 'cli-6',
    clientName: 'Lucas Mendoza & Beatriz Fernández',
    clientPhone: '+1 (809) 555-0722',
    eventId: 'ev-lucas-beatriz',
    eventName: 'Lucas Mendoza & Beatriz Fernández',
    plan: 'Imperial Gold ($4,200)',
    totalContracted: 4200,
    paidAmount: 0,
    balanceDue: 4200,
    lastPaymentDate: '2026-09-15',
    paymentMethod: 'transferencia',
    status: 'pendiente',
    notes: 'Cotización aprobada por novios; pendiente recepción de pago del anticipo.',
  },
];

let inMemoryPayments = [...initialPayments];

export const paymentsService = {
  getPayments: async (filter?: { status?: PaymentStatus; method?: string; search?: string }): Promise<PaymentTransaction[]> => {
    let result = [...inMemoryPayments];
    if (filter?.status) {
      result = result.filter(p => p.status === filter.status);
    }
    if (filter?.method && filter.method !== 'all') {
      result = result.filter(p => p.paymentMethod === filter.method);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(p =>
        p.clientName.toLowerCase().includes(q) ||
        p.eventName.toLowerCase().includes(q) ||
        (p.reference && p.reference.toLowerCase().includes(q))
      );
    }
    return result;
  },

  createPayment: async (data: Omit<PaymentTransaction, 'id' | 'lastPaymentDate'> & { lastPaymentDate?: string }): Promise<PaymentTransaction> => {
    const newPayment: PaymentTransaction = {
      ...data,
      id: `pay-${Date.now()}`,
      lastPaymentDate: data.lastPaymentDate || new Date().toISOString().split('T')[0],
    };
    inMemoryPayments.unshift(newPayment);
    await logAudit({
      actor: 'Studio Concierge Finanzas',
      action: 'Creación de Transacción Contable',
      target: newPayment.eventName,
      details: `Pago de $${newPayment.paidAmount} USD registrado para ${newPayment.clientName}`
    });
    return newPayment;
  },

  verifyPayment: async (paymentId: string, verifiedBy: string = 'Patricia Ramos'): Promise<boolean> => {
    return paymentsService.confirmTransfer(paymentId, verifiedBy);
  },

  getPaymentById: async (id: string): Promise<PaymentTransaction | null> => {
    const p = inMemoryPayments.find((pay) => pay.id === id);
    return p ? { ...p } : null;
  },

  getSummaryMetrics: () => {
    const totalContractedAll = inMemoryPayments.reduce((acc, p) => acc + p.totalContracted, 0);
    const totalPaidAll = inMemoryPayments.reduce((acc, p) => acc + p.paidAmount, 0);
    const balanceDueAll = inMemoryPayments.reduce((acc, p) => acc + p.balanceDue, 0);
    const pendingVerificationCount = inMemoryPayments.filter((p) => p.status === 'por_verificar').length;
    const verifiedCount = inMemoryPayments.filter((p) => p.status === 'verificado').length;
    const pendingPaymentCount = inMemoryPayments.filter((p) => p.status === 'pendiente').length;

    return {
      monthIncome: 13750, // USD
      totalContracted: totalContractedAll,
      totalPaid: totalPaidAll,
      balanceDue: balanceDueAll,
      pendingVerificationCount,
      verifiedCount,
      pendingPaymentCount,
      reimbursements: 0,
    };
  },

  confirmTransfer: async (
    paymentId: string,
    verifiedBy: string = 'Patricia Ramos'
  ): Promise<boolean> => {
    const payment = inMemoryPayments.find((p) => p.id === paymentId);
    if (payment) {
      payment.status = 'verificado';
      payment.verifiedBy = verifiedBy;
      payment.verifiedAt = new Date().toISOString();

      await logAudit({
        type: 'pago',
        title: `Transferencia verificada: ${payment.reference || payment.eventName}`,
        description: `Pago por $${payment.paidAmount.toLocaleString()} USD confirmado en ${payment.bank || 'banco'}.`,
        author: verifiedBy,
        action: 'VERIFY_PAYMENT_TRANSFER',
        entityType: 'pagos',
        entityId: paymentId,
        metadata: {
          eventId: payment.eventId,
          amount: payment.paidAmount,
          reference: payment.reference,
        },
      });
      return true;
    }
    return false;
  },

  rejectTransfer: async (
    paymentId: string,
    reason: string,
    rejectedBy: string = 'Patricia Ramos'
  ): Promise<boolean> => {
    const payment = inMemoryPayments.find((p) => p.id === paymentId);
    if (payment) {
      payment.status = 'rechazado';
      payment.rejectionReason = reason;

      await logAudit({
        type: 'pago',
        title: `Transferencia rechazada: ${payment.reference || payment.eventName}`,
        description: `Motivo: ${reason}`,
        author: rejectedBy,
        action: 'REJECT_PAYMENT_TRANSFER',
        entityType: 'pagos',
        entityId: paymentId,
        metadata: {
          eventId: payment.eventId,
          reason,
        },
      });
      return true;
    }
    return false;
  },

  recordAdjustment: async (
    paymentId: string,
    adjustmentAmount: number,
    note: string,
    author: string = 'Dirección Financiera'
  ): Promise<boolean> => {
    const payment = inMemoryPayments.find((p) => p.id === paymentId);
    if (payment) {
      payment.totalContracted += adjustmentAmount;
      payment.balanceDue = Math.max(0, payment.totalContracted - payment.paidAmount);
      payment.notes = `${payment.notes || ''} | Ajuste: ${adjustmentAmount > 0 ? '+' : ''}$${adjustmentAmount} (${note})`;

      await logAudit({
        type: 'pago',
        title: `Ajuste financiero aplicado en contrato de ${payment.clientName}`,
        description: `Monto: $${adjustmentAmount} USD. Motivo: ${note}`,
        author,
        action: 'RECORD_FINANCIAL_ADJUSTMENT',
        entityType: 'pagos',
        entityId: paymentId,
      });
      return true;
    }
    return false;
  },
};
