import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { clientsService } from '../../services/clientsService';
import { Client } from '../../types';
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Calendar,
  Building,
  DollarSign
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Avatar } from '../ui/Avatar';

export const ClientsView: React.FC = () => {
  const { setStudioView, setSelectedEventId } = useApp();
  const { addToast } = useToast();

  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const data = await clientsService.getClients();
    setClients(data);
  };

  const filteredClients = clients.filter((c) => {
    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'active' && c.status === 'activo') ||
      (filterStatus === 'completed' && c.status === 'completado');

    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.eventName && c.eventName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const handleOpenEvent = (eventId?: string) => {
    if (!eventId) {
      addToast('Este cliente no tiene una producción activa vinculada.', 'info');
      return;
    }
    setSelectedEventId(eventId);
    setStudioView('event-workspace');
    addToast('Espacio de trabajo del cliente abierto', 'success');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8A6510] font-semibold">Directorio de Clientes VIP</span>
            <span className="text-xs text-slate-400">• Novios, Familias y Comités de Gala</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 tracking-tight">
            Cartera de Anfitriones & Clientes
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Registro unificado de anfitriones, historial de facturación, accesos al portal de novios y producciones asociadas.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="default">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-500 font-medium">Total Anfitriones</span>
            <span className="p-2 rounded-lg bg-[#FFF8DC] text-[#C99B18]">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-heading font-bold text-slate-900">86</span>
            <span className="text-xs text-[#16A34A] font-medium">+12 este trimestre</span>
          </div>
        </Card>

        <Card variant="default">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-500 font-medium">Producciones Activas</span>
            <span className="p-2 rounded-lg bg-[#F0FDF4] text-[#16A34A]">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-heading font-bold text-[#16A34A]">14</span>
            <span className="text-xs text-slate-500">en ejecución simultánea</span>
          </div>
        </Card>

        <Card variant="default">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-500 font-medium">Facturación Acumulada</span>
            <span className="p-2 rounded-lg bg-[#FFF8DC] text-[#C99B18]">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-heading font-bold text-slate-900">$342,000</span>
            <span className="text-xs text-slate-500 font-mono">USD</span>
          </div>
        </Card>

        <Card variant="default">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-500 font-medium">Tasa de Fidelidad</span>
            <span className="p-2 rounded-lg bg-[#FFF7ED] text-[#EA580C]">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-heading font-bold text-slate-900">92%</span>
            <span className="text-xs text-[#8A6510]">Recomendación directa</span>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-[#FFF8DC] text-[#8A6510] font-semibold border border-[#F1DC91] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#F6F7F9]'
            }`}
          >
            Todos ({clients.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filterStatus === 'active'
                ? 'bg-[#FFF8DC] text-[#8A6510] font-semibold border border-[#F1DC91] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#F6F7F9]'
            }`}
          >
            Activos con Evento
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filterStatus === 'completed'
                ? 'bg-[#FFF8DC] text-[#8A6510] font-semibold border border-[#F1DC91] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#F6F7F9]'
            }`}
          >
            Históricos
          </button>
        </div>

        <div className="w-full md:w-80">
          <Input
            placeholder="Buscar por cliente, evento o correo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="border border-[#E5E7EB] rounded-xl bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-[#F8F9FA] text-xs font-mono uppercase tracking-wider text-slate-500 border-b border-[#E5E7EB]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Anfitrión / Titular</th>
                <th className="py-3.5 px-4 font-semibold">Contacto VIP</th>
                <th className="py-3.5 px-4 font-semibold">Evento Asociado</th>
                <th className="py-3.5 px-4 font-semibold">Estado</th>
                <th className="py-3.5 px-4 font-semibold">Inversión Plan</th>
                <th className="py-3.5 px-4 text-right font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-[#F8F9FB] transition-colors cursor-pointer"
                  onClick={() => handleOpenEvent(client.eventId)}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={client.name} size="md" />
                      <div>
                        <div className="font-semibold text-slate-900 hover:text-[#8A6510] transition-colors">
                          {client.name}
                        </div>
                        <div className="text-xs text-slate-500">{client.title}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-[#C99B18]" />
                      <span>{client.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                      <Phone className="w-3.5 h-3.5 text-[#16A34A]" />
                      <span>{client.phone}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    {client.eventName ? (
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{client.eventName}</div>
                        <div className="text-xs text-[#8A6510] font-mono">{client.eventSlug}</div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Sin evento activo</span>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    <Badge variant={client.status === 'activo' ? 'emerald' : 'slate'} dot={client.status === 'activo'}>
                      {(client.status || 'activo').toUpperCase()}
                    </Badge>
                  </td>

                  <td className="py-4 px-4 text-xs">
                    <div className="font-mono font-semibold text-slate-900">{client.totalSpent}</div>
                    <div className="text-[11px] text-[#16A34A] font-medium">Saldo: {client.paymentStatus}</div>
                  </td>

                  <td className="py-4 px-4 text-right">
                    {client.eventId ? (
                      <Button
                        variant="gold-outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEvent(client.eventId);
                        }}
                        rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                      >
                        Abrir Espacio
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToast('Enviando recordatorio de bienvenida', 'info');
                        }}
                      >
                        Contactar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
