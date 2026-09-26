import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { productionService } from '../../services/productionService';
import { ProductionItem, ProductionStage } from '../../types';
import {
  Layers,
  Search,
  Filter,
  ArrowRight,
  Clock,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Calendar,
  User,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
  Kanban,
  ListFilter
} from 'lucide-react';

const STAGES: { key: ProductionStage; label: string; color: string; bg: string; border: string }[] = [
  { key: 'pendiente_info', label: 'Pendiente Info', color: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-200' },
  { key: 'info_recibida', label: 'Info Recibida', color: 'text-blue-800', bg: 'bg-blue-50', border: 'border-blue-200' },
  { key: 'disenando', label: 'En Diseño', color: 'text-purple-800', bg: 'bg-purple-50', border: 'border-purple-200' },
  { key: 'revision_interna', label: 'Revisión Interna', color: 'text-indigo-800', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { key: 'revision_cliente', label: 'Revisión Cliente', color: 'text-amber-900', bg: 'bg-[#FFF8DC]', border: 'border-[#F1DC91]' },
  { key: 'cambios_solicitados', label: 'Cambios Pedidos', color: 'text-rose-800', bg: 'bg-rose-50', border: 'border-rose-200' },
  { key: 'aprobada', label: 'Aprobada', color: 'text-emerald-800', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { key: 'lista_publicar', label: 'Lista Publicar', color: 'text-teal-800', bg: 'bg-teal-50', border: 'border-teal-200' },
  { key: 'completada', label: 'Completada', color: 'text-slate-800', bg: 'bg-slate-100', border: 'border-slate-200' }
];

export const ProductionView: React.FC = () => {
  const { openEventWorkspace, setStudioView, setSelectedReviewId } = useApp();
  const [items, setItems] = useState<ProductionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  useEffect(() => {
    loadData();
  }, [selectedStage, selectedPriority, search]);

  const loadData = async () => {
    setLoading(true);
    const data = await productionService.getItems({
      stage: selectedStage !== 'all' ? (selectedStage as ProductionStage) : undefined,
      priority: selectedPriority !== 'all' ? selectedPriority : undefined,
      search: search || undefined
    });
    setItems(data);
    setLoading(false);
  };

  const handleAdvanceStage = async (id: string, currentStage: ProductionStage) => {
    const currentIndex = STAGES.findIndex(s => s.key === currentStage);
    if (currentIndex < STAGES.length - 1) {
      const nextStage = STAGES[currentIndex + 1].key;
      await productionService.advanceStage(id, nextStage);
      await loadData();
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgente':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">Urgente</span>;
      case 'alta':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Alta</span>;
      case 'normal':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Normal</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">Baja</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8A6510] font-semibold">Operaciones & Entrega</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-600 font-sans">{items.length} proyectos en flujo</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight flex items-center gap-3">
            <Layers className="w-6 h-6 text-[#C99B18]" />
            Pipeline de Producción
          </h1>
          <p className="text-sm text-slate-600 mt-0.5 font-sans">
            Control de ciclos de vida: recolección de contenido, diseño Atelier, iteraciones de clientes y publicación.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] p-1 rounded-xl shadow-xs">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'kanban' ? 'bg-[#FFF8DC] text-[#8A6510] font-semibold border border-[#F1DC91]' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            Tablero Kanban
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'list' ? 'bg-[#FFF8DC] text-[#8A6510] font-semibold border border-[#F1DC91]' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            Lista Detallada
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-xs">
          <div className="text-xs font-medium text-slate-500 font-sans">En Diseño Activo</div>
          <div className="text-2xl font-bold font-heading text-slate-900 mt-1">
            {items.filter(i => i.stage === 'disenando').length}
          </div>
          <div className="text-[11px] text-purple-700 font-sans mt-0.5 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Promedio 3.2 días en mesa
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-xs">
          <div className="text-xs font-medium text-slate-500 font-sans">En Revisión de Cliente</div>
          <div className="text-2xl font-bold font-heading text-amber-700 mt-1">
            {items.filter(i => i.stage === 'revision_cliente').length}
          </div>
          <div className="text-[11px] text-slate-500 font-sans mt-0.5">Esperando aprobación</div>
        </div>
        <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-xs">
          <div className="text-xs font-medium text-slate-500 font-sans">Cambios Solicitados</div>
          <div className="text-2xl font-bold font-heading text-rose-700 mt-1">
            {items.filter(i => i.stage === 'cambios_solicitados').length}
          </div>
          <div className="text-[11px] text-rose-600 font-sans mt-0.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Requieren atención de diseñador
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-xs">
          <div className="text-xs font-medium text-slate-500 font-sans">Aprobadas / Por Publicar</div>
          <div className="text-2xl font-bold font-heading text-emerald-700 mt-1">
            {items.filter(i => i.stage === 'aprobada' || i.stage === 'lista_publicar').length}
          </div>
          <div className="text-[11px] text-emerald-600 font-sans mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Listas para lanzamiento
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E5E7EB] p-3 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por evento, cliente o responsable..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs text-slate-900 placeholder:text-slate-400 bg-transparent border-none outline-none font-sans"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="text-xs bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-2.5 py-1 text-slate-700 font-sans"
            >
              <option value="all">Todas las etapas</option>
              {STAGES.map(s => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="text-xs bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-2.5 py-1 text-slate-700 font-sans"
            >
              <option value="all">Todas las prioridades</option>
              <option value="urgente">Urgente</option>
              <option value="alta">Alta</option>
              <option value="normal">Normal</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Kanban Content */}
      {viewMode === 'kanban' ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1280px]">
            {STAGES.map(stage => {
              const stageItems = items.filter(i => i.stage === stage.key);
              return (
                <div
                  key={stage.key}
                  className="flex-1 min-w-[270px] bg-[#F6F7F9] border border-[#E5E7EB] rounded-2xl flex flex-col max-h-[750px]"
                >
                  {/* Column Header */}
                  <div className={`p-3.5 border-b ${stage.border} ${stage.bg} rounded-t-2xl flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold font-sans ${stage.color}`}>{stage.label}</span>
                      <span className="w-5 h-5 rounded-full bg-white text-slate-700 text-[11px] font-bold flex items-center justify-center shadow-2xs">
                        {stageItems.length}
                      </span>
                    </div>
                  </div>

                  {/* Cards Scroll Area */}
                  <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                    {stageItems.map(item => (
                      <div
                        key={item.id}
                        className="bg-white border border-[#E5E7EB] hover:border-[#D6AE36] p-3.5 rounded-xl shadow-xs hover:shadow-sm transition-all duration-150 space-y-3 cursor-pointer group"
                        onClick={() => openEventWorkspace(item.eventId)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                            {item.plan} • {item.version}
                          </span>
                          {getPriorityBadge(item.priority)}
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#8A6510] transition-colors line-clamp-1 font-heading">
                            {item.eventName}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-sans mt-0.5 line-clamp-1">
                            {item.clientName}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1 font-sans">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {item.daysInStage}d en etapa
                          </span>
                          {item.unresolvedComments > 0 && (
                            <span className="flex items-center gap-1 text-rose-600 font-semibold font-sans">
                              <MessageSquare className="w-3 h-3" />
                              {item.unresolvedComments} comentarios
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                          <span className="flex items-center gap-1 font-sans truncate max-w-[140px]">
                            <User className="w-3 h-3 text-slate-400" />
                            {item.assignedTo}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdvanceStage(item.id, item.stage);
                            }}
                            title="Avanzar a la siguiente etapa"
                            className="p-1 rounded-md text-slate-400 hover:text-[#8A6510] hover:bg-[#FFF8DC] transition-colors"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {stageItems.length === 0 && (
                      <div className="py-8 text-center text-xs text-slate-400 font-sans border border-dashed border-[#E5E7EB] rounded-xl bg-white/50">
                        Sin proyectos aquí
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Detailed List View */
        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F8F9FA] text-slate-600 font-medium">
                <th className="py-3 px-4">Evento & Cliente</th>
                <th className="py-3 px-4">Plan & Versión</th>
                <th className="py-3 px-4">Etapa Actual</th>
                <th className="py-3 px-4">Prioridad</th>
                <th className="py-3 px-4">Días en Etapa</th>
                <th className="py-3 px-4">Responsable</th>
                <th className="py-3 px-4">Comentarios</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {items.map(item => {
                const stageMeta = STAGES.find(s => s.key === item.stage);
                return (
                  <tr
                    key={item.id}
                    onClick={() => openEventWorkspace(item.eventId)}
                    className="hover:bg-[#F9FAFB] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 font-heading">{item.eventName}</div>
                      <div className="text-[11px] text-slate-500 font-sans">{item.clientName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-slate-700">{item.plan}</span>
                      <div className="text-[10px] text-slate-400 font-mono">{item.version}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${stageMeta?.bg} ${stageMeta?.color} ${stageMeta?.border}`}>
                        {stageMeta?.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">{getPriorityBadge(item.priority)}</td>
                    <td className="py-3 px-4 font-sans text-slate-600">{item.daysInStage} días</td>
                    <td className="py-3 px-4 font-sans text-slate-700">{item.assignedTo}</td>
                    <td className="py-3 px-4">
                      {item.unresolvedComments > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                          {item.unresolvedComments} pendientes
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openEventWorkspace(item.eventId)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#FFF8DC] text-[#8A6510] hover:bg-[#F8EAA3] border border-[#F1DC91] transition-all"
                      >
                        Abrir Workspace
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
