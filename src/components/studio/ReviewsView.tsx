import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { reviewsService } from '../../services/reviewsService';
import { ReviewItem, ReviewComment, ReviewStatus } from '../../types';
import {
  CheckSquare,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Send,
  User,
  ShieldCheck,
  ChevronRight,
  X
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ReviewsView: React.FC = () => {
  const { openEventWorkspace } = useApp();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [replyText, setReplyText] = useState('');
  const [activeCommentSection, setActiveCommentSection] = useState('Portada');

  useEffect(() => {
    loadReviews();
  }, [statusFilter, search]);

  const loadReviews = async () => {
    const data = await reviewsService.getReviews({
      status: statusFilter !== 'all' ? (statusFilter as ReviewStatus) : undefined,
      search: search || undefined
    });
    setReviews(data);
    if (selectedReview) {
      const updated = data.find(r => r.id === selectedReview.id);
      if (updated) setSelectedReview(updated);
    }
  };

  const handleResolveComment = async (commentId: string) => {
    if (!selectedReview) return;
    await reviewsService.resolveComment(selectedReview.id, commentId);
    showToast('Comentario resuelto exitosamente', 'success');
    await loadReviews();
  };

  const handleAddComment = async () => {
    if (!selectedReview || !replyText.trim()) return;
    await reviewsService.addComment(selectedReview.id, {
      section: activeCommentSection,
      message: replyText.trim(),
      author: 'Carolina Herrera (Diseño Invifty)',
      authorRole: 'disenador'
    });
    setReplyText('');
    showToast('Comentario agregado a la ronda de revisión', 'success');
    await loadReviews();
  };

  const handleApproveReview = async (reviewId: string) => {
    await reviewsService.approveReview(reviewId);
    showToast('Invitación aprobada y sellada formalmente', 'success');
    await loadReviews();
  };

  const copyReviewLink = (review: ReviewItem) => {
    const url = `${window.location.origin}/review/${review.id}`;
    navigator.clipboard.writeText(url);
    showToast('Enlace de revisión copiado al portapapeles', 'info');
  };

  const getStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case 'approved':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">Aprobada</span>;
      case 'changes_requested':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">Cambios Pedidos</span>;
      case 'opened':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">Abierta por Cliente</span>;
      case 'expired':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">Expirada</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">Pendiente de Apertura</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8A6510] font-semibold">Garantía Atelier</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-600 font-sans">{reviews.length} rondas de revisión</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight flex items-center gap-3">
            <CheckSquare className="w-6 h-6 text-[#C99B18]" />
            Revisiones de Clientes
          </h1>
          <p className="text-sm text-slate-600 mt-0.5 font-sans">
            Módulo de aprobación visual: comentarios por sección, confirmación de versión y sellado de diseño.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E5E7EB] p-3 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por evento, cliente o correo..."
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
            <option value="pending">Pendiente de apertura</option>
            <option value="opened">Abierta por cliente</option>
            <option value="changes_requested">Cambios solicitados</option>
            <option value="approved">Aprobada</option>
          </select>
        </div>
      </div>

      {/* Main Reviews Grid / Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List of Reviews */}
        <div className="lg:col-span-2 space-y-3">
          {reviews.map(review => {
            const isSelected = selectedReview?.id === review.id;
            return (
              <div
                key={review.id}
                onClick={() => setSelectedReview(review)}
                className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
                  isSelected
                    ? 'border-[#D6AE36] ring-2 ring-[#D6AE36]/20 shadow-sm'
                    : 'border-[#E5E7EB] hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-[#8A6510] bg-[#FFF8DC] px-2 py-0.5 rounded border border-[#F1DC91]">
                        {review.invitationVersion}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 font-heading">{review.eventName}</h3>
                    </div>
                    <p className="text-xs text-slate-500 font-sans mt-1">
                      Cliente: <span className="text-slate-800 font-medium">{review.clientName}</span> ({review.clientEmail})
                    </p>
                  </div>
                  <div>{getStatusBadge(review.status)}</div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-sans uppercase">Espera</span>
                    <span className="font-semibold text-slate-700 flex items-center gap-1 font-sans">
                      <Clock className="w-3 h-3 text-slate-400" /> {review.daysWaiting} días
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-sans uppercase">Apertura</span>
                    <span className={`font-semibold flex items-center gap-1 font-sans ${review.clientOpened ? 'text-blue-600' : 'text-slate-400'}`}>
                      <Eye className="w-3 h-3" /> {review.clientOpened ? 'Visto' : 'Sin abrir'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-sans uppercase">Comentarios</span>
                    <span className={`font-semibold flex items-center gap-1 font-sans ${review.unresolvedComments > 0 ? 'text-rose-600' : 'text-slate-600'}`}>
                      <MessageSquare className="w-3 h-3" /> {review.unresolvedComments} pendientes
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-sans uppercase">Responsable</span>
                    <span className="font-medium text-slate-700 truncate block font-sans">
                      {review.responsibleEmployee}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyReviewLink(review);
                    }}
                    className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium font-sans"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copiar link de revisión
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEventWorkspace(review.eventId);
                    }}
                    className="flex items-center gap-1 text-[#8A6510] hover:text-[#5B4104] font-semibold font-sans"
                  >
                    Ver en Workspace <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-1">
          {selectedReview ? (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs sticky top-20 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A6510] font-semibold">
                    Módulo de Resolución
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 font-heading">
                    {selectedReview.eventName}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status & Version Card */}
              <div className="bg-[#F8F9FA] p-3.5 rounded-xl border border-[#E5E7EB] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-sans">Versión Activa:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedReview.invitationVersion}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-sans">Estado:</span>
                  {getStatusBadge(selectedReview.status)}
                </div>
                {selectedReview.status !== 'approved' && (
                  <button
                    onClick={() => handleApproveReview(selectedReview.id)}
                    className="w-full mt-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" /> Aprobar & Sellar Versión
                  </button>
                )}
              </div>

              {/* Comments Thread */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-900 font-sans">
                    Comentarios del Cliente ({selectedReview.comments.length})
                  </h4>
                </div>

                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {selectedReview.comments.map(c => (
                    <div
                      key={c.id}
                      className={`p-3 rounded-xl border text-xs ${
                        c.status === 'resuelto'
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : 'bg-amber-50/50 border-amber-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold text-slate-800">{c.author}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                          {c.section}
                        </span>
                      </div>
                      <p className="text-slate-700 font-sans text-xs mt-1">{c.message}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/50 text-[10px]">
                        <span className="text-slate-400">{c.date}</span>
                        {c.status !== 'resuelto' ? (
                          <button
                            onClick={() => handleResolveComment(c.id)}
                            className="text-[#8A6510] hover:text-[#5B4104] font-semibold flex items-center gap-1"
                          >
                            <CheckCircle className="w-3 h-3" /> Marcar resuelto
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-medium">✓ Resuelto</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {selectedReview.comments.length === 0 && (
                    <div className="text-center py-6 text-xs text-slate-400">
                      No hay comentarios registrados
                    </div>
                  )}
                </div>
              </div>

              {/* Add Feedback / Response */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-sans">Sección:</span>
                  <select
                    value={activeCommentSection}
                    onChange={(e) => setActiveCommentSection(e.target.value)}
                    className="text-xs bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-2 py-1 text-slate-700 font-sans"
                  >
                    <option value="Portada">Portada</option>
                    <option value="Historia">Nuestra Historia</option>
                    <option value="Itinerario">Itinerario</option>
                    <option value="Dress Code">Dress Code</option>
                    <option value="Mesa de Regalos">Mesa de Regalos</option>
                    <option value="Galería">Galería</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Escribe una respuesta técnica o nota..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 text-xs bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#D6AE36]"
                  />
                  <button
                    onClick={handleAddComment}
                    className="p-2 rounded-lg bg-[#FFF8DC] text-[#8A6510] hover:bg-[#F8EAA3] border border-[#F1DC91]"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 text-center text-slate-400 space-y-2">
              <CheckSquare className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-sans">Selecciona una ronda de revisión para ver sus comentarios y herramientas de aprobación.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
