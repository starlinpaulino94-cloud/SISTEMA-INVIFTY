import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { leadsService } from '../../services/leadsService';
import { Lead } from '../../types';
import {
  Users,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  MessageSquare
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { CreateLeadModal } from './CreateLeadModal';

export const LeadsView: React.FC = () => {
  const { setStudioView, setSelectedEventId } = useApp();
  const { addToast } = useToast();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    const data = await leadsService.getLeads();
    setLeads(data);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesFilter = filterStatus === 'todos' || lead.status === filterStatus;
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.partnerName && lead.partnerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lead.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.location || lead.venue || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleConvertToClient = async (lead: Lead) => {
    const result = await leadsService.convertToClientAndEvent(lead.id);
    if (result.success) {
      addToast(`Lead ${lead.name} convertido exitosamente a Cliente y Evento Activo`, 'success');
      loadLeads();
      if (result.eventId) {
        setSelectedEventId(result.eventId);
        setStudioView('event-workspace');
      }
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: any) => {
    await leadsService.updateLeadStatus(leadId, newStatus);
    addToast('Estado del lead actualizado', 'info');
    loadLeads();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8A6510] font-semibold">Pipeline Comercial & Ventas</span>
            <span className="text-xs text-slate-400">• Cotizaciones de Gala</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 tracking-tight">
            Gestión de Leads & Clientes Potenciales
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Seguimiento de parejas VIP, cotizaciones de colecciones Atelier y conversión automática a producciones activas.
          </p>
        </div>

        <Button
          variant="gold"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Nuevo Lead VIP
        </Button>
      </div>

      {/* Commercial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="default">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-500 font-medium">Total Leads Activos</span>
            <span className="p-2 rounded-lg bg-[#FFF8DC] text-[#C99B18]">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-heading font-bold text-slate-900">{leads.length}</span>
            <span className="text-xs text-[#16A34A] flex items-center font-medium">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +2 esta semana
            </span>
          </div>
        </Card>

        <Card variant="default">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-500 font-medium">En Negociación</span>
            <span className="p-2 rounded-lg bg-[#FFF7ED] text-[#EA580C]">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-heading font-bold text-[#EA580C]">
              {leads.filter((l) => l.status === 'en_negociacion' || l.status === 'contactado').length}
            </span>
            <span className="text-xs text-slate-500">propuestas abiertas</span>
          </div>
        </Card>

        <Card variant="default">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-500 font-medium">Tasa de Conversión</span>
            <span className="p-2 rounded-lg bg-[#F0FDF4] text-[#16A34A]">
              <CheckCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-heading font-bold text-[#16A34A]">38.4%</span>
            <span className="text-xs text-[#16A34A] font-medium">+5.1% mensual</span>
          </div>
        </Card>

        <Card variant="default">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-500 font-medium">Valor Estimado Pipeline</span>
            <span className="p-2 rounded-lg bg-[#FFF8DC] text-[#C99B18]">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-heading font-bold text-slate-900">$21,800</span>
            <span className="text-xs text-slate-500 font-mono">USD</span>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'nuevo', label: 'Nuevos' },
            { id: 'contactado', label: 'Contactados' },
            { id: 'en_negociacion', label: 'En Negociación' },
            { id: 'ganado', label: 'Ganados / Cerrados' },
            { id: 'perdido', label: 'Perdidos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-[#FFF8DC] text-[#8A6510] font-semibold border border-[#F1DC91] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#F6F7F9]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full md:w-72">
          <Input
            placeholder="Buscar por pareja, código o destino..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
      </div>

      {/* Leads Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLeads.map((lead) => (
          <div
            key={lead.id}
            className="group rounded-2xl border border-[#E5E7EB] bg-white p-5 hover:border-[#D6AE36] hover:shadow-sm transition-all flex flex-col justify-between space-y-4 shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#8A6510] font-semibold">{lead.code}</span>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
                    lead.status === 'ganado'
                      ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
                      : lead.status === 'en_negociacion'
                      ? 'bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA]'
                      : lead.status === 'nuevo'
                      ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {lead.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-heading font-bold text-slate-900 group-hover:text-[#8A6510] transition-colors">
                  {lead.name}
                  {lead.partnerName && <span className="text-slate-500 font-sans text-sm font-normal block">& {lead.partnerName}</span>}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{lead.eventType}</p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 border-t border-[#E5E7EB] pt-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#C99B18]" />
                  <span>{lead.eventDate} • {lead.location || lead.venue || 'República Dominicana'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#C99B18]" />
                  <span>~{lead.estimatedGuests} invitados estimados</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-[#C99B18]" />
                  <span className="text-[#8A6510] font-mono font-medium">{lead.plan}</span>
                </div>
              </div>

              {lead.notes && (
                <p className="text-xs text-slate-500 italic bg-[#F8F9FA] p-2.5 rounded-lg border border-[#E5E7EB] line-clamp-2">
                  "{lead.notes}"
                </p>
              )}
            </div>

            {/* Actions Bottom Bar */}
            <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between gap-2">
              <a
                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hola ${lead.name}, le saludamos de Invifty Atelier respecto a su boda en ${lead.location || lead.venue || 'República Dominicana'}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-[#F8F9FA] text-[#16A34A] border border-[#E5E7EB] hover:bg-[#F0FDF4] hover:border-[#BBF7D0] transition-colors"
                title="Contactar por WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>

              {lead.status !== 'ganado' ? (
                <Button
                  variant="gold-outline"
                  size="sm"
                  onClick={() => handleConvertToClient(lead)}
                  className="w-full text-xs"
                >
                  Convertir a Cliente
                </Button>
              ) : (
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => {
                    setSelectedEventId('ev-maria-carlos');
                    setStudioView('event-workspace');
                  }}
                  className="w-full text-xs"
                  rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                >
                  Ver Espacio de Trabajo
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Lead Modal */}
      <CreateLeadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onLeadCreated={() => loadLeads()}
      />
    </div>
  );
};
