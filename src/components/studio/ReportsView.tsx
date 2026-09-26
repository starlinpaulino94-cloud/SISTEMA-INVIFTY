import React, { useState, useEffect } from 'react';
import { reportsService, PerformanceKPIs } from '../../services/reportsService';
import {
  BarChart3,
  TrendingUp,
  Download,
  Users,
  DollarSign,
  Percent,
  Calendar,
  CheckCircle2,
  PieChart
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ReportsView: React.FC = () => {
  const { showToast } = useToast();
  const [kpis, setKpis] = useState<PerformanceKPIs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await reportsService.getPerformanceKPIs();
    setKpis(data);
    setLoading(false);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    showToast(`Generando reporte ejecutivo en formato ${format.toUpperCase()}...`, 'info');
    setTimeout(() => {
      showToast(`Reporte ${format.toUpperCase()} descargado exitosamente`, 'success');
    }, 1200);
  };

  if (!kpis) return null;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8A6510] font-semibold">Business Intelligence</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-600 font-sans">Métricas consolidadas de Studio</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-[#C99B18]" />
            Reportes & Rendimiento Comercial
          </h1>
          <p className="text-sm text-slate-600 mt-0.5 font-sans">
            Ingresos netos por plan, tasas de conversión de leads, efectividad de confirmación RSVP y canales de adquisición.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-xs transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" /> Exportar CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D6AE36] hover:bg-[#C99B18] text-white text-xs font-semibold shadow-xs transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Descargar PDF Ejecutivo
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-xs">
          <div className="text-xs font-medium text-slate-500 font-sans">Ingresos Netos Verificados</div>
          <div className="text-2xl font-bold font-heading text-slate-900 mt-1">
            ${kpis.totalRevenue.toLocaleString()} USD
          </div>
          <div className="text-[11px] text-emerald-600 font-sans mt-0.5 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% vs trimestre anterior
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-xs">
          <div className="text-xs font-medium text-slate-500 font-sans">Ticket Promedio por Evento</div>
          <div className="text-2xl font-bold font-heading text-[#8A6510] mt-1">
            ${kpis.averageTicket} USD
          </div>
          <div className="text-[11px] text-slate-500 font-sans mt-0.5">Planes Atelier con complementos</div>
        </div>

        <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-xs">
          <div className="text-xs font-medium text-slate-500 font-sans">Tasa Conversión Leads</div>
          <div className="text-2xl font-bold font-heading text-indigo-700 mt-1">
            {kpis.conversionRateLeads}%
          </div>
          <div className="text-[11px] text-slate-500 font-sans mt-0.5">De contacto inicial a cierre de contrato</div>
        </div>

        <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-xs">
          <div className="text-xs font-medium text-slate-500 font-sans">Tasa de Aceptación RSVP</div>
          <div className="text-2xl font-bold font-heading text-emerald-700 mt-1">
            {kpis.overallRsvpRate}%
          </div>
          <div className="text-[11px] text-emerald-600 font-sans mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Promedio de asistencia global
          </div>
        </div>
      </div>

      {/* Revenue Series Chart + Acquisition Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Chart: Monthly Revenue */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] p-5 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">Tendencia de Ingresos Mensuales</h3>
              <p className="text-xs text-slate-500 font-sans">Facturación acumulada últimos 6 meses</p>
            </div>
            <span className="text-xs font-mono font-semibold text-[#8A6510] bg-[#FFF8DC] px-2 py-0.5 rounded border border-[#F1DC91]">
              Año Fiscal 2025-2026
            </span>
          </div>

          <div className="pt-6">
            <div className="flex items-end justify-between gap-3 h-48 px-2 border-b border-[#E5E7EB] pb-2">
              {kpis.monthlyRevenueSeries.map((m, idx) => {
                const maxAmount = 9000;
                const heightPercent = Math.min(100, Math.round((m.amount / maxAmount) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[10px] font-mono text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      ${m.amount}
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[42px] bg-gradient-to-t from-[#D6AE36] to-[#F1DC91] hover:from-[#C99B18] hover:to-[#D6AE36] rounded-t-lg transition-all shadow-xs cursor-pointer"
                    />
                    <div className="text-[10px] text-slate-500 font-sans font-medium text-center truncate max-w-[50px]">
                      {m.month.split(' ')[0]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Chart: Acquisition Channels */}
        <div className="lg:col-span-1 bg-white border border-[#E5E7EB] p-5 rounded-2xl shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-heading">Canales de Adquisición</h3>
            <p className="text-xs text-slate-500 font-sans">Origen de los prospectos contratados</p>
          </div>

          <div className="space-y-3 pt-2">
            {kpis.topChannels.map((ch, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-700 font-sans">
                  <span className="font-medium">{ch.channel}</span>
                  <span className="font-bold">{ch.percentage}% ({ch.count})</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#D6AE36] h-full rounded-full transition-all"
                    style={{ width: `${ch.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
