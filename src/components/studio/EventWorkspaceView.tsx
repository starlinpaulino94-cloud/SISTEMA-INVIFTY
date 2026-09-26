import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { eventsService, primaryDemoEvent } from '../../services/eventsService';
import { guestsService } from '../../services/guestsService';
import { Guest, EventWorkspaceData } from '../../types';
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  Share2,
  Copy,
  Plus,
  Search,
  Filter,
  Download,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Phone,
  Mail,
  Edit,
  Trash2,
  Music,
  Palette,
  CreditCard,
  MessageSquare,
  Settings,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { GuestModal } from './GuestModal';

export const EventWorkspaceView: React.FC = () => {
  const { setStudioView, setAppMode } = useApp();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'general' | 'guests' | 'seating' | 'atelier' | 'concierge' | 'finances' | 'pwa'
  >('general');

  const [eventData, setEventData] = useState<EventWorkspaceData>(primaryDemoEvent);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [searchGuest, setSearchGuest] = useState('');
  const [guestCategoryFilter, setGuestCategoryFilter] = useState('all');
  const [guestStatusFilter, setGuestStatusFilter] = useState('all');
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [selectedGuestQr, setSelectedGuestQr] = useState<Guest | null>(null);

  useEffect(() => {
    loadWorkspace();
  }, []);

  const loadWorkspace = async () => {
    const ev = await eventsService.getEventById(primaryDemoEvent.id);
    if (ev) setEventData(ev);
    const guestList = await guestsService.getGuests(primaryDemoEvent.id);
    setGuests(guestList);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://invifty.com/e/${eventData.slug}`);
    addToast('Enlace de la invitación copiado al portapapeles', 'success');
  };

  const handleSaveGuest = async (formData: Partial<Guest>) => {
    if (editingGuest) {
      await guestsService.updateGuest(editingGuest.id, formData);
      addToast(`Huésped ${formData.name} actualizado`, 'success');
    } else {
      await guestsService.addGuest({
        eventId: eventData.id,
        name: formData.name || '',
        companionName: formData.companionName,
        category: formData.category || 'Familia Novia',
        tableNumber: formData.tableNumber || 'Mesa 01 Imperial',
        status: (formData.status as any) || 'pendiente',
        pax: formData.pax || 2,
        phone: formData.phone || '',
        email: formData.email || '',
        dietaryNotes: formData.dietaryNotes || '',
        isVip: formData.isVip ?? true,
        hotelRequired: formData.hotelRequired ?? false,
        transportRequired: formData.transportRequired ?? false,
      });
      addToast(`Huésped ${formData.name} añadido a la lista`, 'success');
    }
    setEditingGuest(null);
    loadWorkspace();
  };

  const handleDeleteGuest = async (id: string, name: string) => {
    if (confirm(`¿Eliminar a ${name} de la lista de invitados?`)) {
      await guestsService.deleteGuest(id);
      addToast(`Huésped ${name} eliminado`, 'info');
      loadWorkspace();
    }
  };

  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchGuest.toLowerCase()) ||
      (g.companionName && g.companionName.toLowerCase().includes(searchGuest.toLowerCase())) ||
      g.code.toLowerCase().includes(searchGuest.toLowerCase()) ||
      String(g.tableNumber || '').toLowerCase().includes(searchGuest.toLowerCase());

    const matchesCategory = guestCategoryFilter === 'all' || g.category === guestCategoryFilter;
    const matchesStatus = guestStatusFilter === 'all' || g.status === guestStatusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const confirmedCount = guests.filter((g) => g.status === 'confirmado').length;
  const pendingCount = guests.filter((g) => g.status === 'pendiente').length;
  const declinedCount = guests.filter((g) => g.status === 'rechazado').length;

  // Real-time RSVP percentage and metrics
  const totalGuestsCount = guests.length || 1;
  const confirmedPct = Number(((confirmedCount / totalGuestsCount) * 100).toFixed(1));
  const pendingPct = Number(((pendingCount / totalGuestsCount) * 100).toFixed(1));
  const declinedPct = Number(((declinedCount / totalGuestsCount) * 100).toFixed(1));

  // Donut metrics for header (r = 28, C = 2 * PI * 28 ~ 175.929)
  const headerDonutRadius = 28;
  const headerCircumference = 2 * Math.PI * headerDonutRadius;
  const headerConfirmedStroke = (confirmedCount / totalGuestsCount) * headerCircumference;
  const headerPendingStroke = (pendingCount / totalGuestsCount) * headerCircumference;
  const headerDeclinedStroke = (declinedCount / totalGuestsCount) * headerCircumference;

  // Donut metrics for detailed card (r = 44, C = 2 * PI * 44 ~ 276.46)
  const mainDonutRadius = 44;
  const mainCircumference = 2 * Math.PI * mainDonutRadius;
  const mainConfirmedStroke = (confirmedCount / totalGuestsCount) * mainCircumference;
  const mainPendingStroke = (pendingCount / totalGuestsCount) * mainCircumference;
  const mainDeclinedStroke = (declinedCount / totalGuestsCount) * mainCircumference;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => setStudioView('dashboard')} className="hover:text-slate-900 cursor-pointer">
            Workspace
          </button>
          <span>/</span>
          <button onClick={() => setStudioView('events')} className="hover:text-slate-900 cursor-pointer">
            Eventos
          </button>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{eventData.title}</span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Smartphone className="w-3.5 h-3.5" />}
            onClick={() => {
              setAppMode('client');
              addToast('Cambiando a Portal de Anfitriones (Vista Novios)', 'info');
            }}
          >
            Portal Novios
          </Button>

          <Button
            variant="gold"
            size="sm"
            leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
            onClick={() => {
              setAppMode('runtime');
              addToast('Lanzando PWA en Modo Invitado', 'info');
            }}
          >
            Ver Invitación PWA
          </Button>
        </div>
      </div>

      {/* Main Event Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#E5E7EB] p-6 md:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FFF8DC] text-[#8A6510] border border-[#F1DC91]">
                {eventData.code}
              </span>
              <Badge variant="emerald" dot>RSVP EN VIVO</Badge>
              <span className="text-xs text-slate-500 font-mono">Colección: {eventData.plan}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 tracking-tight">
              {eventData.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#C99B18]" /> {eventData.dateFormatted}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#C99B18]" /> {eventData.ceremonyTime}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#C99B18]" /> {eventData.venue} ({eventData.location})
              </span>
            </div>

            {/* Custom domain / slug */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="text-slate-500">Enlace PWA público:</span>
              <span className="font-mono text-[#8A6510] bg-[#FFF8DC] px-2 py-1 rounded border border-[#F1DC91]">
                invifty.com/e/{eventData.slug}
              </span>
              <button
                onClick={handleCopyLink}
                className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="Copiar enlace"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Real-time RSVP Donut Stat Widget */}
          <div className="flex flex-col sm:flex-row items-center gap-5 bg-[#F8F9FA] p-4 sm:p-5 rounded-2xl border border-[#E5E7EB]">
            <div className="text-center sm:text-right space-y-1">
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold flex items-center justify-center sm:justify-end gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                <span>RSVP en Vivo</span>
              </div>
              <div className="text-2xl font-heading font-bold text-slate-900">
                <span className="text-[#16A34A]">{confirmedCount}</span>
                <span className="text-slate-400 font-sans text-base mx-1.5">/</span>
                <span className="text-slate-600">{guests.length}</span>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 text-[11px] font-mono">
                <span className="text-[#16A34A] font-semibold">✓ {confirmedCount} ({confirmedPct}%)</span>
                <span className="text-slate-400">•</span>
                <span className="text-[#EA580C] font-semibold">⏳ {pendingCount}</span>
                <span className="text-slate-400">•</span>
                <span className="text-[#DC2626] font-semibold">✕ {declinedCount}</span>
              </div>
            </div>

            {/* Header Mini Donut Chart */}
            <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 72 72">
                {/* Background Track */}
                <circle
                  cx="36"
                  cy="36"
                  r={headerDonutRadius}
                  className="stroke-slate-200"
                  strokeWidth="7"
                  fill="transparent"
                />
                {/* Declined Segment (Rose) */}
                {declinedCount > 0 && (
                  <circle
                    cx="36"
                    cy="36"
                    r={headerDonutRadius}
                    stroke="#dc2626"
                    strokeWidth="7"
                    strokeDasharray={`${headerDeclinedStroke} ${headerCircumference - headerDeclinedStroke}`}
                    strokeDashoffset={-(headerConfirmedStroke + headerPendingStroke)}
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                )}
                {/* Pending Segment (Amber) */}
                {pendingCount > 0 && (
                  <circle
                    cx="36"
                    cy="36"
                    r={headerDonutRadius}
                    stroke="#ea580c"
                    strokeWidth="7"
                    strokeDasharray={`${headerPendingStroke} ${headerCircumference - headerPendingStroke}`}
                    strokeDashoffset={-headerConfirmedStroke}
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                )}
                {/* Confirmed Segment (Emerald) */}
                {confirmedCount > 0 && (
                  <circle
                    cx="36"
                    cy="36"
                    r={headerDonutRadius}
                    stroke="#16a34a"
                    strokeWidth="7"
                    strokeDasharray={`${headerConfirmedStroke} ${headerCircumference - headerConfirmedStroke}`}
                    strokeDashoffset={0}
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-xs font-heading font-bold text-slate-900 leading-none">{confirmedPct}%</span>
                <span className="text-[9px] font-mono text-[#16A34A] uppercase tracking-tighter mt-0.5 font-bold">Aceptado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="mt-8 pt-4 border-t border-[#E5E7EB] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: 'general', label: 'Visión General' },
            { id: 'guests', label: `Huéspedes & RSVP (${guests.length})` },
            { id: 'seating', label: 'Mesas & Seating Plan' },
            { id: 'atelier', label: 'Atelier & Media' },
            { id: 'concierge', label: 'Concierge & Logística' },
            { id: 'finances', label: 'Pagos & Finanzas' },
            { id: 'pwa', label: 'Configuración PWA' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#FFF8DC] text-[#8A6510] font-semibold border border-[#F1DC91] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#F6F7F9]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT: General */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          {/* 4 KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card variant="default">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Invitados Totales</span>
                <Users className="w-4 h-4 text-[#C99B18]" />
              </div>
              <div className="mt-2 text-3xl font-heading font-bold text-slate-900">{eventData.totalGuests}</div>
              <p className="text-xs text-slate-500 mt-1">Aforo contratado de 280 pax</p>
            </Card>

            <Card variant="default">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Confirmados (RSVP)</span>
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              </div>
              <div className="mt-2 text-3xl font-heading font-bold text-[#16A34A]">{confirmedCount}</div>
              <p className="text-xs text-slate-500 mt-1">
                {pendingCount} pendientes • {declinedCount} declinados
              </p>
            </Card>

            <Card variant="default">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Visitas Únicas PWA</span>
                <Sparkles className="w-4 h-4 text-[#C99B18]" />
              </div>
              <div className="mt-2 text-3xl font-heading font-bold text-slate-900">1,284</div>
              <p className="text-xs text-slate-500 mt-1">Tiempo de permanencia: 4m 12s</p>
            </Card>

            <Card variant="default">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Pases QR Emitidos</span>
                <QrCode className="w-4 h-4 text-[#C99B18]" />
              </div>
              <div className="mt-2 text-3xl font-heading font-bold text-slate-900">89</div>
              <p className="text-xs text-slate-500 mt-1">Listos para control en recepción</p>
            </Card>
          </div>

          {/* Real-time RSVP Analytics Card with Donut Chart & Visual Progress Bar */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs relative overflow-hidden space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8A6510]">
                    Telemetría de Asistencia
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-ping" />
                    En Tiempo Real
                  </span>
                </div>
                <h3 className="text-xl font-heading font-bold text-slate-900 tracking-tight">
                  Monitor RSVP & Conciliación de Asistencia
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Estadísticas dinámicas actualizadas automáticamente al registrar confirmaciones en PWA, WhatsApp y recepción.
                </p>
              </div>

              <Button
                variant="gold-outline"
                size="sm"
                onClick={() => setActiveTab('guests')}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Ver Lista Detallada
              </Button>
            </div>

            {/* Main Grid: Donut Chart (Left) + Multi-Segment Progress Bar & Metrics (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column (5 cols): High-Fidelity SVG Donut Chart */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] space-y-5">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 110 110">
                    {/* Background Track */}
                    <circle
                      cx="55"
                      cy="55"
                      r={mainDonutRadius}
                      className="stroke-slate-200"
                      strokeWidth="11"
                      fill="transparent"
                    />

                    {/* Declined Segment (Rose) */}
                    {declinedCount > 0 && (
                      <circle
                        cx="55"
                        cy="55"
                        r={mainDonutRadius}
                        stroke="#dc2626"
                        strokeWidth="11"
                        strokeDasharray={`${mainDeclinedStroke} ${mainCircumference - mainDeclinedStroke}`}
                        strokeDashoffset={-(mainConfirmedStroke + mainPendingStroke)}
                        fill="transparent"
                        className="transition-all duration-700 ease-out"
                      />
                    )}

                    {/* Pending Segment (Amber) */}
                    {pendingCount > 0 && (
                      <circle
                        cx="55"
                        cy="55"
                        r={mainDonutRadius}
                        stroke="#ea580c"
                        strokeWidth="11"
                        strokeDasharray={`${mainPendingStroke} ${mainCircumference - mainPendingStroke}`}
                        strokeDashoffset={-mainConfirmedStroke}
                        fill="transparent"
                        className="transition-all duration-700 ease-out"
                      />
                    )}

                    {/* Confirmed Segment (Emerald) */}
                    {confirmedCount > 0 && (
                      <circle
                        cx="55"
                        cy="55"
                        r={mainDonutRadius}
                        stroke="#16a34a"
                        strokeWidth="11"
                        strokeDasharray={`${mainConfirmedStroke} ${mainCircumference - mainConfirmedStroke}`}
                        strokeDashoffset={0}
                        fill="transparent"
                        className="transition-all duration-700 ease-out"
                      />
                    )}
                  </svg>

                  {/* Center Readout */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <span className="text-3xl font-heading font-bold text-slate-900 tracking-tight leading-none">
                      {confirmedPct}%
                    </span>
                    <span className="text-[11px] font-semibold text-[#16A34A] uppercase tracking-wider mt-1">
                      Aceptación
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {confirmedCount} de {guests.length} pax
                    </span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="grid grid-cols-3 gap-2 w-full pt-1 text-center font-mono text-xs">
                  <div className="p-2 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0]">
                    <span className="text-[#16A34A] font-bold block text-sm">{confirmedCount}</span>
                    <span className="text-[10px] text-slate-500 uppercase">Confirmados</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#FFF7ED] border border-[#FED7AA]">
                    <span className="text-[#EA580C] font-bold block text-sm">{pendingCount}</span>
                    <span className="text-[10px] text-slate-500 uppercase">Pendientes</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#FEF2F2] border border-[#FECACA]">
                    <span className="text-[#DC2626] font-bold block text-sm">{declinedCount}</span>
                    <span className="text-[10px] text-slate-500 uppercase">Rechazados</span>
                  </div>
                </div>
              </div>

              {/* Right Column (7 cols): Visual Segmented Progress Bar & Status Cards */}
              <div className="lg:col-span-7 space-y-5">
                {/* Visual Segmented Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="text-slate-700 font-medium">Distribución Visual de Capacidad</span>
                    <span className="text-slate-500 font-mono">{guests.length} Invitados en Lista</span>
                  </div>

                  {/* Multi-segment Bar */}
                  <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden flex border border-[#E5E7EB] p-0.5 shadow-inner">
                    {confirmedCount > 0 && (
                      <div
                        className="bg-[#16A34A] h-full rounded-l-full transition-all duration-500 relative group cursor-pointer"
                        style={{ width: `${confirmedPct}%` }}
                        onClick={() => {
                          setGuestStatusFilter('confirmado');
                          setActiveTab('guests');
                        }}
                        title={`Confirmados: ${confirmedCount} (${confirmedPct}%)`}
                      />
                    )}
                    {pendingCount > 0 && (
                      <div
                        className="bg-[#EA580C] h-full transition-all duration-500 relative group cursor-pointer"
                        style={{ width: `${pendingPct}%` }}
                        onClick={() => {
                          setGuestStatusFilter('pendiente');
                          setActiveTab('guests');
                        }}
                        title={`Pendientes: ${pendingCount} (${pendingPct}%)`}
                      />
                    )}
                    {declinedCount > 0 && (
                      <div
                        className="bg-[#DC2626] h-full rounded-r-full transition-all duration-500 relative group cursor-pointer"
                        style={{ width: `${declinedPct}%` }}
                        onClick={() => {
                          setGuestStatusFilter('rechazado');
                          setActiveTab('guests');
                        }}
                        title={`Rechazados: ${declinedCount} (${declinedPct}%)`}
                      />
                    )}
                  </div>

                  {/* Segment Percentages Breakdown */}
                  <div className="flex items-center justify-between text-[11px] font-sans pt-1 text-slate-600">
                    <span className="text-[#16A34A] font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#16A34A] inline-block" />
                      {confirmedPct}% Aceptados
                    </span>
                    <span className="text-[#EA580C] font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#EA580C] inline-block" />
                      {pendingPct}% En espera
                    </span>
                    <span className="text-[#DC2626] font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#DC2626] inline-block" />
                      {declinedPct}% Declinados
                    </span>
                  </div>
                </div>

                {/* 3 Status Drill-Down Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div
                    onClick={() => {
                      setGuestStatusFilter('confirmado');
                      setActiveTab('guests');
                    }}
                    className="p-3.5 rounded-xl bg-white border border-[#BBF7D0] hover:border-[#16A34A] transition-all cursor-pointer space-y-1.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase text-[#16A34A]">Aceptados</span>
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    </div>
                    <div className="text-2xl font-heading font-bold text-slate-900">{confirmedCount}</div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Pases QR emitidos y asientos garantizados en seating plan.
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      setGuestStatusFilter('pendiente');
                      setActiveTab('guests');
                    }}
                    className="p-3.5 rounded-xl bg-white border border-[#FED7AA] hover:border-[#EA580C] transition-all cursor-pointer space-y-1.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase text-[#EA580C]">Pendientes</span>
                      <Clock className="w-4 h-4 text-[#EA580C]" />
                    </div>
                    <div className="text-2xl font-heading font-bold text-slate-900">{pendingCount}</div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      En seguimiento activo vía WhatsApp Concierge y SMS.
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      setGuestStatusFilter('rechazado');
                      setActiveTab('guests');
                    }}
                    className="p-3.5 rounded-xl bg-white border border-[#FECACA] hover:border-[#DC2626] transition-all cursor-pointer space-y-1.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase text-[#DC2626]">Declinados</span>
                      <XCircle className="w-4 h-4 text-[#DC2626]" />
                    </div>
                    <div className="text-2xl font-heading font-bold text-slate-900">{declinedCount}</div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Plazas liberadas para invitados de reserva o segunda ronda.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Event Details & Contacts */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
                <h3 className="text-lg font-heading font-bold text-slate-900">Detalles de la Celebración</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                  <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] space-y-1">
                    <span className="text-slate-400 uppercase font-mono text-[10px] font-semibold">Ceremonia Religiosa</span>
                    <div className="font-semibold text-slate-900">Parroquia San Juan Bautista</div>
                    <div className="text-slate-500">Jarabacoa • 5:00 PM</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] space-y-1">
                    <span className="text-slate-400 uppercase font-mono text-[10px] font-semibold">Recepción & Fiesta de Gala</span>
                    <div className="font-semibold text-slate-900">{eventData.venue}</div>
                    <div className="text-slate-500">Jarabacoa • 7:00 PM hasta el amanecer</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] space-y-1">
                    <span className="text-slate-400 uppercase font-mono text-[10px] font-semibold">Código de Vestimenta</span>
                    <div className="font-semibold text-[#8A6510]">{eventData.dressCode}</div>
                    <div className="text-slate-500">Damas traje largo • Caballeros smoking / tuxedo</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] space-y-1">
                    <span className="text-slate-400 uppercase font-mono text-[10px] font-semibold">Hospedaje Recomendado</span>
                    <div className="font-semibold text-slate-900">Gran Jimenoa & Quintas Privadas</div>
                    <div className="text-slate-500">Tarifa preferencial código: INVIFTY2026</div>
                  </div>
                </div>
              </div>

              {/* Milestones / Production Timeline */}
              <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
                <h3 className="text-lg font-heading font-bold text-slate-900">Hitos de Producción Atelier</h3>
                <div className="space-y-3">
                  {(eventData.timeline || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-xs">
                      <div className="w-6 h-6 rounded-full bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] flex items-center justify-center font-bold text-[11px]">
                        ✓
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">{item.title}</div>
                        <div className="text-slate-500">{item.time}</div>
                      </div>
                      <Badge variant={item.status === 'completed' ? 'emerald' : 'gold'}>
                        {item.status.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Key Contacts & Recent Activity */}
            <div className="space-y-6">
              {/* Contacts */}
              <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
                <h3 className="text-sm font-heading font-semibold text-slate-900">Comité Anfitrión & Planner</h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB]">
                    <div className="font-semibold text-slate-900">{eventData.brideName}</div>
                    <div className="text-slate-500 text-[11px]">Novia Titular</div>
                    <div className="flex items-center gap-2 mt-2 font-mono text-slate-700">
                      <Phone className="w-3 h-3 text-[#C99B18]" /> {eventData.bridePhone}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB]">
                    <div className="font-semibold text-slate-900">{eventData.groomName}</div>
                    <div className="text-slate-500 text-[11px]">Novio Titular</div>
                    <div className="flex items-center gap-2 mt-2 font-mono text-slate-700">
                      <Phone className="w-3 h-3 text-[#C99B18]" /> {eventData.groomPhone}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB]">
                    <div className="font-semibold text-[#8A6510]">{eventData.plannerName}</div>
                    <div className="text-slate-500 text-[11px]">Directora de Producción / Planner</div>
                    <div className="flex items-center gap-2 mt-2 font-mono text-slate-700">
                      <Phone className="w-3 h-3 text-[#16A34A]" /> {eventData.plannerPhone}
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Log */}
              <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
                <h3 className="text-sm font-heading font-semibold text-slate-900">Actividad Reciente</h3>
                <div className="space-y-3 text-xs">
                  {(eventData.recentActivity || []).map((act) => (
                    <div key={act.id} className="border-b border-[#E5E7EB] pb-2.5 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span className="font-semibold text-slate-900">{act.user}</span>
                        <span>{act.time}</span>
                      </div>
                      <p className="text-slate-600 mt-1">{act.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Guests & RSVP */}
      {activeTab === 'guests' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div
              onClick={() => setGuestStatusFilter('all')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                guestStatusFilter === 'all'
                  ? 'bg-[#FFF8DC] border-[#D6AE36] text-[#8A6510] shadow-xs'
                  : 'bg-white border-[#E5E7EB] text-slate-600 hover:bg-[#F6F7F9]'
              }`}
            >
              <div className="text-xs uppercase font-mono font-medium">Todos</div>
              <div className="text-2xl font-heading font-bold text-slate-900 mt-1">{guests.length}</div>
            </div>

            <div
              onClick={() => setGuestStatusFilter('confirmado')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                guestStatusFilter === 'confirmado'
                  ? 'bg-[#F0FDF4] border-[#16A34A] text-[#16A34A] shadow-xs'
                  : 'bg-white border-[#E5E7EB] text-slate-600 hover:bg-[#F6F7F9]'
              }`}
            >
              <div className="text-xs uppercase font-mono font-medium">Confirmados</div>
              <div className="text-2xl font-heading font-bold text-[#16A34A] mt-1">{confirmedCount}</div>
            </div>

            <div
              onClick={() => setGuestStatusFilter('pendiente')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                guestStatusFilter === 'pendiente'
                  ? 'bg-[#FFF7ED] border-[#EA580C] text-[#EA580C] shadow-xs'
                  : 'bg-white border-[#E5E7EB] text-slate-600 hover:bg-[#F6F7F9]'
              }`}
            >
              <div className="text-xs uppercase font-mono font-medium">Pendientes</div>
              <div className="text-2xl font-heading font-bold text-[#EA580C] mt-1">{pendingCount}</div>
            </div>

            <div
              onClick={() => setGuestStatusFilter('rechazado')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                guestStatusFilter === 'rechazado'
                  ? 'bg-[#FEF2F2] border-[#DC2626] text-[#DC2626] shadow-xs'
                  : 'bg-white border-[#E5E7EB] text-slate-600 hover:bg-[#F6F7F9]'
              }`}
            >
              <div className="text-xs uppercase font-mono font-medium">Rechazados</div>
              <div className="text-2xl font-heading font-bold text-[#DC2626] mt-1">{declinedCount}</div>
            </div>
          </div>

          {/* Real-time RSVP Multi-Segment Progress Bar */}
          <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-xs space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span className="text-slate-800 font-semibold flex items-center gap-1.5 font-sans">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                <span>Progreso Visual de Respuestas RSVP</span>
              </span>
              <div className="flex flex-wrap items-center gap-4 text-[11px]">
                <span className="text-[#16A34A] font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A] inline-block" />
                  {confirmedCount} Confirmados ({confirmedPct}%)
                </span>
                <span className="text-[#EA580C] font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#EA580C] inline-block" />
                  {pendingCount} Pendientes ({pendingPct}%)
                </span>
                <span className="text-[#DC2626] font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#DC2626] inline-block" />
                  {declinedCount} Rechazados ({declinedPct}%)
                </span>
              </div>
            </div>

            {/* Horizontal Multi-Segment Bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex border border-[#E5E7EB] p-0.5">
              {confirmedCount > 0 && (
                <div
                  className="bg-[#16A34A] h-full rounded-l-full transition-all duration-500"
                  style={{ width: `${confirmedPct}%` }}
                  title={`Confirmados: ${confirmedCount} (${confirmedPct}%)`}
                />
              )}
              {pendingCount > 0 && (
                <div
                  className="bg-[#EA580C] h-full transition-all duration-500"
                  style={{ width: `${pendingPct}%` }}
                  title={`Pendientes: ${pendingCount} (${pendingPct}%)`}
                />
              )}
              {declinedCount > 0 && (
                <div
                  className="bg-[#DC2626] h-full rounded-r-full transition-all duration-500"
                  style={{ width: `${declinedPct}%` }}
                  title={`Rechazados: ${declinedCount} (${declinedPct}%)`}
                />
              )}
            </div>
          </div>

          {/* Guest Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-64">
                <Input
                  placeholder="Buscar invitado, código o mesa..."
                  value={searchGuest}
                  onChange={(e) => setSearchGuest(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                />
              </div>

              <select
                value={guestCategoryFilter}
                onChange={(e) => setGuestCategoryFilter(e.target.value)}
                className="bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#D6AE36] focus:ring-1 focus:ring-[#D6AE36]"
              >
                <option value="all">Todas las Categorías</option>
                <option value="Familia Novia">Familia Novia</option>
                <option value="Familia Novio">Familia Novio</option>
                <option value="Corte de Honor">Corte de Honor</option>
                <option value="Amigos Novios">Amigos Novios</option>
                <option value="Invitados VIP">Invitados VIP</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Download className="w-3.5 h-3.5" />}
                onClick={() => {
                  const csv = `Codigo,Nombre,Acompanante,Categoria,Mesa,Estado,Pax,Telefono,Email,Alergias\n${guests
                    .map(
                      (g) =>
                        `"${g.code}","${g.name}","${g.companionName || ''}","${g.category}","${g.tableNumber}","${g.status}",${g.pax},"${g.phone}","${g.email}","${g.dietaryNotes || ''}"`
                    )
                    .join('\n')}`;
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `invitados-${eventData.slug}.csv`;
                  a.click();
                  addToast('Exportación CSV completada', 'success');
                }}
              >
                Exportar CSV
              </Button>

              <Button
                variant="gold"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => {
                  setEditingGuest(null);
                  setIsGuestModalOpen(true);
                }}
              >
                Añadir Huésped
              </Button>
            </div>
          </div>

          {/* Guests Table */}
          <div className="border border-[#E5E7EB] rounded-xl bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-[#F8F9FA] text-xs font-mono uppercase tracking-wider text-slate-500 border-b border-[#E5E7EB]">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Código & Huésped</th>
                    <th className="py-3.5 px-4 font-semibold">Categoría & Pax</th>
                    <th className="py-3.5 px-4 font-semibold">Mesa Asignada</th>
                    <th className="py-3.5 px-4 font-semibold">Restricciones / Dietas</th>
                    <th className="py-3.5 px-4 font-semibold">Estado RSVP</th>
                    <th className="py-3.5 px-4 font-semibold">Pase QR</th>
                    <th className="py-3.5 px-4 text-right font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {filteredGuests.map((guest) => (
                    <tr key={guest.id} className="hover:bg-[#F8F9FB] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-[#8A6510] font-semibold">{guest.code}</span>
                          {guest.isVip && (
                            <span className="text-[#C99B18] text-xs" title="Invitado VIP">
                              ★
                            </span>
                          )}
                        </div>
                        <div className="font-semibold text-slate-900">{guest.name}</div>
                        {guest.companionName && (
                          <div className="text-xs text-slate-500">
                            Acomp: {guest.companionName}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-xs">
                        <div className="text-slate-700">{guest.category}</div>
                        <div className="text-slate-400 font-mono">{guest.pax} boletos</div>
                      </td>

                      <td className="py-3.5 px-4 text-xs font-medium text-slate-900">
                        {guest.tableNumber}
                      </td>

                      <td className="py-3.5 px-4 text-xs">
                        {guest.dietaryNotes ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
                            <AlertTriangle className="w-3 h-3 text-[#DC2626]" />
                            {guest.dietaryNotes}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">Menú estándar</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            guest.status === 'confirmado'
                              ? 'emerald'
                              : guest.status === 'pendiente'
                              ? 'amber'
                              : 'rose'
                          }
                          dot={guest.status === 'confirmado'}
                        >
                          {guest.status.toUpperCase()}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => setSelectedGuestQr(guest)}
                          className="p-1.5 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] hover:bg-[#FFF8DC] hover:text-[#8A6510] hover:border-[#F1DC91] text-slate-600 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
                          title="Ver credencial de acceso QR"
                        >
                          <QrCode className="w-3.5 h-3.5 text-[#C99B18]" />
                          <span>Pase</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingGuest(guest);
                              setIsGuestModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                            title="Editar huésped"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteGuest(guest.id, guest.name)}
                            className="p-1.5 text-slate-400 hover:text-[#DC2626] transition-colors cursor-pointer"
                            title="Eliminar huésped"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Seating Plan */}
      {activeTab === 'seating' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-base font-heading font-semibold text-slate-900">Visualizador de Mesas & Seating Plan</h3>
              <p className="text-xs text-slate-500">
                Capacidad total del salón: 28 mesas de 10 personas (280 invitados). Alertas automáticas de alérgenos por mesa.
              </p>
            </div>
            <Badge variant="gold">28 MESAS EN SALÓN</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Mesa Presidencial',
                category: 'Novios & Padres',
                capacity: 8,
                guests: [
                  'María Fernández',
                  'Carlos Rodríguez',
                  'Don Guillermo Fernández',
                  'Doña Carmen de Fernández',
                  'Ing. Roberto Rodríguez',
                  'Sra. Elena de Rodríguez',
                ],
                dietaryAlert: null,
              },
              {
                name: 'Mesa 01 Imperial',
                category: 'Corte de Honor',
                capacity: 10,
                guests: ['Ana Gómez', 'Roberto Gómez', 'Sofia Herrera', 'Mateo Castillo', 'Valeria Ramos'],
                dietaryAlert: '1 Celíaco (Ana Gómez)',
              },
              {
                name: 'Mesa 02 Bellagio',
                category: 'Familia Novia',
                capacity: 10,
                guests: ['Mariana Fernández', 'Lucas Mendoza', 'Beatriz Fernández', 'Alonso Díaz'],
                dietaryAlert: '1 Vegetariano',
              },
              {
                name: 'Mesa 03 Florencia',
                category: 'Familia Novio',
                capacity: 10,
                guests: ['Dr. Eduardo Santos', 'Dr. Manuel Rodríguez', 'Laura Santos'],
                dietaryAlert: null,
              },
              {
                name: 'Mesa 04 Versailles',
                category: 'Amigos Novios',
                capacity: 10,
                guests: ['Carolina Peña', 'Javier Ortiz', 'Daniela Cruz', 'Tomás Rivas'],
                dietaryAlert: null,
              },
              {
                name: 'Mesa 05 Toscana',
                category: 'Invitados VIP',
                capacity: 10,
                guests: ['Don Alejandro Morales', 'Doña Vivian Morales'],
                dietaryAlert: 'Alergia a mariscos',
              },
            ].map((table, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#D6AE36] transition-all space-y-4 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-heading font-semibold text-slate-900">{table.name}</h4>
                    <span className="text-xs text-slate-500">{table.category}</span>
                  </div>
                  <span className="text-xs font-mono px-2 py-1 rounded bg-[#FFF8DC] text-[#8A6510] border border-[#F1DC91]">
                    {table.guests.length} / {table.capacity} pax
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#D6AE36] h-full"
                    style={{ width: `${(table.guests.length / table.capacity) * 100}%` }}
                  />
                </div>

                <div className="space-y-1.5">
                  {table.guests.map((gName, gIdx) => (
                    <div
                      key={gIdx}
                      className="text-xs text-slate-700 py-1 px-2.5 rounded bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-between"
                    >
                      <span>{gName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Asiento #{gIdx + 1}</span>
                    </div>
                  ))}
                </div>

                {table.dietaryAlert && (
                  <div className="text-[11px] text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] px-2.5 py-1 rounded flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626]" />
                    <span>{table.dietaryAlert}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Atelier & Media */}
      {activeTab === 'atelier' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Template Card */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-[#8A6510] font-semibold">Plantilla Activa de la Boda</span>
                  <h3 className="text-xl font-heading font-bold text-slate-900 mt-0.5">Imperial Gold Royal (Edición Alta Joyería)</h3>
                </div>
                <Badge variant="gold">v2.4.0 OFICIAL</Badge>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Diseño artesanal desarrollado a medida con tipografías serif clásicas (Playfair Display & Cinzel), láminas de pan de oro animadas por GPU, y renderizado sandboxed independiente sin interferencias de IA.
              </p>

              {/* Color Swatches */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono text-slate-500 uppercase font-semibold">Paleta Cromática de la Boda</span>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB]">
                    <div className="w-4 h-4 rounded-full bg-[#D4AF37] border border-amber-300/40 shadow-xs" />
                    <span className="text-xs text-slate-800 font-mono">Oro Imperial #D4AF37</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB]">
                    <div className="w-4 h-4 rounded-full bg-[#121212] border border-slate-300 shadow-xs" />
                    <span className="text-xs text-slate-800 font-mono">Obsidiana #121212</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB]">
                    <div className="w-4 h-4 rounded-full bg-[#FDFBF7] border border-slate-300 shadow-xs" />
                    <span className="text-xs text-slate-800 font-mono">Perla Seda #FDFBF7</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <Button
                  variant="gold"
                  size="sm"
                  leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setAppMode('runtime');
                    addToast('Abriendo vista previa interactiva en tiempo real', 'info');
                  }}
                >
                  Abrir Invitación PWA
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setStudioView('atelier-templates')}
                >
                  Cambiar Plantilla en Catálogo
                </Button>
              </div>
            </div>

            {/* Music & Media */}
            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
              <h3 className="text-sm font-heading font-semibold text-slate-900 flex items-center gap-2">
                <Music className="w-4 h-4 text-[#C99B18]" /> Banda Sonora de la Invitación
              </h3>
              <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] space-y-2 text-xs">
                <div className="font-semibold text-slate-900">Canon in D Major (Orchestral Harp & Strings)</div>
                <div className="text-slate-500 text-[11px]">Invifty Symphonic Sessions • 3:42</div>
                <div className="pt-2 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] text-[11px] font-mono">
                    ✓ Reproducción Automática con Interacción
                  </span>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-500">
                La música se activa suavemente tras el primer toque del invitado para respetar las políticas de audio del navegador en iOS y Android.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Finances */}
      {activeTab === 'finances' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Card variant="default">
              <div className="text-xs font-mono uppercase text-slate-500 font-medium">Contrato Total Plan</div>
              <div className="text-2xl font-heading font-bold text-slate-900 mt-1">$4,200 USD</div>
              <p className="text-xs text-slate-500 mt-1">Colección Imperial Gold (280 invitados)</p>
            </Card>

            <Card variant="default">
              <div className="text-xs font-mono uppercase text-slate-500 font-medium">Abonado a la Fecha</div>
              <div className="text-2xl font-heading font-bold text-[#16A34A] mt-1">$2,700 USD</div>
              <p className="text-xs text-slate-500 mt-1">64.3% liquidado (Anticipo + Hito 2)</p>
            </Card>

            <Card variant="default">
              <div className="text-xs font-mono uppercase text-slate-500 font-medium">Saldo Pendiente</div>
              <div className="text-2xl font-heading font-bold text-[#EA580C] mt-1">$1,500 USD</div>
              <p className="text-xs text-slate-500 mt-1">Vence 10 días antes de la boda</p>
            </Card>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-heading font-semibold text-slate-900">Historial de Pagos & Conciliación</h3>
              <Button
                variant="gold-outline"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => addToast('Registro de cobro habilitado para Concierge', 'info')}
              >
                Registrar Cobro
              </Button>
            </div>

            <div className="divide-y divide-[#E5E7EB] text-xs">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-900">Anticipo de Reserva (50%)</span>
                  <div className="text-slate-500 text-[11px]">Transferencia Banco BHD León • Ref #TR-98012</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-medium text-[#16A34A]">+$2,100 USD</div>
                  <Badge variant="emerald">PAGADO</Badge>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-900">Abono Hito Aprobación Atelier</span>
                  <div className="text-slate-500 text-[11px]">Tarjeta Visa Signature • Ref #ST-4421</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-medium text-[#16A34A]">+$600 USD</div>
                  <Badge variant="emerald">PAGADO</Badge>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-900">Finiquito Final (Entrega de Pases QR)</span>
                  <div className="text-slate-500 text-[11px]">Programado para el 14 de Octubre de 2026</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-medium text-[#EA580C]">$1,500 USD</div>
                  <Badge variant="amber">PROGRAMADO</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PWA Configuration */}
      {activeTab === 'pwa' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
            <h3 className="text-lg font-heading font-bold text-slate-900">Configuración PWA & Dominio Exclusivo</h3>
            <p className="text-xs text-slate-500">
              Personaliza el nombre de la aplicación para que los invitados puedan agregar la invitación a la pantalla de inicio de su iPhone o Android sin descargas de App Store.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <Input
                label="Nombre PWA (Pantalla de Inicio)"
                defaultValue="Boda María & Carlos"
              />
              <Input
                label="Subdominio Invifty"
                defaultValue="maria-carlos"
                helperText="URL: https://invifty.com/e/maria-carlos"
              />
            </div>

            <div className="pt-4 space-y-3 border-t border-[#E5E7EB]">
              <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#D6AE36] bg-white border-slate-300 focus:ring-[#D6AE36]" />
                <span>Habilitar Modo Offline con Service Worker (Caché local de mapa y código de vestimenta)</span>
              </label>

              <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#D6AE36] bg-white border-slate-300 focus:ring-[#D6AE36]" />
                <span>Generar Pase Apple Wallet & Google Wallet con Código QR de Acceso</span>
              </label>

              <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#D6AE36] bg-white border-slate-300 focus:ring-[#D6AE36]" />
                <span>Protección por Nombre de Huésped (La invitación saluda exclusivamente al titular)</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Concierge */}
      {activeTab === 'concierge' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-heading font-semibold text-slate-900">Consola WhatsApp Concierge</h3>
                <p className="text-xs text-slate-500">
                  Canal de atención directa y personalizada para resolver dudas de invitados, traslados y hoteles.
                </p>
              </div>
              <Badge variant="emerald" dot>CANAL OPERATIVO</Badge>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] flex items-center justify-center font-bold text-xs">
                  WA
                </div>
                <div className="flex-1 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">Ana Gómez (+1 809 555-0144)</span>
                    <span className="text-slate-400 text-[11px]">Hace 8 min</span>
                  </div>
                  <p className="text-slate-700">
                    "Hola Patricia, ¿a qué hora sale el shuttle desde el Hotel Gran Jimenoa hacia la ceremonia?"
                  </p>
                  <div className="pt-2 flex items-center gap-2">
                    <Button
                      variant="gold-outline"
                      size="sm"
                      onClick={() => addToast('Respuesta rápida enviada por WhatsApp Concierge', 'success')}
                    >
                      Responder por WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guest Add/Edit Modal */}
      <GuestModal
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
        onSave={handleSaveGuest}
        initialGuest={editingGuest}
      />

      {/* QR Modal Preview */}
      {selectedGuestQr && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedGuestQr(null)}
        >
          <div
            className="bg-white border border-[#E5E7EB] rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs font-mono text-[#8A6510] uppercase tracking-widest font-semibold">
              INVIFTY DIGITAL PASS • VIP
            </div>
            <h4 className="text-xl font-heading font-bold text-slate-900">{selectedGuestQr.name}</h4>
            {selectedGuestQr.companionName && (
              <p className="text-xs text-slate-500">+ Acompañante: {selectedGuestQr.companionName}</p>
            )}

            {/* QR Mock graphic */}
            <div className="p-6 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl inline-block shadow-inner mx-auto my-2">
              <QrCode className="w-36 h-36 text-slate-900" />
            </div>

            <div className="text-xs font-mono text-[#8A6510] bg-[#FFF8DC] py-1.5 px-3 rounded border border-[#F1DC91]">
              {selectedGuestQr.code} • {selectedGuestQr.tableNumber}
            </div>

            <p className="text-[11px] text-slate-500">
              Presentar en la entrada de Villa Florencia para validación biométrica y de lista.
            </p>

            <Button variant="gold" size="sm" onClick={() => setSelectedGuestQr(null)} className="w-full">
              Cerrar Pase
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
