import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { primaryDemoEvent } from '../../services/eventsService';
import { guestsService } from '../../services/guestsService';
import { Guest } from '../../types';
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  Heart,
  Share2,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertTriangle,
  Music,
  ArrowLeft,
  Smartphone,
  Phone,
  MessageSquare
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

export const ClientPortal: React.FC = () => {
  const { setAppMode, setStudioView } = useApp();
  const { addToast } = useToast();

  const [guests, setGuests] = useState<Guest[]>([]);
  const [searchGuest, setSearchGuest] = useState('');
  const [activeTab, setActiveTab] = useState<'rsvp' | 'mesas' | 'musica'>('rsvp');

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    const list = await guestsService.getGuests(primaryDemoEvent.id);
    setGuests(list);
  };

  const confirmedGuests = guests.filter((g) => g.status === 'confirmado');
  const pendingGuests = guests.filter((g) => g.status === 'pendiente');
  const declinedGuests = guests.filter((g) => g.status === 'rechazado');

  const filteredGuests = guests.filter(
    (g) =>
      g.name.toLowerCase().includes(searchGuest.toLowerCase()) ||
      (g.companionName && g.companionName.toLowerCase().includes(searchGuest.toLowerCase())) ||
      String(g.tableNumber || '').toLowerCase().includes(searchGuest.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-800 flex flex-col font-sans">
      {/* Top Banner Navigation */}
      <header className="border-b border-[#E5E7EB] bg-white sticky top-0 z-40 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => {
              setAppMode('studio');
              setStudioView('dashboard');
              addToast('Regresando a Invifty Studio OS', 'info');
            }}
          >
            Volver a Studio OS
          </Button>
          <div className="h-4 w-px bg-[#E5E7EB] hidden sm:block" />
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#8A6510] font-sans font-medium">
            <Heart className="w-3.5 h-3.5 text-[#C99B18] fill-[#D6AE36]" />
            <span>Portal de Anfitriones</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="gold"
            size="sm"
            leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
            onClick={() => {
              setAppMode('runtime');
              addToast('Abriendo la invitación interactiva de los invitados', 'info');
            }}
          >
            Ver Invitación PWA
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-fadeIn">
        {/* Modern Light Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] p-6 sm:p-10 shadow-xs text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#8A6510] font-semibold bg-[#FFF8DC] px-3 py-1 rounded-full border border-[#F1DC91]">
              Nuestra Boda de Gala
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-bold text-slate-900 tracking-tight">
            María & Carlos
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-slate-600 pt-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-[#C99B18]" /> 24 de Octubre, 2026
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-[#C99B18]" /> Villa Florencia, Jarabacoa
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[#8A6510] font-semibold bg-[#FFF8DC] px-2.5 py-0.5 rounded-full border border-[#F1DC91]">Faltan 29 días</span>
          </div>
        </div>

        {/* Live RSVP Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card variant="default" className="text-center py-6 border-[#BBF7D0]">
            <div className="text-xs font-mono uppercase text-[#16A34A] font-semibold">Confirmados</div>
            <div className="text-4xl font-heading font-bold text-[#16A34A] mt-2">
              {confirmedGuests.length}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {Math.round((confirmedGuests.length / (guests.length || 1)) * 100)}% de la lista
            </p>
          </Card>

          <Card variant="default" className="text-center py-6 border-[#FED7AA]">
            <div className="text-xs font-mono uppercase text-[#EA580C] font-semibold">Pendientes</div>
            <div className="text-4xl font-heading font-bold text-[#EA580C] mt-2">
              {pendingGuests.length}
            </div>
            <p className="text-xs text-slate-500 mt-1">Recordatorio en curso por Concierge</p>
          </Card>

          <Card variant="default" className="text-center py-6 border-[#FECACA]">
            <div className="text-xs font-mono uppercase text-[#DC2626] font-semibold">No Asistirán</div>
            <div className="text-4xl font-heading font-bold text-[#DC2626] mt-2">
              {declinedGuests.length}
            </div>
            <p className="text-xs text-slate-500 mt-1">Espacios liberados en mesa</p>
          </Card>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-center gap-2 border-b border-[#E5E7EB] pb-4">
          {[
            { id: 'rsvp', label: `Lista de Invitados (${guests.length})` },
            { id: 'mesas', label: 'Distribución de Mesas' },
            { id: 'musica', label: 'Canciones Sugeridas' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#FFF8DC] text-[#8A6510] font-semibold border border-[#F1DC91] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Guest List with Search */}
        {activeTab === 'rsvp' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-80">
                <Input
                  placeholder="Buscar familiar, amigo o mesa..."
                  value={searchGuest}
                  onChange={(e) => setSearchGuest(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                />
              </div>

              <div className="text-xs text-slate-500 font-mono">
                Mostrando {filteredGuests.length} invitados
              </div>
            </div>

            <div className="border border-[#E5E7EB] rounded-2xl bg-white overflow-hidden shadow-xs">
              <div className="divide-y divide-[#E5E7EB]">
                {filteredGuests.map((guest) => (
                  <div
                    key={guest.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F8F9FB] transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-semibold text-slate-900 text-base">
                          {guest.name}
                        </span>
                        {guest.companionName && (
                          <span className="text-xs text-slate-500 font-sans">
                            + {guest.companionName}
                          </span>
                        )}
                        {guest.isVip && (
                          <span className="text-[#C99B18] text-xs" title="VIP">
                            ★
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                        <span className="text-[#8A6510] font-medium">{guest.tableNumber}</span>
                        <span>•</span>
                        <span>{guest.category}</span>
                        {guest.dietaryNotes && (
                          <>
                            <span>•</span>
                            <span className="text-[#DC2626] font-medium">
                              ⚠️ {guest.dietaryNotes}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Seating Chart */}
        {activeTab === 'mesas' && (
          <div className="space-y-6">
            <p className="text-xs text-slate-500 text-center max-w-xl mx-auto">
              Distribución preliminar coordinada con la Wedding Planner Lic. Patricia Ramos y el equipo de catering.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#D6AE36] transition-all space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-slate-900 font-bold">Mesa Presidencial</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#FFF8DC] text-[#8A6510] border border-[#F1DC91]">8 Asientos</span>
                </div>
                <div className="text-xs text-slate-700 space-y-1.5">
                  <div className="p-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] font-medium">
                    María Fernández (Novia) & Carlos Rodríguez (Novio)
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB]">
                    Padres de la Novia: Don Guillermo Fernández & Doña Carmen
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB]">
                    Padres del Novio: Ing. Roberto Rodríguez & Sra. Elena
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#D6AE36] transition-all space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-slate-900 font-bold">Mesa 01 Imperial (Corte)</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#FFF8DC] text-[#8A6510] border border-[#F1DC91]">10 Asientos</span>
                </div>
                <div className="text-xs text-slate-700 space-y-1.5">
                  <div className="p-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB]">
                    Ana Gómez & Roberto Gómez
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB]">
                    Sofia Herrera & Mateo Castillo
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB]">
                    Valeria Ramos & Acompañante
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Music suggestions */}
        {activeTab === 'musica' && (
          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-heading font-bold text-slate-900 flex items-center gap-2">
                <Music className="w-5 h-5 text-[#C99B18]" /> Canciones Solicitadas por Invitados
              </h3>
              <Badge variant="gold">18 Sugerencias</Badge>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">Bachata Rosa — Juan Luis Guerra</div>
                  <div className="text-slate-500">Sugerida por: Don Alejandro Morales</div>
                </div>
                <span className="font-mono text-[#16A34A] font-semibold">Aprobada para baile</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">Can't Take My Eyes Off You — Frankie Valli</div>
                  <div className="text-slate-500">Sugerida por: Ana Gómez</div>
                </div>
                <span className="font-mono text-[#16A34A] font-semibold">Aprobada para cóctel</span>
              </div>
            </div>
          </div>
        )}

        {/* Planner Help Footer Card */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="text-center sm:text-left">
            <h4 className="font-heading font-bold text-slate-900 text-base">¿Dudas con la lista o seating plan?</h4>
            <p className="text-xs text-slate-500">
              Tu Wedding Planner Lic. Patricia Ramos y el equipo de Concierge están disponibles por WhatsApp.
            </p>
          </div>

          <a
            href="https://wa.me/18095550188?text=Hola%20Patricia,%20somos%20Mar%C3%ADa%20y%20Carlos."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Hablar con Wedding Planner</span>
          </a>
        </div>
      </main>
    </div>
  );
};
