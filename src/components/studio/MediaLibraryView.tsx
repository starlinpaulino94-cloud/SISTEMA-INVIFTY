import React, { useState, useEffect } from 'react';
import { mediaService } from '../../services/mediaService';
import { MediaItem } from '../../types';
import {
  Image as ImageIcon,
  Search,
  Filter,
  Upload,
  Trash2,
  Copy,
  ExternalLink,
  Film,
  Music,
  FileText,
  CheckCircle,
  HardDrive
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const MediaLibraryView: React.FC = () => {
  const { showToast } = useToast();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadMedia();
  }, [typeFilter, search]);

  const loadMedia = async () => {
    const data = await mediaService.getMedia({
      type: typeFilter !== 'all' ? typeFilter : undefined,
      search: search || undefined
    });
    setMedia(data);
  };

  const handleDelete = async (id: string, filename: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el archivo "${filename}"?`)) {
      await mediaService.deleteItem(id);
      showToast('Archivo eliminado del almacenamiento', 'info');
      await loadMedia();
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('URL del archivo copiada al portapapeles', 'info');
  };

  const handleSimulateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setTimeout(async () => {
      let type: 'image' | 'video' | 'audio' | 'document' = 'image';
      if (file.type.includes('video')) type = 'video';
      else if (file.type.includes('audio')) type = 'audio';
      else if (file.type.includes('pdf')) type = 'document';

      await mediaService.uploadItem({
        filename: file.name,
        type,
        sizeBytes: file.size,
        sizeFormatted: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        url: URL.createObjectURL(file),
        usage: 'Subida manual de producción',
        isPrivate: false
      });
      setIsUploading(false);
      showToast(`Archivo "${file.name}" cargado a Supabase Storage`, 'success');
      await loadMedia();
    }, 800);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Film className="w-4 h-4 text-purple-600" />;
      case 'audio':
        return <Music className="w-4 h-4 text-amber-600" />;
      case 'document':
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return <ImageIcon className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8A6510] font-semibold">Almacenamiento Cloud</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-600 font-sans">{media.length} archivos multimedia</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-[#C99B18]" />
            Biblioteca de Medios & Activos
          </h1>
          <p className="text-sm text-slate-600 mt-0.5 font-sans">
            Repositorio optimizado para fotografías en alta resolución, pistas de audio, clips de video y comprobantes.
          </p>
        </div>

        {/* Upload Button */}
        <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D6AE36] hover:bg-[#C99B18] text-white font-semibold text-xs shadow-xs transition-all cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>{isUploading ? 'Subiendo...' : 'Subir Archivo'}</span>
          <input
            type="file"
            onChange={handleSimulateUpload}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf"
          />
        </label>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E5E7EB] p-3 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, evento o etiqueta de uso..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs text-slate-900 placeholder:text-slate-400 bg-transparent border-none outline-none font-sans"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-2.5 py-1 text-slate-700 font-sans"
          >
            <option value="all">Todos los formatos</option>
            <option value="image">Imágenes (JPG / WEBP / PNG)</option>
            <option value="video">Videos (MP4 / WebM)</option>
            <option value="audio">Audios (MP3 / AAC)</option>
            <option value="document">Documentos & PDF</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {media.map(item => (
          <div
            key={item.id}
            className="bg-white border border-[#E5E7EB] hover:border-[#D6AE36] rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all duration-150 flex flex-col justify-between"
          >
            <div>
              {/* Preview Box */}
              <div className="h-40 bg-slate-100 relative flex items-center justify-center overflow-hidden">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="w-full h-full object-cover"
                  />
                ) : item.type === 'video' ? (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <div className="p-6 text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center mx-auto text-[#C99B18]">
                      {getTypeIcon(item.type)}
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 uppercase font-semibold">
                      {item.type}
                    </span>
                  </div>
                )}

                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white text-[10px] font-mono flex items-center gap-1">
                  {getTypeIcon(item.type)}
                  <span>{item.type.toUpperCase()}</span>
                </div>

                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-white text-[10px] font-mono">
                  {item.sizeFormatted}
                </div>
              </div>

              {/* Meta */}
              <div className="p-3.5 space-y-1 text-xs">
                <h4 className="font-bold text-slate-900 font-sans line-clamp-1" title={item.filename}>
                  {item.filename}
                </h4>
                <div className="text-[11px] text-slate-500 font-sans line-clamp-1">
                  {item.eventName ? `Evento: ${item.eventName}` : 'Activo Global'}
                </div>
                <div className="text-[10px] text-[#8A6510] font-mono bg-[#FFF8DC] px-2 py-0.5 rounded border border-[#F1DC91] inline-block font-semibold mt-1">
                  {item.usage}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-3 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between text-xs">
              <button
                onClick={() => copyUrl(item.url)}
                className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium font-sans"
              >
                <Copy className="w-3.5 h-3.5" /> Copiar Enlace
              </button>
              <button
                onClick={() => handleDelete(item.id, item.filename)}
                className="text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50 transition-colors"
                title="Eliminar archivo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
