import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { getAuditRecords } from '../../lib/audit';
import { AuditRecord } from '../../types';
import {
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Clock,
  User,
  CheckCircle,
  FileText
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';

export const AuditLogView: React.FC = () => {
  const { addToast } = useToast();
  const [logs, setLogs] = useState<AuditRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const records = await getAuditRecords();
    setLogs(records);
  };

  const handleRefresh = async () => {
    await loadLogs();
    addToast('Registro de auditoría sincronizado', 'info');
  };

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.entityType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8A6510] font-semibold">Seguridad & Cumplimiento</span>
            <span className="text-xs text-slate-400">• Inmutabilidad Operativa</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 tracking-tight">
            Pista de Auditoría & Trazabilidad
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Registro cronológico inmutable de todas las mutaciones sobre leads, clientes, RSVP y credenciales de acceso.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          leftIcon={<RefreshCw className="w-4 h-4" />}
          onClick={handleRefresh}
        >
          Actualizar Pista
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-xs">
        <div className="w-full md:w-96">
          <Input
            placeholder="Filtrar por acción, actor o entidad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
        <div className="text-xs text-slate-500 font-mono">
          {filteredLogs.length} eventos registrados
        </div>
      </div>

      {/* Logs Table */}
      <div className="border border-[#E5E7EB] rounded-xl bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-[#F8F9FA] text-xs font-mono uppercase tracking-wider text-slate-500 border-b border-[#E5E7EB]">
              <tr>
                <th className="py-3 px-4 font-semibold">Fecha & Hora</th>
                <th className="py-3 px-4 font-semibold">Actor</th>
                <th className="py-3 px-4 font-semibold">Acción Realizada</th>
                <th className="py-3 px-4 font-semibold">Entidad</th>
                <th className="py-3 px-4 font-semibold">Metadatos Seguros</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-xs">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F8F9FB] transition-colors">
                  <td className="py-3.5 px-4 text-slate-500 font-sans">
                    {new Date(log.createdAt).toLocaleString('es-DO', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </td>

                  <td className="py-3.5 px-4 font-sans">
                    <span className="text-slate-900 font-semibold">{log.actorName}</span>
                    <span className="text-slate-400 block text-[11px]">{log.actorRole}</span>
                  </td>

                  <td className="py-3.5 px-4 font-sans">
                    <span className="text-[#8A6510] font-semibold">{log.action}</span>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#F8F9FA] border border-[#E5E7EB] text-slate-700 text-[11px]">
                      {log.entityType} ({log.entityId.slice(0, 12)})
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {log.metadata ? (
                      <span className="text-[11px] text-slate-500">
                        {JSON.stringify(log.metadata).slice(0, 45)}...
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
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
