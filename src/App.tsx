import React from 'react';
import { ToastProvider } from './context/ToastContext';
import { AppProvider, useApp } from './context/AppContext';
import { StudioLayout } from './components/studio/StudioLayout';
import { DashboardView } from './components/studio/DashboardView';
import { LeadsView } from './components/studio/LeadsView';
import { ClientsView } from './components/studio/ClientsView';
import { EventsView } from './components/studio/EventsView';
import { EventWorkspaceView } from './components/studio/EventWorkspaceView';
import { AtelierTemplatesView } from './components/studio/AtelierTemplatesView';
import { AuditLogView } from './components/studio/AuditLogView';
import { SettingsView } from './components/studio/SettingsView';
import { ProductionView } from './components/studio/ProductionView';
import { ReviewsView } from './components/studio/ReviewsView';
import { PaymentsView } from './components/studio/PaymentsView';
import { InvitationsView } from './components/studio/InvitationsView';
import { DemosView } from './components/studio/DemosView';
import { MediaLibraryView } from './components/studio/MediaLibraryView';
import { TeamView } from './components/studio/TeamView';
import { NotificationsView } from './components/studio/NotificationsView';
import { ReportsView } from './components/studio/ReportsView';
import { MaintenanceView } from './components/studio/MaintenanceView';
import { ClientPortal } from './components/client/ClientPortal';
import { InvitationRuntime } from './components/runtime/InvitationRuntime';

const MainAppContent: React.FC = () => {
  const { appMode, studioView } = useApp();

  if (appMode === 'client') {
    return <ClientPortal />;
  }

  if (appMode === 'runtime') {
    return <InvitationRuntime />;
  }

  // Studio Mode
  return (
    <StudioLayout>
      {studioView === 'dashboard' && <DashboardView />}
      {(studioView === 'leads' || studioView === 'lead-detail' || studioView === 'create-lead') && (
        <LeadsView />
      )}
      {(studioView === 'clients' || studioView === 'client-detail') && <ClientsView />}
      {studioView === 'events' && <EventsView />}
      {studioView === 'event-workspace' && <EventWorkspaceView />}
      {studioView === 'produccion' && <ProductionView />}
      {(studioView === 'revisiones' || studioView === 'revision-detail') && <ReviewsView />}
      {(studioView === 'pagos' || studioView === 'pago-detail') && <PaymentsView />}
      {(studioView === 'invitaciones' || studioView === 'invitacion-detail') && <InvitationsView />}
      {(studioView === 'atelier-templates' || studioView === 'templates' || studioView === 'plantillas') && (
        <AtelierTemplatesView />
      )}
      {studioView === 'demos' && <DemosView />}
      {studioView === 'media' && <MediaLibraryView />}
      {(studioView === 'equipo' || studioView === 'equipo-detail') && <TeamView />}
      {studioView === 'notificaciones' && <NotificationsView />}
      {(studioView === 'audit-log' || studioView === 'auditoria') && <AuditLogView />}
      {studioView === 'reportes' && <ReportsView />}
      {(studioView === 'settings' || studioView === 'configuracion') && <SettingsView />}
      {studioView === 'mantenimiento' && <MaintenanceView />}
    </StudioLayout>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </ToastProvider>
  );
}
