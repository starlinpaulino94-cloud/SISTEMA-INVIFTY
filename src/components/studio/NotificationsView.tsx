import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { notificationsService } from '../../services/notificationsService';
import { NotificationItem, NotificationCategory } from '../../types';
import {
  Bell,
  CheckCheck,
  CheckCircle,
  Clock,
  ExternalLink,
  MessageSquare,
  CreditCard,
  Users,
  AlertCircle,
  Layers,
  ShieldAlert
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const NotificationsView: React.FC = () => {
  const { openEventWorkspace, setStudioView } = useApp();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadNotifications();
  }, [selectedCategory]);

  const loadNotifications = async () => {
    const data = await notificationsService.getNotifications(
      selectedCategory !== 'all' ? (selectedCategory as NotificationCategory) : undefined
    );
    setNotifications(data);
  };

  const handleMarkAsRead = async (id: string) => {
    await notificationsService.markAsRead(id);
    await loadNotifications();
  };

  const handleMarkAllRead = async () => {
    await notificationsService.markAllAsRead();
    showToast('Todas las notificaciones marcadas como leídas', 'info');
    await loadNotifications();
  };

  const getCategoryIcon = (cat: NotificationCategory) => {
    switch (cat) {
      case 'reviews':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'payments':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'guests':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'leads':
        return <Layers className="w-4 h-4 text-amber-600" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8A6510] font-semibold">Feed en Tiempo Real</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-600 font-sans">{notifications.filter(n => !n.isRead).length} sin leer</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight flex items-center gap-3">
            <Bell className="w-6 h-6 text-[#C99B18]" />
            Centro de Notificaciones & Eventos
          </h1>
          <p className="text-sm text-slate-600 mt-0.5 font-sans">
            Alertas de revisiones de clientes, confirmaciones RSVP, comprobantes de pago y auditoría.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-xs transition-all"
        >
          <CheckCheck className="w-4 h-4 text-slate-500" />
          Marcar todas como leídas
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'Todas' },
          { key: 'reviews', label: 'Revisiones' },
          { key: 'payments', label: 'Pagos' },
          { key: 'guests', label: 'Invitados & RSVP' },
          { key: 'leads', label: 'Leads' },
          { key: 'system', label: 'Sistema' }
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedCategory === cat.key
                ? 'bg-[#FFF8DC] text-[#8A6510] font-semibold border border-[#F1DC91]'
                : 'bg-white text-slate-600 border border-[#E5E7EB] hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map(n => (
          <div
            key={n.id}
            onClick={() => handleMarkAsRead(n.id)}
            className={`p-4 rounded-xl border transition-all cursor-pointer bg-white flex items-start gap-3.5 ${
              !n.isRead
                ? 'border-[#D6AE36] bg-amber-50/20 shadow-xs'
                : 'border-[#E5E7EB] hover:border-slate-300 opacity-80'
            }`}
          >
            <div className="p-2 rounded-lg bg-slate-100 shrink-0 mt-0.5">
              {getCategoryIcon(n.category)}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900 font-sans flex items-center gap-2">
                  {n.title}
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#D6AE36]" />
                  )}
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-sans">{n.message}</p>

              {n.eventId && (
                <div className="pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEventWorkspace(n.eventId);
                    }}
                    className="text-[11px] font-semibold text-[#8A6510] hover:text-[#5B4104] flex items-center gap-1 font-sans"
                  >
                    Ver evento asociado <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
