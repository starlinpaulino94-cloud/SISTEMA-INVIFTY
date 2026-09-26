import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { invitationsService } from '../../services/invitationsService';
import { InvitationItem, GlobalInvitationStatus } from '../../types';
import {
  Mail,
  Search,
  Filter,
  Eye,
  CheckCircle,
  PauseCircle,
  PlayCircle,
  ExternalLink,
  QrCode,
  Copy,
  Calendar,
  Globe,
  Plus,
  Sparkles,
  X
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const InvitationsView: React.FC = () => {
  const { openPublicInvitationRuntime, openEventWorkspace } = useApp();
  const { showToast } = useToast();
  const [invitations, setInvitations] = useState<InvitationItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [qrModalItem, setQrModalItem] = useState<InvitationItem | null>(null);

  useEffect(() => {
    loadInvitations();
  }, [statusFilter, search]);

  const loadInvitations = async () => {
    const data = await invitationsService.getInvitations({
      status: statusFilter !== 'all' ? (statusFilter as GlobalInvitationStatus) : undefined,
      search: search || undefined
    });
    setInvitations(data);
  };

  const handleToggleStatus = async (item: InvitationItem) => {
    const newStatus: GlobalInvitationStatus = item.status === 'published' ? 'paused' : 'published';
    await invitationsService.updateStatus(item.id, newStatus);
    showToast(`Invitación ${newStatus === 'published' ? 'publicada y activa' : 'pausada temporalmente'}`, 'info');
    await loadInvitations();
  };

  const copyInvitationUrl = (slug: string) => {
    const url = `${window.location.origin}/i/${slug}`;
    navigator.clipboard.writeText(url);
    showToast('Enlace público copiado al portapapeles', 'info');
  };

  const getStatusBadge = (status: GlobalInvitationStatus) => {
    switch (status) {
      case 'published':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">Publicada & Activa</span>;
      case 'paused':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">Pausada</span>;
      case 'review':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">En Revisión</span>;
      case 'draft':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">Borrador</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800">Expirada</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8A6510] font-semibold">Atelier Web Runtime</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-600 font-sans">{invitations.length} invitaciones configuradas</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight flex items-center gap-3">
            <Mail className="w-6 h-6 text-[#C99B18]" />
            Directorio de Invitaciones Digitales
          </h1>
          <p className="text-sm text-slate-600 mt-0.5 font-sans">
            URLs canónicas públicas, métricas de visualización en tiempo real, estados de publicación y códigos QR.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E5E7EB] p-3 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por evento, cliente o slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs text-slate-900 placeholder:text-slate-400 bg-transparent border-none outline-none font-sans"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-2.5 py-1 text-slate-700 font-sans"
          >
            <option value="all">Todos los estados</option>
            <option value="published">Publicadas</option>
            <option value="review">En revisión</option>
            <option value="paused">Pausadas</option>
            <option value="draft">Borrador</option>
          </select>
        </div>
      </div>

      {/* Invitations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {invitations.map(inv => (
          <div
            key={inv.id}
            className="bg-white border border-[#E5E7EB] hover:border-[#D6AE36] rounded-2xl p-5 shadow-xs hover:shadow-sm transition-all duration-150 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFF8DC] text-[#8A6510] font-semibold border border-[#F1DC91]">
                  {inv.templateName}
                </span>
                {getStatusBadge(inv.status)}
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">{inv.eventName}</h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">Cliente: {inv.clientName}</p>
              </div>

              <div className="bg-[#F8F9FA] p-3 rounded-xl border border-[#E5E7EB] space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1 font-sans">
                    <Globe className="w-3 h-3 text-slate-400" /> Slug canónico:
                  </span>
                  <span className="font-mono text-[11px] text-[#8A6510] font-bold truncate max-w-[150px]">
                    /i/{inv.slug}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1 font-sans">
                    <Eye className="w-3 h-3 text-slate-400" /> Visualizaciones:
                  </span>
                  <span className="font-bold text-slate-800">{inv.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1 font-sans">
                    <CheckCircle className="w-3 h-3 text-slate-400" /> Confirmados RSVP:
                  </span>
                  <span className="font-bold text-emerald-700">{inv.rsvpCount} pases</span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openPublicInvitationRuntime(inv.slug)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#FFF8DC] text-[#8A6510] hover:bg-[#F8EAA3] border border-[#F1DC91] font-semibold flex items-center gap-1"
                  title="Abrir runtime en vivo"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Ver en Vivo
                </button>
                <button
                  onClick={() => copyInvitationUrl(inv.slug)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent hover:border-slate-200"
                  title="Copiar URL"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setQrModalItem(inv)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent hover:border-slate-200"
                  title="Código QR"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => handleToggleStatus(inv)}
                className={`flex items-center gap-1 text-[11px] font-semibold ${
                  inv.status === 'published'
                    ? 'text-amber-700 hover:text-amber-800'
                    : 'text-emerald-700 hover:text-emerald-800'
                }`}
              >
                {inv.status === 'published' ? (
                  <>
                    <PauseCircle className="w-3.5 h-3.5" /> Pausar
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-3.5 h-3.5" /> Publicar
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* QR Modal */}
      {qrModalItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-sm w-full p-6 shadow-xl text-center space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 font-heading">Código QR Oficial</h3>
              <button onClick={() => setQrModalItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 inline-block mx-auto shadow-2xs">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  `${window.location.origin}/i/${qrModalItem.slug}`
                )}`}
                alt="QR Code"
                className="w-48 h-48 mx-auto"
              />
            </div>

            <div>
              <div className="font-bold text-slate-900 text-xs font-heading">{qrModalItem.eventName}</div>
              <div className="text-[11px] font-mono text-slate-500 mt-0.5">/i/{qrModalItem.slug}</div>
            </div>

            <button
              onClick={() => copyInvitationUrl(qrModalItem.slug)}
              className="w-full py-2 px-3 rounded-lg bg-[#FFF8DC] text-[#8A6510] hover:bg-[#F8EAA3] border border-[#F1DC91] font-semibold text-xs flex items-center justify-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" /> Copiar Enlace Directo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
