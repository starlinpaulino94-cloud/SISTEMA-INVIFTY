import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { primaryDemoEvent } from '../../services/eventsService';
import {
  Calendar,
  Users,
  Search,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Plus,
  ShieldCheck,
  QrCode
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

export const EventsView: React.FC = () => {
  const { setStudioView, setSelectedEventId, setAppMode } = useApp();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');

  const eventsList = [
    primaryDemoEvent,
    {
      id: 'ev-alejandro-valeria',
      code: '#EV-2026-912',
      title: 'Alejandro & Valeria Almonte',
      dateFormatted: '14 de Noviembre, 2026',
      ceremonyTime: '4:00 PM',
      venue: 'Casa de Campo Resort & Villas',
      location: 'La Romana, República Dominicana',
      status: 'planning' as const,
      totalGuests: 320,
      confirmedGuests: 110,
      plan: 'Royal Heritage ($3,200)',
      slug: 'alejandro-valeria',
    },
    {
      id: 'ev-gabriela-morales',
      code: '#EV-2026-918',
      title: 'Gala Benéfica Fundación Mir 2026',
      dateFormatted: '05 de Diciembre, 2026',
      ceremonyTime: '7:30 PM',
      venue: 'Anfiteatro Altos de Chavón',
      location: 'La Romana, República Dominicana',
      status: 'upcoming' as const,
      totalGuests: 450,
      confirmedGuests: 290,
      plan: 'Atelier Bespoke ($6,500)',
      slug: 'gala-mir-2026',
    },
    {
      id: 'ev-sofia-bautizo',
      code: '#EV-2026-921',
      title: 'Bautizo Real Sofía Patricia',
      dateFormatted: '18 de Diciembre, 2026',
      ceremonyTime: '11:30 AM',
      venue: 'Club Hemingway',
      location: 'Juan Dolio, San Pedro de Macorís',
      status: 'live' as const,
      totalGuests: 65,
      confirmedGuests: 52,
      plan: 'Signature ($2,400)',
      slug: 'bautizo-sofia',
    },
  ];

  const filteredEvents = eventsList.filter((ev) =>
    ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ev.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ev.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenWorkspace = (eventId: string) => {
    setSelectedEventId(eventId);
    setStudioView('event-workspace');
    addToast('Espacio de trabajo del evento cargado', 'info');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8A6510] font-semibold">Dirección de Producciones</span>
            <span className="text-xs text-slate-400">• Bodas de Lujo & Galas VIP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 tracking-tight">
            Espacios de Trabajo de Eventos
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gestión integral de listas de invitados, RSVP en tiempo real, pases de acceso QR, seating plan y atelier media.
          </p>
        </div>

        <Button
          variant="gold"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setStudioView('create-lead')}
        >
          Iniciar Nueva Producción
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-xs">
        <div className="w-full md:w-96">
          <Input
            placeholder="Buscar por pareja, código o locación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Mostrando {filteredEvents.length} eventos activos
        </div>
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((ev) => {
          const total = ev.totalGuests || 1;
          const confirmationPct = Math.round((ev.confirmedGuests / total) * 100);
          return (
            <div
              key={ev.id}
              className="rounded-2xl border border-[#E5E7EB] bg-white p-6 hover:border-[#D6AE36] hover:shadow-sm transition-all space-y-5 flex flex-col justify-between shadow-xs"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#8A6510] font-semibold">{ev.code}</span>
                    <Badge variant={ev.status === 'live' ? 'emerald' : 'gold'} dot={ev.status === 'live'}>
                      {ev.status === 'live' ? 'RSVP EN VIVO' : 'EN PRODUCCIÓN'}
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">{ev.plan}</span>
                </div>

                <div>
                  <h3 className="text-xl font-heading font-bold text-slate-900 hover:text-[#8A6510] transition-colors">
                    {ev.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C99B18]" />
                    <span>{ev.venue} • {ev.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#E5E7EB] text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Fecha & Hora</span>
                    <span className="font-semibold text-slate-800">{ev.dateFormatted}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Confirmación RSVP</span>
                    <span className="font-mono font-bold text-[#16A34A]">
                      {ev.confirmedGuests} / {ev.totalGuests} ({confirmationPct}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5 font-mono">
                    <span>Aforo confirmado</span>
                    <span className="font-semibold text-slate-800">{confirmationPct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-[#E5E7EB]">
                    <div
                      className="bg-[#16A34A] h-full transition-all duration-500"
                      style={{ width: `${confirmationPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 flex items-center justify-between gap-3 border-t border-[#E5E7EB]">
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setAppMode('runtime');
                    addToast(`Abriendo invitación PWA para ${ev.title}`, 'info');
                  }}
                >
                  PWA Invitado
                </Button>

                <Button
                  variant="gold"
                  size="sm"
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                  onClick={() => handleOpenWorkspace(ev.id)}
                >
                  Abrir Espacio
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
