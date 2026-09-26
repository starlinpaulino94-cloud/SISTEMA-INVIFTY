import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { templatesService } from '../../services/templatesService';
import { Template } from '../../types';
import {
  Sparkles,
  ShieldCheck,
  Eye,
  CheckCircle,
  Code,
  Smartphone,
  Monitor,
  Copy,
  Layers,
  Palette,
  ExternalLink
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export const AtelierTemplatesView: React.FC = () => {
  const { setAppMode } = useApp();
  const { addToast } = useToast();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [activeCodeTab, setActiveCodeTab] = useState<'preview' | 'html' | 'tokens'>('preview');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const list = await templatesService.getTemplates();
    setTemplates(list);
    if (list.length > 0) {
      setSelectedTemplate(list[0]);
    }
  };

  const handleApplyTemplate = () => {
    if (selectedTemplate) {
      addToast(`Plantilla "${selectedTemplate.name}" asignada a la producción activa`, 'success');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Luxury Architecture Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8A6510] font-semibold">Atelier de Diseños Digitales</span>
            <span className="text-xs text-slate-400">• Arquitectura Sandboxed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 tracking-tight">
            Catálogo Oficial de Colecciones de Lujo
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Plantillas artesanales de código limpio, libres de IA, optimizadas para tipografía editorial de gala y rendimiento ultra rápido en iOS y Android.
          </p>
        </div>

        <Button
          variant="gold"
          leftIcon={<Eye className="w-4 h-4" />}
          onClick={() => {
            setAppMode('runtime');
            addToast('Abriendo experiencia de invitación en vivo', 'info');
          }}
        >
          Ver en Modo Invitado
        </Button>
      </div>

      {/* Non-Negotiable Human Craft Principle Banner */}
      <div className="p-4 rounded-xl bg-[#FFF8DC] border border-[#F1DC91] flex items-start gap-4">
        <div className="p-2 rounded-lg bg-white text-[#C99B18] shadow-xs mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-semibold text-[#8A6510] uppercase tracking-wider font-mono">
            Principio Innegociable: Human-Crafted Luxury Only
          </h4>
          <p className="text-slate-700 leading-relaxed">
            Cada plantilla de Invifty Atelier es conceptualizada, diseñada y programada manualmente por diseñadores de alta costura e ingenieros de software. No se generan plantillas mediante modelos de lenguaje genéricos, garantizando una estética refinada, proporciones áureas precisas y cero alucinaciones de código.
          </p>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Template Cards List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
            Colecciones Disponibles ({templates.length})
          </h3>

          <div className="space-y-3">
            {templates.map((tpl) => {
              const isSelected = selectedTemplate?.id === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-[#FFF8DC] border-[#D6AE36] shadow-xs'
                      : 'bg-white border-[#E5E7EB] hover:border-slate-300 hover:bg-[#F8F9FB]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#8A6510] font-semibold">{tpl.code}</span>
                    <Badge variant={tpl.status === 'activo' ? 'gold' : 'slate'}>
                      v{tpl.version}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-base font-heading font-bold text-slate-900">{tpl.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{tpl.description}</p>
                  </div>

                  <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-slate-600">
                    <span>{tpl.category}</span>
                    <span className="font-mono text-[#8A6510] font-medium">
                      {tpl.colors ? tpl.colors.primary : '#D4AF37'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Sandboxed Live Preview & Code Inspector (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedTemplate && (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden shadow-xs">
              {/* Preview Bar */}
              <div className="p-4 bg-[#F8F9FA] border-b border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-heading text-slate-900 text-base font-bold">
                    {selectedTemplate.name}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">v{selectedTemplate.version}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-white p-1 rounded-lg border border-[#E5E7EB]">
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer ${
                        previewDevice === 'mobile'
                          ? 'bg-[#D6AE36] text-[#111827] font-semibold'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                      title="Vista Móvil (iPhone / Android)"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Móvil</span>
                    </button>
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer ${
                        previewDevice === 'desktop'
                          ? 'bg-[#D6AE36] text-[#111827] font-semibold'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                      title="Vista Desktop"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Escritorio</span>
                    </button>
                  </div>

                  <Button variant="gold" size="sm" onClick={handleApplyTemplate}>
                    Aplicar a Producción
                  </Button>
                </div>
              </div>

              {/* Viewport Frame */}
              <div className="bg-[#F8F9FB] p-6 flex items-center justify-center min-h-[580px] overflow-hidden">
                <div
                  className={`transition-all duration-300 shadow-md border border-[#E5E7EB] overflow-hidden bg-stone-950 ${
                    previewDevice === 'mobile'
                      ? 'w-[360px] h-[640px] rounded-[36px] border-4 border-slate-300 relative shadow-xl'
                      : 'w-full h-[580px] rounded-xl'
                  }`}
                >
                  {/* Sandboxed iframe */}
                  <iframe
                    srcDoc={selectedTemplate.htmlCode}
                    title="Live Sandboxed Template Preview"
                    className="w-full h-full border-0 select-none bg-stone-950"
                    sandbox="allow-scripts"
                  />
                </div>
              </div>

              {/* Template Specs Footer */}
              <div className="p-4 bg-[#F8F9FA] border-t border-[#E5E7EB] flex flex-wrap items-center justify-between text-xs text-slate-600 gap-4">
                <div className="flex items-center gap-4">
                  <span>
                    Tipografía: <strong className="text-slate-900">Playfair Display & Cinzel</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Paleta: <strong className="text-[#8A6510]">Oro Clásico + Obsidiana</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Soporte PWA: <strong className="text-[#16A34A]">Offline Ready (Cache API)</strong>
                  </span>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedTemplate.htmlCode || '');
                    addToast('Código fuente copiado al portapapeles', 'info');
                  }}
                  className="flex items-center gap-1.5 text-slate-600 hover:text-[#8A6510] transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar HTML Sandboxed</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
