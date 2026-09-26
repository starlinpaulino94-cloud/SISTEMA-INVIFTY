import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { demosService } from '../../services/demosService';
import { DemoItem } from '../../types';
import {
  Eye,
  Search,
  Sparkles,
  ExternalLink,
  Copy,
  Plus,
  Play,
  Heart,
  Tag,
  Monitor,
  Smartphone
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const DemosView: React.FC = () => {
  const { openPublicInvitationRuntime, setStudioView } = useApp();
  const { showToast } = useToast();
  const [demos, setDemos] = useState<DemoItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadDemos();
  }, [selectedCategory, search]);

  const loadDemos = async () => {
    const data = await demosService.getDemos({
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      search: search || undefined
    });
    setDemos(data);
  };

  const copyDemoLink = (demo: DemoItem) => {
    const url = `${window.location.origin}/demo/${demo.slug}`;
    navigator.clipboard.writeText(url);
    showToast('Enlace del demo copiado al portapapeles', 'info');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8A6510] font-semibold">Showcase & Ventas</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-600 font-sans">{demos.length} demos de alta conversión</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight flex items-center gap-3">
            <Eye className="w-6 h-6 text-[#C99B18]" />
            Demos de Atelier para Clientes
          </h1>
          <p className="text-sm text-slate-600 mt-0.5 font-sans">
            Muestrarios comerciales listos para compartir con prospectos durante llamadas de venta o cotizaciones.
          </p>
        </div>

        <button
          onClick={() => setStudioView('leads')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFF8DC] hover:bg-[#F8EAA3] text-[#8A6510] border border-[#F1DC91] font-semibold text-xs shadow-xs transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#C99B18]" />
          Vincular a un Lead
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {['all', 'Bodas de Gala', 'Minimalista', 'XV Años', 'Corporativo'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#D6AE36] text-white font-semibold shadow-xs'
                  : 'bg-white text-slate-600 border border-[#E5E7EB] hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'Todos los Demos' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] px-3 py-1.5 rounded-xl shadow-xs min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar demostraciones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs text-slate-900 placeholder:text-slate-400 bg-transparent border-none outline-none font-sans"
          />
        </div>
      </div>

      {/* Demos Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demos.map(demo => (
          <div
            key={demo.id}
            className="bg-white border border-[#E5E7EB] hover:border-[#D6AE36] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
          >
            <div>
              {/* Thumbnail Container */}
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={demo.thumbnailUrl}
                  alt={demo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-between p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-300 font-semibold border border-amber-400/30">
                      {demo.category}
                    </span>
                    <span className="text-[10px] text-white/90 font-sans flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full">
                      <Eye className="w-3 h-3 text-amber-400" /> {demo.views.toLocaleString()} vistas
                    </span>
                  </div>

                  <div className="text-white">
                    <span className="text-[10px] text-amber-200 font-mono">Basado en: {demo.templateName}</span>
                    <h3 className="text-sm font-bold font-heading line-clamp-1">{demo.title}</h3>
                  </div>
                </div>
              </div>

              {/* Demo Meta */}
              <div className="p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="flex items-center gap-1 font-sans">
                    <Monitor className="w-3.5 h-3.5 text-slate-400" /> Adaptable Desktop & Móvil
                  </span>
                  <span className="text-[10px] font-mono text-[#8A6510] bg-[#FFF8DC] px-2 py-0.5 rounded border border-[#F1DC91] font-semibold">
                    /{demo.slug}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-2">
              <button
                onClick={() => openPublicInvitationRuntime(demo.slug)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#D6AE36] hover:bg-[#C99B18] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <Play className="w-3.5 h-3.5" /> Explorar Demo
              </button>
              <button
                onClick={() => copyDemoLink(demo)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                title="Copiar enlace comercial"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
