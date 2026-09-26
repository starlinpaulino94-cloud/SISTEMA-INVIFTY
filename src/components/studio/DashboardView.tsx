import React from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Eye,
  Plus
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { primaryDemoEvent } from '../../services/eventsService';

export const DashboardView: React.FC = () => {
  const { setStudioView, setSelectedEventId, setAppMode } = useApp();
  const { addToast } = useToast();

  const handleOpenEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setStudioView('event-workspace');
    addToast('Espacio de trabajo cargado con éxito', 'info');
  };

  const handlePreviewPwa = () => {
    setAppMode('runtime');
    addToast('Lanzando PWA en Modo Invitado de Alta Gama', 'info');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#E5E7EB] p-6 md:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF8DC] text-[#8A6510] border border-[#F1DC91]">
                <Sparkles className="w-3.5 h-3.5 text-[#C99B18]" /> Studio OS v2.0 • Atelier Edition
              </span>
              <span className="text-xs text-slate-500">Jarabacoa & Santo Domingo</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 tracking-tight">
              Panel Operativo & Dirección Ejecutiva
            </h1>
            <p className="text-slate-500 text-sm mt-1 max-w-2xl">
              Monitoreo en tiempo real de invitaciones de gala, conciliación de RSVP VIP, pases QR dinámicos y métricas de atelier.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="gold-outline"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setStudioView('create-lead')}
            >
              Nuevo Lead
            </Button>
            <Button
              variant="gold"
              size="sm"
              leftIcon={<Eye className="w-4 h-4" />}
              onClick={handlePreviewPwa}
            >
              Ver Invitación PWA
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card variant="default" className="hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Invitaciones Activas</span>
            <span className="p-2 rounded-lg bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-heading font-bold text-slate-900 tracking-tight">18</span>
            <span className="text-xs font-medium text-[#16A34A] flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +3 este mes
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">4 bodas de destino en Jarabacoa y Casa de Campo</p>
        </Card>

        <Card variant="default" className="hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tasa de Confirmación RSVP</span>
            <span className="p-2 rounded-lg bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-heading font-bold text-slate-900 tracking-tight">88.4%</span>
            <span className="text-xs font-medium text-[#16A34A] flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +4.2% vs q1
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">1,942 invitados confirmados en total</p>
        </Card>

        <Card variant="default" className="hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Ingresos del Mes</span>
            <span className="p-2 rounded-lg bg-[#FFF8DC] text-[#8A6510] border border-[#F1DC91]">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-heading font-bold text-slate-900 tracking-tight">$42,500</span>
            <span className="text-xs font-medium text-slate-500">USD</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">84% de cobro anticipado completado</p>
        </Card>

        <Card variant="default" className="hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Satisfacción Concierge</span>
            <span className="p-2 rounded-lg bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-heading font-bold text-slate-900 tracking-tight">9.8/10</span>
            <span className="text-xs font-semibold text-[#7C3AED] bg-[#F5F3FF] px-1.5 py-0.5 rounded">NPS 94</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Tiempo resp. Concierge WhatsApp: 3.2 min</p>
        </Card>
      </div>

      {/* Featured Primary Event: María Fernández & Carlos Rodríguez */}
      <div className="border border-[#E5E7EB] rounded-2xl bg-white p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="gold">PRODUCCIÓN PRINCIPAL EN VIVO</Badge>
              <Badge variant="emerald" dot>RSVP Abierto</Badge>
              <span className="text-xs font-mono text-slate-500">{primaryDemoEvent.code}</span>
            </div>

            <h2 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">
              {primaryDemoEvent.title}
            </h2>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#C99B18]" /> {primaryDemoEvent.dateFormatted}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#C99B18]" /> {primaryDemoEvent.ceremonyTime}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#C99B18]" /> {primaryDemoEvent.venue}
              </span>
              <span className="text-[#8A6510] font-semibold">
                {primaryDemoEvent.confirmedGuests} / {primaryDemoEvent.totalGuests} Confirmados (69.2%)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<ExternalLink className="w-4 h-4" />}
              onClick={() => {
                setAppMode('client');
                addToast('Cambiando a Portal de Anfitriones (Novios)', 'info');
              }}
            >
              Portal Anfitriones
            </Button>
            <Button
              variant="gold"
              size="md"
              rightIcon={<ChevronRight className="w-4 h-4" />}
              onClick={() => handleOpenEvent(primaryDemoEvent.id)}
            >
              Abrir Espacio de Trabajo
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-5 border-t border-[#E5E7EB]">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
            <span className="font-medium">Progreso RSVP de Invitados VIP</span>
            <span className="font-mono text-slate-700">194 Confirmados • 58 Pendientes • 28 Rechazados</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
            <div className="bg-[#16A34A] h-full" style={{ width: '69.2%' }} title="Confirmados: 69.2%" />
            <div className="bg-[#EA580C] h-full" style={{ width: '20.7%' }} title="Pendientes: 20.7%" />
            <div className="bg-[#DC2626] h-full" style={{ width: '10.1%' }} title="Rechazados: 10.1%" />
          </div>
        </div>
      </div>

      {/* Grid: Active Productions Table & Concierge / Atelier Quick Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Active Productions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-heading font-bold text-slate-900">Producciones & Eventos Activos</h3>
              <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-600 font-mono font-medium">12 en curso</span>
            </div>
            <button
              onClick={() => setStudioView('events')}
              className="text-xs text-[#8A6510] hover:text-[#725208] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              Ver catálogo completo <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="border border-[#E5E7EB] rounded-xl bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-[#F9FAFB] text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-[#E5E7EB]">
                  <tr>
                    <th className="py-3 px-4">Evento / Pareja</th>
                    <th className="py-3 px-4">Fecha & Destino</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4">RSVP VIP</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  <tr className="hover:bg-[#F9FAFB] transition-colors cursor-pointer" onClick={() => handleOpenEvent(primaryDemoEvent.id)}>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 font-heading">María Fernández & Carlos Rodríguez</div>
                      <div className="text-xs text-slate-500 font-mono">#EV-2026-904 • Plan Imperial</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-medium text-slate-800">24 Oct 2026</div>
                      <div className="text-slate-500">Villa Florencia, Jarabacoa</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="emerald" dot>RSVP En Vivo</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono">
                      <span className="text-[#16A34A] font-bold">194</span> / 280
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleOpenEvent(primaryDemoEvent.id); }}>
                        Gestionar
                      </Button>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#F9FAFB] transition-colors cursor-pointer" onClick={() => handleOpenEvent('ev-alejandro-valeria')}>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 font-heading">Alejandro & Valeria Almonte</div>
                      <div className="text-xs text-slate-500 font-mono">#EV-2026-912 • Plan Royal</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-medium text-slate-800">14 Nov 2026</div>
                      <div className="text-slate-500">Casa de Campo, La Romana</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="amber">Aprobación Diseño</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono">
                      <span className="text-[#EA580C] font-bold">0</span> / 320
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleOpenEvent('ev-alejandro-valeria'); }}>
                        Gestionar
                      </Button>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#F9FAFB] transition-colors cursor-pointer" onClick={() => handleOpenEvent('ev-gabriela-morales')}>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 font-heading">Gala Benéfica Fundación Mir 2026</div>
                      <div className="text-xs text-slate-500 font-mono">#EV-2026-918 • Gala VIP</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-medium text-slate-800">05 Dic 2026</div>
                      <div className="text-slate-500">Altos de Chavón</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="slate">En Producción</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono">
                      <span className="text-slate-500">Pre-invitaciones</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleOpenEvent('ev-gabriela-morales'); }}>
                        Gestionar
                      </Button>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#F9FAFB] transition-colors cursor-pointer" onClick={() => handleOpenEvent('ev-sofia-bautizo')}>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 font-heading">Bautizo Real & Almuerzo Sofía P.</div>
                      <div className="text-xs text-slate-500 font-mono">#EV-2026-921 • Petit Comité</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-medium text-slate-800">18 Dic 2026</div>
                      <div className="text-slate-500">Club Hemingway, Juan Dolio</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="emerald" dot>RSVP En Vivo</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono">
                      <span className="text-[#16A34A] font-bold">45</span> / 50
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleOpenEvent('ev-sofia-bautizo'); }}>
                        Gestionar
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Concierge Queue & Atelier Quick Panel */}
        <div className="space-y-6">
          {/* Concierge VIP Feed */}
          <div className="border border-[#E5E7EB] rounded-xl bg-white p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#16A34A]" /> Concierge & Alertas VIP
              </h3>
              <span className="text-xs text-[#16A34A] font-semibold bg-[#F0FDF4] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
                En vivo
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-semibold text-slate-900">Ana Gómez (Mesa Imperial)</span>
                  <span className="text-[11px]">Hace 8 min</span>
                </div>
                <p className="text-slate-700">
                  Confirmó con acompañante. Nota: Intolerancia al gluten severa solicitada.
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                  <span className="text-[#16A34A] font-medium">✓ QR generado</span> • <span>Mesa 01</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-semibold text-slate-900">Dr. Eduardo Santos</span>
                  <span className="text-[11px]">Hace 24 min</span>
                </div>
                <p className="text-slate-700">
                  Cambio de estado: Asistirá a la ceremonia religiosa únicamente.
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                  <span className="text-[#EA580C] font-medium">Pendiente reubicación</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-semibold text-slate-900">Lic. Patricia Ramos (Planner)</span>
                  <span className="text-[11px]">Hace 1 h</span>
                </div>
                <p className="text-slate-700">
                  Aprobó la distribución preliminar del seating plan de 28 mesas.
                </p>
              </div>
            </div>
          </div>

          {/* Atelier Templates Quick Status */}
          <div className="border border-[#E5E7EB] rounded-xl bg-white p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C99B18]" /> Atelier de Diseños
              </h3>
              <button
                onClick={() => setStudioView('atelier-templates')}
                className="text-xs text-[#8A6510] hover:text-[#725208] font-semibold cursor-pointer"
              >
                Ver Diseños
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Plantillas 100% artesanales y libres de IA para bodas de lujo. Creadas con tipografías de alta gama y acentos oro puro.
            </p>
            <div className="p-3 rounded-lg bg-[#FFF8DC] border border-[#F1DC91] text-xs">
              <div className="font-semibold text-[#8A6510]">Plantilla Activa: Imperial Gold Royal</div>
              <div className="text-slate-600 mt-0.5">Versión v2.4.0 • PWA nativa con soporte Offline y Apple Wallet Ready</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
