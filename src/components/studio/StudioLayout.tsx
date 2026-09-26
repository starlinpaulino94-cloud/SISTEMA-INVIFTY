import React from 'react';
import { useApp, StudioView } from '../../context/AppContext';
import {
  Home,
  Users,
  Calendar,
  Layers,
  CheckSquare,
  CreditCard,
  Mail,
  Palette,
  Eye,
  Image as ImageIcon,
  UserCheck,
  Bell,
  FileText,
  BarChart3,
  Settings,
  Wrench,
  Search,
  Plus,
  LogOut,
  Smartphone,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { GlobalSearchModal } from './GlobalSearchModal';

interface StudioLayoutProps {
  children: React.ReactNode;
}

export const StudioLayout: React.FC<StudioLayoutProps> = ({ children }) => {
  const {
    studioView,
    setStudioView,
    setIsGlobalSearchOpen,
    setConstructionModule,
    setAppMode,
    openEventWorkspace,
  } = useApp();

  const handleNavClick = (viewKey: StudioView) => {
    setStudioView(viewKey);
  };

  const navItemClass = (active: boolean) =>
    `flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
      active
        ? 'bg-[#FFF8DC] text-[#8A6510] font-semibold border-l-2 border-[#D6AE36]'
        : 'text-slate-700 hover:text-slate-900 hover:bg-[#F6F7F9]'
    }`;

  const navIconColor = (active: boolean) => (active ? 'text-[#C99B18]' : 'text-[#6B7280]');

  return (
    <div className="flex min-h-screen bg-[#F8F9FB] text-slate-900 font-sans">
      {/* Global Search Modal */}
      <GlobalSearchModal />

      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-[#E5E7EB] bg-white flex flex-col justify-between hidden md:flex sticky top-0 h-screen select-none">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo Section */}
          <div className="p-5 pb-4 border-b border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setStudioView('dashboard')}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D6AE36] to-[#C99B18] flex items-center justify-center text-white shadow-xs font-bold text-base">
                ◈
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-extrabold text-sm tracking-wider text-slate-900 uppercase">INVIFTY</span>
                  <span className="text-[10px] text-[#8A6510] font-mono px-1.5 py-0.2 rounded bg-[#FFF8DC] border border-[#F1DC91] font-semibold">2.0</span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium tracking-wide">
                  Studio OS
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links Scrollable */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs">
            {/* WORKSPACE */}
            <div>
              <div className="px-3 mb-2 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                Workspace
              </div>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={navItemClass(studioView === 'dashboard')}
              >
                <div className="flex items-center gap-2.5">
                  <Home className={`w-4 h-4 ${navIconColor(studioView === 'dashboard')}`} />
                  <span>Home</span>
                </div>
              </button>
            </div>

            {/* SALES */}
            <div>
              <div className="px-3 mb-2 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                Ventas
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => handleNavClick('leads')}
                  className={navItemClass(studioView === 'leads' || studioView === 'lead-detail' || studioView === 'create-lead')}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className={`w-4 h-4 ${navIconColor(studioView === 'leads' || studioView === 'lead-detail' || studioView === 'create-lead')}`} />
                    <span>Leads</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    studioView === 'leads' ? 'bg-[#F1DC91] text-[#725208]' : 'bg-slate-100 text-slate-600'
                  }`}>
                    4
                  </span>
                </button>
                <button
                  onClick={() => handleNavClick('clients')}
                  className={navItemClass(studioView === 'clients')}
                >
                  <div className="flex items-center gap-2.5">
                    <UserCheck className={`w-4 h-4 ${navIconColor(studioView === 'clients')}`} />
                    <span>Clientes</span>
                  </div>
                </button>
              </div>
            </div>

            {/* OPERATIONS */}
            <div>
              <div className="px-3 mb-2 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                Operaciones
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => handleNavClick('events')}
                  className={navItemClass(studioView === 'events' || studioView === 'event-workspace')}
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className={`w-4 h-4 ${navIconColor(studioView === 'events' || studioView === 'event-workspace')}`} />
                    <span>Eventos</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    studioView === 'events' ? 'bg-[#F1DC91] text-[#725208]' : 'bg-[#FFF8DC] text-[#8A6510]'
                  }`}>
                    12
                  </span>
                </button>
                <button
                  onClick={() => handleNavClick('produccion')}
                  className={navItemClass(studioView === 'produccion')}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className={`w-4 h-4 ${navIconColor(studioView === 'produccion')}`} />
                    <span>Producción</span>
                  </div>
                </button>
                <button
                  onClick={() => handleNavClick('revisiones')}
                  className={navItemClass(studioView === 'revisiones' || studioView === 'revision-detail')}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckSquare className={`w-4 h-4 ${navIconColor(studioView === 'revisiones' || studioView === 'revision-detail')}`} />
                    <span>Revisiones</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]">
                    3
                  </span>
                </button>
                <button
                  onClick={() => handleNavClick('pagos')}
                  className={navItemClass(studioView === 'pagos' || studioView === 'pago-detail')}
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className={`w-4 h-4 ${navIconColor(studioView === 'pagos' || studioView === 'pago-detail')}`} />
                    <span>Pagos</span>
                  </div>
                </button>
              </div>
            </div>

            {/* ATELIER & MEDIA */}
            <div>
              <div className="px-3 mb-2 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                Atelier & Media
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => handleNavClick('invitaciones')}
                  className={navItemClass(studioView === 'invitaciones' || studioView === 'invitacion-detail')}
                >
                  <div className="flex items-center gap-2.5">
                    <Mail className={`w-4 h-4 ${navIconColor(studioView === 'invitaciones' || studioView === 'invitacion-detail')}`} />
                    <span>Invitaciones</span>
                  </div>
                </button>
                <button
                  onClick={() => handleNavClick('atelier-templates')}
                  className={navItemClass(studioView === 'atelier-templates' || studioView === 'templates' || studioView === 'plantillas')}
                >
                  <div className="flex items-center gap-2.5">
                    <Palette className={`w-4 h-4 ${navIconColor(studioView === 'atelier-templates' || studioView === 'templates' || studioView === 'plantillas')}`} />
                    <span>Plantillas</span>
                  </div>
                </button>
                <button
                  onClick={() => handleNavClick('demos')}
                  className={navItemClass(studioView === 'demos')}
                >
                  <div className="flex items-center gap-2.5">
                    <Eye className={`w-4 h-4 ${navIconColor(studioView === 'demos')}`} />
                    <span>Demos</span>
                  </div>
                </button>
                <button
                  onClick={() => handleNavClick('media')}
                  className={navItemClass(studioView === 'media')}
                >
                  <div className="flex items-center gap-2.5">
                    <ImageIcon className={`w-4 h-4 ${navIconColor(studioView === 'media')}`} />
                    <span>Media</span>
                  </div>
                </button>
              </div>
            </div>

            {/* GOVERNANCE */}
            <div>
              <div className="px-3 mb-2 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                Gobernanza
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => handleNavClick('equipo')}
                  className={navItemClass(studioView === 'equipo' || studioView === 'equipo-detail')}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className={`w-4 h-4 ${navIconColor(studioView === 'equipo' || studioView === 'equipo-detail')}`} />
                    <span>Equipo</span>
                  </div>
                </button>
                <button
                  onClick={() => handleNavClick('notificaciones')}
                  className={navItemClass(studioView === 'notificaciones')}
                >
                  <div className="flex items-center gap-2.5">
                    <Bell className={`w-4 h-4 ${navIconColor(studioView === 'notificaciones')}`} />
                    <span>Notificaciones</span>
                  </div>
                </button>
                <button
                  onClick={() => handleNavClick('audit-log')}
                  className={navItemClass(studioView === 'audit-log' || studioView === 'auditoria')}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className={`w-4 h-4 ${navIconColor(studioView === 'audit-log' || studioView === 'auditoria')}`} />
                    <span>Auditoría</span>
                  </div>
                </button>
                <button
                  onClick={() => handleNavClick('reportes')}
                  className={navItemClass(studioView === 'reportes')}
                >
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className={`w-4 h-4 ${navIconColor(studioView === 'reportes')}`} />
                    <span>Reportes</span>
                  </div>
                </button>
              </div>
            </div>

            {/* SYSTEM */}
            <div>
              <div className="px-3 mb-2 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                Sistema
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => handleNavClick('settings')}
                  className={navItemClass(studioView === 'settings' || studioView === 'configuracion')}
                >
                  <div className="flex items-center gap-2.5">
                    <Settings className={`w-4 h-4 ${navIconColor(studioView === 'settings' || studioView === 'configuracion')}`} />
                    <span>Configuración</span>
                  </div>
                </button>
                <button
                  onClick={() => handleNavClick('mantenimiento')}
                  className={navItemClass(studioView === 'mantenimiento')}
                >
                  <div className="flex items-center gap-2.5">
                    <Wrench className={`w-4 h-4 ${navIconColor(studioView === 'mantenimiento')}`} />
                    <span>Mantenimiento</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Experience Switcher & User Profile */}
          <div className="p-3 border-t border-[#E5E7EB] bg-[#F8F9FB] space-y-2">
            {/* Direct Switch to Client Mobile App */}
            <button
              onClick={() => setAppMode('client')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#FFF8DC] border border-[#F1DC91] text-[#8A6510] hover:bg-[#FFF2BF] text-xs font-medium transition-colors cursor-pointer"
              title="Abrir vista de anfitriones (Invifty App PWA)"
            >
              <div className="flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-[#C99B18]" />
                <span>Invifty App (Host PWA)</span>
              </div>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </button>

            {/* Starlin Profile Pill */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E5E7EB] shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative">
                  <Avatar name="Starlin Paulino" size="sm" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-900 truncate">Starlin Paulino</div>
                  <div className="text-[10px] text-slate-500 truncate">Lead Producer & Ops</div>
                </div>
              </div>
              <button
                onClick={() => setStudioView('login')}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FB]">
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-[#E5E7EB] bg-white px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          {/* Global Search Bar */}
          <div className="flex-1 max-w-xl">
            <button
              onClick={() => setIsGlobalSearchOpen(true)}
              className="w-full flex items-center justify-between bg-[#F8F9FA] hover:bg-[#F1F3F5] text-slate-500 hover:text-slate-700 border border-[#E5E7EB] hover:border-slate-300 px-3.5 py-2 rounded-lg text-xs transition-all duration-150 group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-[#D6AE36] transition-colors" />
                <span>Buscar cliente, evento, teléfono, ID...</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-500 shadow-xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Action Icons & Date */}
          <div className="flex items-center gap-4 ml-4">
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Oct 24, 2026</span>
            </div>

            {/* "+ Nuevo Evento" Gold CTA */}
            <button
              onClick={() => openEventWorkspace()}
              className="flex items-center gap-1.5 bg-[#D6AE36] hover:bg-[#C99B18] text-[#111827] font-semibold text-xs px-3.5 py-2 rounded-lg shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Nuevo Evento</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => handleNavClick('notificaciones')}
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EA580C]" />
            </button>

            {/* User Avatar Menu */}
            <div
              className="cursor-pointer"
              onClick={() => setStudioView('login')}
              title="Cuenta de Starlin"
            >
              <Avatar name="Starlin Paulino" size="sm" />
            </div>
          </div>
        </header>

        {/* Dynamic Page View Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
