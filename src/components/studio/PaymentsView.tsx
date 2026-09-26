import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { paymentsService } from '../../services/paymentsService';
import { PaymentTransaction, PaymentStatus } from '../../types';
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  FileText,
  X
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const PaymentsView: React.FC = () => {
  const { openEventWorkspace } = useApp();
  const { showToast } = useToast();
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New payment form
  const [newClient, setNewClient] = useState('');
  const [newEvent, setNewEvent] = useState('');
  const [newPlan, setNewPlan] = useState('Popular Atelier ($690)');
  const [newAmount, setNewAmount] = useState('350');
  const [newTotal, setNewTotal] = useState('690');
  const [newMethod, setNewMethod] = useState<'transferencia' | 'tarjeta' | 'efectivo' | 'stripe'>('transferencia');
  const [newRef, setNewRef] = useState('');

  useEffect(() => {
    loadPayments();
  }, [statusFilter, methodFilter, search]);

  const loadPayments = async () => {
    const data = await paymentsService.getPayments({
      status: statusFilter !== 'all' ? (statusFilter as PaymentStatus) : undefined,
      method: methodFilter !== 'all' ? methodFilter : undefined,
      search: search || undefined
    });
    setPayments(data);
  };

  const handleVerify = async (id: string) => {
    await paymentsService.verifyPayment(id, 'Starlin Paulino (Superadmin)');
    showToast('Pago verificado y conciliado exitosamente', 'success');
    await loadPayments();
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient || !newEvent) return;

    const total = parseFloat(newTotal) || 0;
    const paid = parseFloat(newAmount) || 0;

    await paymentsService.createPayment({
      clientId: `cli-${Date.now()}`,
      clientName: newClient,
      eventId: `evt-${Date.now()}`,
      eventName: newEvent,
      plan: newPlan,
      totalContracted: total,
      paidAmount: paid,
      balanceDue: Math.max(0, total - paid),
      paymentMethod: newMethod,
      reference: newRef || 'REF-MANUAL',
      status: 'verificado'
    });

    setIsModalOpen(false);
    showToast('Transacción registrada en el libro contable', 'success');
    await loadPayments();
  };

  const totalContracted = payments.reduce((acc, p) => acc + p.totalContracted, 0);
  const totalPaid = payments.reduce((acc, p) => acc + p.paidAmount, 0);
  const totalBalance = payments.reduce((acc, p) => acc + p.balanceDue, 0);
  const pendingVerification = payments.filter(p => p.status === 'por_verificar').length;

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'verificado':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">Verificado</span>;
      case 'por_verificar':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">Por Verificar</span>;
      case 'pendiente':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">Pendiente</span>;
      case 'rechazado':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">Rechazado</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">Reembolsado</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8A6510] font-semibold">Finanzas & Facturación</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-600 font-sans">{payments.length} transacciones registradas</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-[#C99B18]" />
            Conciliación de Pagos
          </h1>
          <p className="text-sm text-slate-600 mt-0.5 font-sans">
            Control de anticipos, liquidaciones, comprobantes bancarios y auditoría contable.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D6AE36] hover:bg-[#C99B18] text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Registrar Transacción
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-xs">
          <div className="text-xs font-medium text-slate-500 font-sans">Total Contratado</div>
          <div className="text-2xl font-bold font-heading text-slate-900 mt-1">
            ${totalContracted.toLocaleString()} USD
          </div>
          <div className="text-[11px] text-slate-500 font-sans mt-0.5">En cartera activa</div>
        </div>
        <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-xs">
          <div className="text-xs font-medium text-slate-500 font-sans">Cobrado Verificado</div>
          <div className="text-2xl font-bold font-heading text-emerald-700 mt-1">
            ${totalPaid.toLocaleString()} USD
          </div>
          <div className="text-[11px] text-emerald-600 font-sans mt-0.5 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Fondos en firme
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-xs">
          <div className="text-xs font-medium text-slate-500 font-sans">Saldo por Cobrar</div>
          <div className="text-2xl font-bold font-heading text-amber-700 mt-1">
            ${totalBalance.toLocaleString()} USD
          </div>
          <div className="text-[11px] text-amber-600 font-sans mt-0.5">Pendiente de liquidación</div>
        </div>
        <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-xs">
          <div className="text-xs font-medium text-slate-500 font-sans">Por Verificar</div>
          <div className="text-2xl font-bold font-heading text-purple-700 mt-1">
            {pendingVerification}
          </div>
          <div className="text-[11px] text-purple-600 font-sans mt-0.5">Comprobantes subidos</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E5E7EB] p-3 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, evento o referencia bancaria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs text-slate-900 placeholder:text-slate-400 bg-transparent border-none outline-none font-sans"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-2.5 py-1 text-slate-700 font-sans"
            >
              <option value="all">Todos los estados</option>
              <option value="verificado">Verificado</option>
              <option value="por_verificar">Por verificar</option>
              <option value="pendiente">Pendiente</option>
              <option value="rechazado">Rechazado</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="text-xs bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-2.5 py-1 text-slate-700 font-sans"
            >
              <option value="all">Todos los métodos</option>
              <option value="transferencia">Transferencia SPEI / Wire</option>
              <option value="tarjeta">Tarjeta de Crédito</option>
              <option value="stripe">Stripe Checkout</option>
              <option value="efectivo">Efectivo en Oficina</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F8F9FA] text-slate-600 font-medium">
              <th className="py-3 px-4">Cliente & Evento</th>
              <th className="py-3 px-4">Plan</th>
              <th className="py-3 px-4">Contratado</th>
              <th className="py-3 px-4">Abonado</th>
              <th className="py-3 px-4">Saldo Pendiente</th>
              <th className="py-3 px-4">Método</th>
              <th className="py-3 px-4">Referencia</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {payments.map(p => (
              <tr key={p.id} className="hover:bg-[#F9FAFB] transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900 font-heading">{p.clientName}</div>
                  <div className="text-[11px] text-slate-500 font-sans">{p.eventName}</div>
                </td>
                <td className="py-3 px-4 font-mono text-slate-700">{p.plan}</td>
                <td className="py-3 px-4 font-semibold text-slate-900">${p.totalContracted} USD</td>
                <td className="py-3 px-4 font-semibold text-emerald-700">${p.paidAmount} USD</td>
                <td className="py-3 px-4 font-semibold text-amber-700">
                  {p.balanceDue > 0 ? `$${p.balanceDue} USD` : <span className="text-emerald-700 font-medium">Liquidado</span>}
                </td>
                <td className="py-3 px-4 font-sans text-slate-600 capitalize">{p.paymentMethod}</td>
                <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{p.reference || '—'}</td>
                <td className="py-3 px-4">{getStatusBadge(p.status)}</td>
                <td className="py-3 px-4 text-right">
                  {p.status === 'por_verificar' ? (
                    <button
                      onClick={() => handleVerify(p.id)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all"
                    >
                      Verificar
                    </button>
                  ) : (
                    <button
                      onClick={() => openEventWorkspace(p.eventId)}
                      className="text-slate-400 hover:text-slate-700 text-xs font-medium"
                    >
                      Ver en Evento
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Register Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-heading">Registrar Nuevo Pago</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePayment} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1 font-sans">Nombre del Cliente</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Rodrigo Silva"
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#D6AE36]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1 font-sans">Nombre del Evento</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Boda Rodrigo & Sofía"
                  value={newEvent}
                  onChange={(e) => setNewEvent(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#D6AE36]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1 font-sans">Monto Abonado (USD)</label>
                  <input
                    type="number"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#D6AE36]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1 font-sans">Total Contrato (USD)</label>
                  <input
                    type="number"
                    required
                    value={newTotal}
                    onChange={(e) => setNewTotal(e.target.value)}
                    className="w-full bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#D6AE36]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1 font-sans">Método de Pago</label>
                  <select
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value as any)}
                    className="w-full bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#D6AE36]"
                  >
                    <option value="transferencia">Transferencia SPEI</option>
                    <option value="tarjeta">Tarjeta de Crédito</option>
                    <option value="stripe">Stripe</option>
                    <option value="efectivo">Efectivo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1 font-sans">Referencia / Folio</label>
                  <input
                    type="text"
                    placeholder="Ej. SPEI-99238"
                    value={newRef}
                    onChange={(e) => setNewRef(e.target.value)}
                    className="w-full bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#D6AE36]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#D6AE36] hover:bg-[#C99B18] text-white font-semibold shadow-xs"
                >
                  Guardar Pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
