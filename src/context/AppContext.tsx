import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppMode = 'studio' | 'client' | 'runtime';

export type StudioView =
  | 'dashboard'
  | 'leads'
  | 'lead-detail'
  | 'create-lead'
  | 'clients'
  | 'client-detail'
  | 'events'
  | 'event-workspace'
  | 'produccion'
  | 'revisiones'
  | 'revision-detail'
  | 'pagos'
  | 'pago-detail'
  | 'invitaciones'
  | 'invitacion-detail'
  | 'plantillas'
  | 'templates'
  | 'atelier-templates'
  | 'plantilla-nueva'
  | 'demos'
  | 'media'
  | 'equipo'
  | 'equipo-detail'
  | 'notificaciones'
  | 'auditoria'
  | 'audit-log'
  | 'reportes'
  | 'configuracion'
  | 'settings'
  | 'mantenimiento'
  | 'under-construction'
  | 'login'
  | 'recovery';

export type ClientView =
  | 'home'
  | 'event'
  | 'invitation'
  | 'guests'
  | 'guest-detail'
  | 'checkin'
  | 'mesas'
  | 'pagos'
  | 'mensajes'
  | 'more'
  | 'login'
  | 'recovery';

interface AppContextType {
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  studioView: StudioView;
  setStudioView: (view: StudioView) => void;
  clientView: ClientView;
  setClientView: (view: ClientView) => void;
  
  // Selection state
  selectedLeadId: string | null;
  setSelectedLeadId: (id: string | null) => void;
  selectedGuestId: string | null;
  setSelectedGuestId: (id: string | null) => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;
  selectedReviewId: string | null;
  setSelectedReviewId: (id: string | null) => void;
  selectedPaymentId: string | null;
  setSelectedPaymentId: (id: string | null) => void;
  selectedInvitationId: string | null;
  setSelectedInvitationId: (id: string | null) => void;
  selectedTemplateId: string | null;
  setSelectedTemplateId: (id: string | null) => void;
  selectedTeamMemberId: string | null;
  setSelectedTeamMemberId: (id: string | null) => void;
  
  // Global search modal
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;

  // Active module title for placeholder
  constructionModule: string;
  setConstructionModule: (title: string) => void;
  
  // Switch to specific screens with parameters
  openLeadDetail: (leadId: string) => void;
  openEventWorkspace: (eventId?: string) => void;
  openGuestDetail: (guestId: string) => void;
  openPublicInvitationRuntime: (slug?: string) => void;
  openReviewDetail: (reviewId: string) => void;
  openPaymentDetail: (paymentId: string) => void;
  openInvitationDetail: (invitationId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appMode, setAppMode] = useState<AppMode>('studio');
  const [studioView, setStudioView] = useState<StudioView>('dashboard');
  const [clientView, setClientView] = useState<ClientView>('home');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>('lead-1');
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>('gst-1');
  const [selectedClientId, setSelectedClientId] = useState<string | null>('cli-1');
  const [selectedEventId, setSelectedEventId] = useState<string | null>('ev-maria-carlos');
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>('rev-1');
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>('pay-1');
  const [selectedInvitationId, setSelectedInvitationId] = useState<string | null>('inv-1');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>('tpl-1');
  const [selectedTeamMemberId, setSelectedTeamMemberId] = useState<string | null>('usr-1');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [constructionModule, setConstructionModule] = useState('Módulo en construcción');

  // Keyboard shortcut listener for Command+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openLeadDetail = (leadId: string) => {
    setSelectedLeadId(leadId);
    setStudioView('lead-detail');
  };

  const openEventWorkspace = (eventId?: string) => {
    if (eventId) setSelectedEventId(eventId);
    setStudioView('event-workspace');
  };

  const openGuestDetail = (guestId: string) => {
    setSelectedGuestId(guestId);
    setClientView('guest-detail');
  };

  const openPublicInvitationRuntime = (_slug?: string) => {
    setAppMode('runtime');
  };

  const openReviewDetail = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setStudioView('revision-detail');
  };

  const openPaymentDetail = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setStudioView('pago-detail');
  };

  const openInvitationDetail = (invitationId: string) => {
    setSelectedInvitationId(invitationId);
    setStudioView('invitacion-detail');
  };

  return (
    <AppContext.Provider
      value={{
        appMode,
        setAppMode,
        studioView,
        setStudioView,
        clientView,
        setClientView,
        selectedLeadId,
        setSelectedLeadId,
        selectedGuestId,
        setSelectedGuestId,
        selectedClientId,
        setSelectedClientId,
        selectedEventId,
        setSelectedEventId,
        selectedReviewId,
        setSelectedReviewId,
        selectedPaymentId,
        setSelectedPaymentId,
        selectedInvitationId,
        setSelectedInvitationId,
        selectedTemplateId,
        setSelectedTemplateId,
        selectedTeamMemberId,
        setSelectedTeamMemberId,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
        constructionModule,
        setConstructionModule,
        openLeadDetail,
        openEventWorkspace,
        openGuestDetail,
        openPublicInvitationRuntime,
        openReviewDetail,
        openPaymentDetail,
        openInvitationDetail,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
