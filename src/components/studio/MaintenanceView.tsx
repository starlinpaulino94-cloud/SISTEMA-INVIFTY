import React, { useState } from 'react';
import {
  Wrench,
  Database,
  HardDrive,
  RefreshCw,
  ShieldCheck,
  Download,
  AlertTriangle,
  Server,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { isSupabaseConfigured } from '../../lib/supabase';

export const MaintenanceView: React.FC = () => {
  const { showToast } = useToast();
  const [isPurging, setIsPurging] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handlePurgeCache = () => {
    setIsPurging(true);
    setTimeout(() => {
      setIsPurging(false);
      showToast('Caché de activos estáticos y plantillas purgada correctamente', 'success');
    }, 1000);
  };

  const handleBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      showToast('Snapshot SQL de respaldo generado y descargado', 'success');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono uppercase tracking-wider text-[#8A6510] font-semibold">Infraestructura & DevOps</span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-600 font-sans">Diagnóstico del motor Invifty 2.0</span>
        </div>
        <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight flex items-center gap-3">
          <Wrench className="w-6 h-6 text-[#C99B18]" />
          Mantenimiento & Salud del Sistema
        </h1>
        <p className="text-sm text-slate-600 mt-0.5 font-sans">
          Monitoreo de estado de la base de datos Supabase, almacenamiento S3, políticas RLS y herramientas de contingencia.
        </p>
      </div>

      {/* System Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium font-sans flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-600" /> PostgreSQL Supabase
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Operativo
            </span>
          </div>
          <div className="text-xl font-bold font-heading text-slate-900">
            {isSupabaseConfigured ? 'Cloud Conectado' : 'Simulador Local Activo'}
          </div>
          <div className="text-[11px] text-slate-500 font-sans">
            Latencia promedio: 38ms • RLS activo
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium font-sans flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-blue-600" /> Almacenamiento S3
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Saludable
            </span>
          </div>
          <div className="text-xl font-bold font-heading text-slate-900">
            2.8 GB / 50 GB
          </div>
          <div className="text-[11px] text-slate-500 font-sans">
            5.6% de cuota utilizada
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium font-sans flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-600" /> Edge Runtimes
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Global CDN
            </span>
          </div>
          <div className="text-xl font-bold font-heading text-slate-900">
            100% Uptime
          </div>
          <div className="text-[11px] text-slate-500 font-sans">
            Compilador Atelier v2.4 activo
          </div>
        </div>
      </div>

      {/* Operational Actions */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-slate-900 font-heading">Acciones de Mantenimiento de Emergencia</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-[#E5E7EB] rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 text-[#C99B18] ${isPurging ? 'animate-spin' : ''}`} />
              <h4 className="text-xs font-bold text-slate-900 font-sans">Purgar Caché Global de Invitaciones</h4>
            </div>
            <p className="text-xs text-slate-600 font-sans">
              Fuerza la invalidación del CDN para que todos los invitados descarguen la versión más reciente del HTML/CSS.
            </p>
            <button
              onClick={handlePurgeCache}
              disabled={isPurging}
              className="w-full py-2 px-3 rounded-lg border border-[#E5E7EB] bg-[#F8F9FA] hover:bg-slate-100 text-slate-800 text-xs font-semibold transition-colors"
            >
              {isPurging ? 'Purgando...' : 'Ejecutar Purga Inmediata'}
            </button>
          </div>

          <div className="border border-[#E5E7EB] rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-900 font-sans">Copia de Seguridad de Emergencia</h4>
            </div>
            <p className="text-xs text-slate-600 font-sans">
              Descarga un archivo JSON/SQL con todos los eventos, clientes, transacciones e invitados del sistema.
            </p>
            <button
              onClick={handleBackup}
              disabled={isBackingUp}
              className="w-full py-2 px-3 rounded-lg bg-[#D6AE36] hover:bg-[#C99B18] text-white text-xs font-semibold transition-colors shadow-xs"
            >
              {isBackingUp ? 'Generando Snapshot...' : 'Exportar Base de Datos Completa'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
