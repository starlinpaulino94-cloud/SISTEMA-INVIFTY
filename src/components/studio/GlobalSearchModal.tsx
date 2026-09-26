import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import {
  Search,
  X,
  Calendar,
  UserCheck,
  Users,
  CreditCard,
  Link,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Button } from '../ui/Button';

export const GlobalSearchModal: React.FC = () => {
  const {
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    openEventWorkspace,
    openLeadDetail,
    openGuestDetail,
    openPublicInvitationRuntime,
  } = useApp();
  const { toast } = useToast();

  const [query, setQuery] = useState('María');
  const [activeTab, setActiveTab] = useState<'todos' | 'eventos' | 'clientes' | 'invitados' | 'pagos' | 'slugs'>('todos');

  if (!isGlobalSearchOpen) return null;

  const handleCopyLink = (slug: string) => {
    navigator.clipboard.writeText(`https://${slug}`);
    toast('Enlace copiado al portapapeles', `https://${slug}`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsGlobalSearchOpen(false)}
      />

      {/* Main Search Container */}
      <div className="relative w-full max-w-5xl bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl text-slate-900 z-10 overflow-hidden max-h-[90vh] flex flex-col my-auto">
        {/* Header Kicker */}
        <div className="px-6 pt-3.5 pb-2.5 border-b border-[#E5E7EB] bg-[#F8F9FA] flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D6AE36] animate-pulse" />
            <span className="font-semibold text-xs text-slate-700">
              Centro de Rastreo Global & Atelieres • Explorador Maestro
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 font-mono text-[10px] text-slate-400">
            <span><kbd className="px-1 py-0.5 bg-white rounded border border-slate-200">ESC</kbd> limpiar</span>
            <span>•</span>
            <span><kbd className="px-1 py-0.5 bg-white rounded border border-slate-200">↵</kbd> saltar a detalle</span>
            <span>•</span>
            <span><kbd className="px-1 py-0.5 bg-white rounded border border-slate-200">⌘K</kbd> foco instantáneo</span>
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 px-6 border-b border-[#E5E7EB] bg-white flex items-center gap-3">
          <Search className="w-5 h-5 text-[#D6AE36] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por cliente, novios, slug, teléfono, número de comprobante..."
            className="flex-1 bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none font-sans"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-xs px-2.5 py-1 rounded-lg bg-[#FFF8DC] border border-[#F1DC91] text-[#8A6510] font-mono font-semibold">
            28 REGISTROS
          </span>
        </div>

        {/* Category Pills */}
        <div className="px-6 py-2.5 border-b border-[#E5E7EB] bg-[#F8F9FA] flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('todos')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
              activeTab === 'todos' ? 'bg-[#FFF8DC] text-[#8A6510] font-semibold border border-[#F1DC91]' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            Todos (28)
          </button>
          <button
            onClick={() => setActiveTab('eventos')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
              activeTab === 'eventos' ? 'bg-[#FFF8DC] text-[#8A6510] font-semibold border border-[#F1DC91]' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            Eventos (6)
          </button>
          <button
            onClick={() => setActiveTab('clientes')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
              activeTab === 'clientes' ? 'bg-[#FFF8DC] text-[#8A6510] font-semibold border border-[#F1DC91]' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            Clientes (4)
          </button>
          <button
            onClick={() => setActiveTab('invitados')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
              activeTab === 'invitados' ? 'bg-[#FFF8DC] text-[#8A6510] font-semibold border border-[#F1DC91]' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            Invitados (12)
          </button>
          <button
            onClick={() => setActiveTab('pagos')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
              activeTab === 'pagos' ? 'bg-[#FFF8DC] text-[#8A6510] font-semibold border border-[#F1DC91]' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            Órdenes & Pagos (3)
          </button>
          <button
            onClick={() => setActiveTab('slugs')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
              activeTab === 'slugs' ? 'bg-[#FFF8DC] text-[#8A6510] font-semibold border border-[#F1DC91]' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            Slugs & Enlaces (2)
          </button>
        </div>

        {/* Content Body: Left Results + Right Dossier Drawer */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#E5E7EB]">
          {/* Main Results Column */}
          <div className="lg:col-span-2 p-6 space-y-6">
            {/* 1. Eventos & Espacios de Trabajo */}
            {(activeTab === 'todos' || activeTab === 'eventos') && (
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-[#C99B18]" />
                    Eventos & Espacios de Trabajo
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">6 coincidencias</span>
                </div>

                {/* Primary Event Featured Card */}
                <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#D6AE36] transition-all space-y-3 shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF8DC] text-[#8A6510] border border-[#F1DC91] uppercase">
                          Boda Magna
                        </span>
                        <span className="text-xs text-slate-500">Plan Premium</span>
                        <span className="text-xs text-[#EA580C] font-medium">· Fase 3: Revisión Cliente</span>
                      </div>
                      <h4 className="text-lg font-heading font-bold text-slate-900">
                        Boda <span className="text-[#8A6510] bg-[#FFF8DC] px-1 rounded">María</span> Fernández & Carlos Rodríguez
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        14 Nov 2026 • Villa Florencia, Jarabacoa
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[10px] text-slate-400 uppercase">Presupuesto Atelier</div>
                      <div className="text-sm font-bold text-slate-900 font-mono">RD$4,000</div>
                      <div className="text-[10px] text-[#EA580C] font-mono">RD$1,500 pendiente</div>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Aforo Confirmado</span>
                      <span className="font-mono font-bold text-slate-800">118 / 150 (78.6%)</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Dominio PWA</span>
                      <span className="font-mono text-[#8A6510] truncate block">invifty.com/i/maria-carlos</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-500 block">Último Hito</span>
                      <span className="text-slate-700 truncate block">Revisión V4 en progreso</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="gold"
                      size="sm"
                      onClick={() => {
                        setIsGlobalSearchOpen(false);
                        openEventWorkspace('ev-maria-carlos');
                      }}
                    >
                      Abrir Workspace
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setIsGlobalSearchOpen(false);
                        openPublicInvitationRuntime('maria-carlos');
                      }}
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1 text-[#C99B18]" />
                      Ver Invitación PWA
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyLink('invifty.com/i/maria-carlos')}
                    >
                      Copiar Enlace
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Clientes & Contactos Principales */}
            {(activeTab === 'todos' || activeTab === 'clientes') && (
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <UserCheck className="w-3.5 h-3.5 text-[#C99B18]" />
                    Clientes & Contactos Principales
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">4 coincidencias</span>
                </div>

                <div className="space-y-2">
                  <div
                    onClick={() => {
                      setIsGlobalSearchOpen(false);
                      openLeadDetail('lead-1');
                    }}
                    className="p-3 rounded-xl bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-between cursor-pointer transition-colors shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FFF8DC] text-[#8A6510] border border-[#F1DC91] font-bold flex items-center justify-center text-xs">
                        MF
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          <span className="text-[#8A6510]">María</span> Fernández
                          <span className="text-xs text-slate-500 font-normal ml-2">Novia Titular</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          +1 (829) 555-0142 · maria.fernandez@gmail.com
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        1 Evento Activo
                      </span>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setIsGlobalSearchOpen(false);
                      openLeadDetail('lead-1');
                    }}
                    className="p-3 rounded-xl bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-between cursor-pointer transition-colors shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-bold flex items-center justify-center text-xs">
                        MA
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          Lic. <span className="text-[#8A6510]">María</span> Almonte
                          <span className="text-xs text-slate-500 font-normal ml-2">Wedding Planner / Partner VIP</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          +1 (809) 555-8810 · maria@almonteevents.com
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-[#8A6510] bg-[#FFF8DC] px-2 py-0.5 rounded border border-[#F1DC91]">
                        3 Eventos Asociados
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Invitados en Listas de Eventos */}
            {(activeTab === 'todos' || activeTab === 'invitados') && (
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <Users className="w-3.5 h-3.5 text-[#C99B18]" />
                    Invitados en Listas de Eventos
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">12 coincidencias</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div
                    onClick={() => {
                      setIsGlobalSearchOpen(false);
                      openGuestDetail('gst-1');
                    }}
                    className="p-3 rounded-xl bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium text-slate-900">
                        Ana <span className="text-[#8A6510]">María</span> Gómez
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-mono">
                        Confirmado (2)
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Boda María & Carlos · Mesa 2 (Terraza Jardín)
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setIsGlobalSearchOpen(false);
                      openGuestDetail('gst-3');
                    }}
                    className="p-3 rounded-xl bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium text-slate-900">
                        <span className="text-[#8A6510]">María</span> Victoria Álvarez
                      </div>
                      <span className="text-[10px] text-[#8A6510] bg-[#FFF8DC] border border-[#F1DC91] px-1.5 py-0.2 rounded font-mono">
                        4 Pases VIP
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Boda María & Carlos · Mesa 2 (Honor)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Órdenes, Pagos & Conciliaciones */}
            {(activeTab === 'todos' || activeTab === 'pagos') && (
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <CreditCard className="w-3.5 h-3.5 text-[#C99B18]" />
                    Órdenes, Pagos & Conciliaciones
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">3 transacciones</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-between text-xs shadow-xs">
                  <div>
                    <div className="font-semibold text-slate-900">
                      Comprobante Banco Popular #BP-8819024
                    </div>
                    <div className="text-slate-500">
                      Cliente: María Fernández · Evento: Boda María & Carlos · 10 Sep 2026
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-900">RD$2,500.00</div>
                    <span className="text-[10px] text-emerald-600 flex items-center gap-1 justify-end font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Verificado
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Vista Rápida de Expediente & Búsquedas Recientes */}
          <div className="p-6 bg-[#F8F9FA] space-y-6">
            <div>
              <div className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider mb-3">
                Vista Rápida de Expediente
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] space-y-3 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>ID: EV-8810</span>
                  <span className="text-[#8A6510] font-semibold">V4 Preview</span>
                </div>
                <div className="h-28 rounded-lg bg-gradient-to-br from-[#FFF8DC] via-white to-amber-50 border border-[#F1DC91] p-3 flex flex-col justify-end text-left">
                  <div className="text-[10px] text-[#8A6510] uppercase tracking-widest font-mono font-semibold">Plantilla Imperial Gold</div>
                  <div className="font-heading font-bold text-base text-slate-900">María & Carlos</div>
                  <div className="text-[10px] text-slate-500">Jarabacoa · Noviembre 2026</div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Productor Asignado:</span>
                    <span className="text-slate-900 font-medium">Starlin (Lead)</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Canal Notificación:</span>
                    <span className="text-emerald-700 font-medium">WhatsApp API VIP</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Tasa de Entrega:</span>
                    <span className="text-slate-900 font-mono font-bold">99.2%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Búsquedas Recientes */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase text-slate-500 tracking-wider mb-2">
                <span>Búsquedas Recientes</span>
                <span className="text-[10px] text-slate-400 cursor-pointer hover:text-slate-700">Borrar</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="p-2 rounded-lg bg-white border border-[#E5E7EB] hover:bg-slate-50 flex items-center justify-between cursor-pointer shadow-xs">
                  <span>Comprobante #BP-9821</span>
                  <Clock className="w-3 h-3 text-slate-400" />
                </div>
                <div className="p-2 rounded-lg bg-white border border-[#E5E7EB] hover:bg-slate-50 flex items-center justify-between cursor-pointer shadow-xs">
                  <span>Andrea Gómez Quinceañera</span>
                  <Clock className="w-3 h-3 text-slate-400" />
                </div>
                <div className="p-2 rounded-lg bg-white border border-[#E5E7EB] hover:bg-slate-50 flex items-center justify-between cursor-pointer shadow-xs">
                  <span>invifty.com/i/sofia-mateo</span>
                  <Clock className="w-3 h-3 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Vistas & Filtros Guardados */}
            <div>
              <div className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider mb-2">
                Vistas Guardadas
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E5E7EB] hover:bg-slate-50 cursor-pointer text-slate-700 shadow-xs">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Eventos con revisión vencida
                  </span>
                  <span className="font-mono text-slate-400">4</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E5E7EB] hover:bg-slate-50 cursor-pointer text-slate-700 shadow-xs">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
                    Pagos pendientes de conciliar
                  </span>
                  <span className="font-mono text-slate-400">7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
