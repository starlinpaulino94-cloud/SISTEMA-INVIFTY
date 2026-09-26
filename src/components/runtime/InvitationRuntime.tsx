import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { primaryDemoEvent } from '../../services/eventsService';
import { guestsService } from '../../services/guestsService';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Volume2,
  VolumeX,
  QrCode,
  CheckCircle2,
  Smartphone,
  Maximize2,
  Share2,
  Music,
  Download,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/Button';

export const InvitationRuntime: React.FC = () => {
  const { setAppMode, setStudioView } = useApp();
  const { addToast } = useToast();

  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [deviceFrame, setDeviceFrame] = useState<'mobile' | 'full'>('mobile');
  const [activePersona, setActivePersona] = useState<'ana' | 'carlos_amigo'>('ana');
  const [rsvpStatus, setRsvpStatus] = useState<'idle' | 'attending' | 'declined'>('idle');
  const [companionAttending, setCompanionAttending] = useState(true);
  const [dietary, setDietary] = useState('Intolerancia severa al gluten');
  const [songRequest, setSongRequest] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Time remaining calculation
  const [timeLeft, setTimeLeft] = useState({
    days: 28,
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        return { ...prev, seconds: 59, minutes: prev.minutes > 0 ? prev.minutes - 1 : 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const guestName = activePersona === 'ana' ? 'Ana Gómez' : 'Eduardo Santos';
  const companionName = activePersona === 'ana' ? 'Roberto Gómez' : 'Invitado';

  const handleRsvpSubmit = async (status: 'attending' | 'declined') => {
    setRsvpStatus(status);
    setSubmitted(true);
    if (activePersona === 'ana') {
      await guestsService.updateRsvpByCode('#INV-8901', {
        status: status === 'attending' ? 'confirmado' : 'rechazado',
        dietaryNotes: dietary,
      });
    }
    addToast(
      status === 'attending'
        ? '¡Confirmación registrada! Tu pase de acceso digital ha sido activado.'
        : 'Agradecemos tu notificación. Los novios han sido informados.',
      'success'
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-800 flex flex-col font-sans">
      {/* Studio Bar Controls */}
      <header className="bg-white border-b border-[#E5E7EB] px-4 py-2.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 shadow-2xs">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => {
              setAppMode('studio');
              setStudioView('event-workspace');
              addToast('Regresando al Espacio de Producción', 'info');
            }}
          >
            Studio OS
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setAppMode('client');
              addToast('Cambiando a Portal Anfitriones', 'info');
            }}
          >
            Portal Novios
          </Button>
        </div>

        {/* Persona & Device Switcher */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">Simular Huésped:</span>
            <select
              value={activePersona}
              onChange={(e) => setActivePersona(e.target.value as any)}
              className="bg-white border border-[#E5E7EB] text-[#8A6510] font-medium rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#D6AE36]"
            >
              <option value="ana">Ana Gómez (#INV-8901 • VIP)</option>
              <option value="carlos_amigo">Dr. Eduardo Santos (#INV-8903)</option>
            </select>
          </div>

          <div className="flex items-center bg-[#F8F9FA] rounded-lg p-0.5 border border-[#E5E7EB]">
            <button
              onClick={() => setDeviceFrame('mobile')}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                deviceFrame === 'mobile' ? 'bg-[#D6AE36] text-[#111827] font-semibold' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Vista Móvil"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Móvil</span>
            </button>
            <button
              onClick={() => setDeviceFrame('full')}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                deviceFrame === 'full' ? 'bg-[#D6AE36] text-[#111827] font-semibold' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Pantalla Completa"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Completa</span>
            </button>
          </div>

          <button
            onClick={() => setIsPlayingMusic(!isPlayingMusic)}
            className={`p-2 rounded-full border transition-all ${
              isPlayingMusic
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-500/10'
                : 'bg-neutral-800 text-neutral-400 border-neutral-700'
            }`}
            title={isPlayingMusic ? 'Pausar banda sonora' : 'Reproducir música'}
          >
            {isPlayingMusic ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Presentation Viewport */}
      <main
        className={`flex-1 flex items-center justify-center p-2 sm:p-6 transition-all ${
          deviceFrame === 'mobile' ? 'bg-neutral-950' : 'bg-neutral-950'
        }`}
      >
        <div
          className={`transition-all duration-300 overflow-y-auto ${
            deviceFrame === 'mobile'
              ? 'w-full max-w-[420px] min-h-[820px] rounded-[42px] border-8 border-neutral-800 shadow-2xl relative bg-stone-950'
              : 'w-full max-w-3xl min-h-[90vh] rounded-3xl border border-amber-500/30 shadow-2xl bg-stone-950'
          }`}
          style={{
            backgroundImage: `radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 70%)`,
          }}
        >
          {/* Invitation Luxury Container */}
          <div className="p-6 sm:p-10 space-y-12 text-center text-stone-200">
            {/* Monogram Seal */}
            <div className="pt-4 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full border-2 border-amber-400/60 p-1 flex items-center justify-center shadow-lg shadow-amber-500/5">
                <div className="w-full h-full rounded-full border border-amber-400/30 flex items-center justify-center bg-stone-900/60">
                  <span className="font-serif text-2xl font-bold text-amber-300 tracking-widest">
                    M & C
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-amber-400">
                Nuestra Boda de Gala
              </div>
            </div>

            {/* Names */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-serif text-white tracking-wide">
                María Fernández
              </h1>
              <div className="text-amber-400/80 font-serif italic text-xl">&</div>
              <h1 className="text-4xl sm:text-5xl font-serif text-white tracking-wide">
                Carlos Rodríguez
              </h1>
            </div>

            {/* Personalized Guest Greeting */}
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1 max-w-md mx-auto">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400/80">
                Invitación Exclusiva Para
              </span>
              <div className="text-lg font-serif text-white font-medium">{guestName}</div>
              <p className="text-xs text-stone-400">
                Acompañante de honor: <span className="text-amber-200">{companionName}</span> • 2 pases reservados
              </p>
            </div>

            {/* Golden Date & Countdown */}
            <div className="space-y-6 pt-2">
              <div className="inline-block px-5 py-2 rounded-full border border-amber-500/30 bg-stone-900/80 text-amber-300 font-serif text-sm tracking-wider">
                SÁBADO • 24 DE OCTUBRE, 2026
              </div>

              {/* Countdown Grid */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-sm mx-auto">
                <div className="p-3 rounded-xl bg-stone-900/80 border border-neutral-800">
                  <div className="text-2xl font-serif font-bold text-white">{timeLeft.days}</div>
                  <div className="text-[10px] font-mono uppercase text-neutral-400">Días</div>
                </div>
                <div className="p-3 rounded-xl bg-stone-900/80 border border-neutral-800">
                  <div className="text-2xl font-serif font-bold text-white">{timeLeft.hours}</div>
                  <div className="text-[10px] font-mono uppercase text-neutral-400">Horas</div>
                </div>
                <div className="p-3 rounded-xl bg-stone-900/80 border border-neutral-800">
                  <div className="text-2xl font-serif font-bold text-white">{timeLeft.minutes}</div>
                  <div className="text-[10px] font-mono uppercase text-neutral-400">Min</div>
                </div>
                <div className="p-3 rounded-xl bg-stone-900/80 border border-neutral-800">
                  <div className="text-2xl font-serif font-bold text-amber-300">{timeLeft.seconds}</div>
                  <div className="text-[10px] font-mono uppercase text-neutral-400">Seg</div>
                </div>
              </div>
            </div>

            {/* Itinerary & Locations */}
            <div className="space-y-6 pt-4 text-left max-w-md mx-auto">
              <div className="text-center">
                <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-amber-400">
                  Itinerario del Gran Día
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-stone-900/80 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-amber-300 font-mono">
                  <span>5:00 PM</span>
                  <span>Ceremonia Nupcial</span>
                </div>
                <h4 className="font-serif text-white text-base">Parroquia San Juan Bautista</h4>
                <p className="text-xs text-stone-400">Centro Histórico, Jarabacoa, La Vega</p>
              </div>

              <div className="p-5 rounded-2xl bg-stone-900/80 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-amber-300 font-mono">
                  <span>7:00 PM</span>
                  <span>Recepción de Gala & Banquete</span>
                </div>
                <h4 className="font-serif text-white text-base">Villa Florencia Luxury Estate</h4>
                <p className="text-xs text-stone-400">Camino al Salto Jimenoa, Jarabacoa</p>
                <div className="pt-2">
                  <a
                    href="https://maps.google.com/?q=Villa+Florencia+Jarabacoa"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium"
                  >
                    <MapPin className="w-3.5 h-3.5" /> Abrir en Google Maps / Waze
                  </a>
                </div>
              </div>
            </div>

            {/* Dress Code Section */}
            <div className="p-6 rounded-2xl bg-stone-900/60 border border-amber-500/20 max-w-md mx-auto space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
                Código de Etiqueta
              </span>
              <h4 className="text-xl font-serif text-white">Black Tie • Gala Clásica</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Damas: Vestido largo de gala en tonos joya (esmeralda, azul zafiro, borgoña o dorado). Agradecemos reservar los tonos blancos y marfil exclusivamente para la novia.<br />
                Caballeros: Smoking o tuxedo riguroso negro.
              </p>
            </div>

            {/* RSVP Interactive Module */}
            <div className="p-6 rounded-2xl bg-stone-900 border border-amber-500/30 max-w-md mx-auto space-y-5 text-left shadow-2xl">
              <div className="text-center space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400">
                  Confirmación de Asistencia
                </span>
                <h3 className="text-xl font-serif text-white">¿Nos acompañarás?</h3>
                <p className="text-xs text-stone-400">
                  Por favor confirma antes del 30 de Septiembre para la asignación de tu mesa.
                </p>
              </div>

              {!submitted ? (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleRsvpSubmit('attending')}
                      className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Sí, Asistiré con Gusto</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRsvpSubmit('declined')}
                      className="p-3.5 rounded-xl border border-neutral-700 bg-neutral-800/60 hover:bg-neutral-800 text-neutral-400 text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all"
                    >
                      <AlertCircle className="w-5 h-5 text-neutral-400" />
                      <span>No Podré Asistir</span>
                    </button>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1">
                        Restricción alimenticia o alergia:
                      </label>
                      <input
                        type="text"
                        value={dietary}
                        onChange={(e) => setDietary(e.target.value)}
                        placeholder="Ej. Celíaco, alérgico a frutos secos..."
                        className="w-full bg-stone-950 border border-neutral-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1">
                        ¿Qué canción no puede faltar en la fiesta?
                      </label>
                      <input
                        type="text"
                        value={songRequest}
                        onChange={(e) => setSongRequest(e.target.value)}
                        placeholder="Canción / Artista para el DJ"
                        className="w-full bg-stone-950 border border-neutral-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-serif text-white">¡Gracias por confirmar, {guestName}!</h4>
                  <p className="text-xs text-neutral-300">
                    Tu confirmación ha sido recibida en tiempo real por el equipo de concierge de la boda.
                  </p>

                  <div className="p-4 rounded-xl bg-stone-950 border border-amber-500/30 inline-block mx-auto space-y-2">
                    <QrCode className="w-24 h-24 text-white mx-auto" />
                    <span className="text-[11px] font-mono text-amber-300 block">
                      PASE QR • MESA 01 IMPERIAL
                    </span>
                  </div>

                  <p className="text-[10px] text-neutral-400">
                    Puedes agregar este pase a tu Apple Wallet o guardarlo como captura.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-8 border-t border-neutral-800/80 text-center space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500">
                INVIFTY 2.0 • HAUTE COUTURE EVENT ENGINE
              </span>
              <p className="text-[10px] text-neutral-600">
                Jarabacoa, República Dominicana • 2026
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
