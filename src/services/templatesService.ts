import { Template, TemplateVersion } from '../types';
import { recordAuditEvent } from '../lib/audit';

// Human-crafted luxury wedding template written by Invifty Atelier engineering
const sampleImperialGoldHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuestra Boda</title>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Plus+Jakarta+Sans:wght@300;400;500&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: radial-gradient(circle at 50% 20%, #1c1c24 0%, #0d0d11 100%);
      color: #f7f7f9;
      font-family: 'Plus Jakarta Sans', sans-serif;
      text-align: center;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 3rem 1.5rem 2rem;
      overflow-x: hidden;
    }
    .monogram-badge {
      width: 76px;
      height: 76px;
      border: 1px solid rgba(212, 175, 55, 0.4);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      background: rgba(212, 175, 55, 0.05);
      box-shadow: 0 0 25px rgba(212, 175, 55, 0.15);
    }
    .monogram-text {
      font-family: 'Cinzel', serif;
      font-size: 1.5rem;
      letter-spacing: 2px;
      background: linear-gradient(135deg, #fceda2 0%, #d4af37 60%, #997a15 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .kicker {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.3em;
      color: #d4af37;
      margin-bottom: 0.8rem;
    }
    .intro-title {
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-size: 2.2rem;
      color: #f2d06b;
      margin-bottom: 0.5rem;
      text-shadow: 0 2px 10px rgba(0,0,0,0.5);
    }
    .names {
      font-family: 'Playfair Display', serif;
      font-size: 2.8rem;
      line-height: 1.15;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 1.5rem;
    }
    .names span {
      display: block;
      font-size: 1.8rem;
      color: #d4af37;
      margin: 0.2rem 0;
    }
    .event-meta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      font-size: 0.8rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #a1a1aa;
      border-top: 1px solid rgba(255,255,255,0.1);
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding: 0.75rem 0;
      margin-bottom: 2rem;
      width: 100%;
      max-width: 320px;
    }
    .timer-wrap {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.5rem;
      width: 100%;
      max-width: 320px;
      margin-bottom: 2.5rem;
    }
    .timer-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 0.75rem 0.25rem;
    }
    .timer-val {
      font-size: 1.5rem;
      font-weight: 700;
      color: #ffffff;
      font-variant-numeric: tabular-nums;
    }
    .timer-lbl {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #71717a;
      margin-top: 0.2rem;
    }
    .cta-open {
      width: 100%;
      max-width: 320px;
      background: linear-gradient(135deg, #f2d06b 0%, #d4af37 100%);
      color: #0d0d0f;
      font-weight: 600;
      font-size: 0.9rem;
      padding: 1rem;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .cta-open:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(212, 175, 55, 0.45);
    }
    .guest-tag {
      font-size: 0.75rem;
      color: #71717a;
      margin-top: 1rem;
    }
  </style>
</head>
<body>
  <div>
    <div class="monogram-badge">
      <div class="monogram-text" id="monogram">M&C</div>
    </div>
    <div class="kicker">Nuestra Boda</div>
    <div class="intro-title" id="intro">¡Nos Casamos!</div>
    <div class="names" id="coupleNames">María <span>&</span> Carlos</div>
    <div class="event-meta">
      <span id="eventDate">14 Noviembre 2026</span>
      <span>•</span>
      <span id="venueCity">Villa Florencia</span>
    </div>
  </div>

  <div class="timer-wrap">
    <div class="timer-box"><div class="timer-val">89</div><div class="timer-lbl">Días</div></div>
    <div class="timer-box"><div class="timer-val">14</div><div class="timer-lbl">Horas</div></div>
    <div class="timer-box"><div class="timer-val">32</div><div class="timer-lbl">Min</div></div>
    <div class="timer-box"><div class="timer-val">10</div><div class="timer-lbl">Seg</div></div>
  </div>

  <div style="width: 100%; display: flex; flex-direction: column; align-items: center;">
    <button class="cta-open" onclick="handleOpenInvitation()">
      Deslizar para Abrir Invitación &darr;
    </button>
    <div class="guest-tag" id="personalizedFor">
      Invitación Personalizada • Familia Rodríguez
    </div>
  </div>

  <script>
    // Invifty Template Bridge Protocol
    window.addEventListener('message', function(event) {
      if (!event.data || !event.data.type) return;
      if (event.data.type === 'INVIFTY_SET_CONTENT') {
        const payload = event.data.payload || {};
        if (payload.coupleNames) document.getElementById('coupleNames').innerHTML = payload.coupleNames;
        if (payload.eventDate) document.getElementById('eventDate').innerText = payload.eventDate;
        if (payload.venueCity) document.getElementById('venueCity').innerText = payload.venueCity;
        if (payload.guestName) document.getElementById('personalizedFor').innerText = 'Invitación Personalizada • ' + payload.guestName;
      }
    });

    function handleOpenInvitation() {
      window.parent.postMessage({ type: 'INVIFTY_USER_OPENED_INVITATION' }, '*');
    }
  </script>
</body>
</html>`;

let memoryTemplates: Template[] = [
  {
    id: 'tpl-imperial-gold',
    code: '#TPL-01',
    slug: 'imperial-gold-foil',
    name: 'Imperial Gold Royal Edition',
    category: 'Bodas de Gala',
    status: 'activo',
    version: '2.4.0',
    description: 'Nuestra plantilla insignia de alta costura nupcial. Diseñada artesanalmente con micro-interacciones de sello de cera, monograma con relieve dorado y renderizado cinemático.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    styles: ['Black Tie Glamour', 'Cera Dorada 24k', 'Tipografía Playfair Luxury'],
    colors: { primary: '#D4AF37', secondary: '#121212', accent: '#FDFBF7' },
    htmlCode: sampleImperialGoldHtml,
    activeVersion: 'v2.4.0',
    versionsCount: 4,
    createdAt: '2026-06-15T09:00:00Z',
  },
  {
    id: 'tpl-minimal-editorial',
    code: '#TPL-02',
    slug: 'minimal-editorial',
    name: 'Minimal Editorial Broadside',
    category: 'Bodas Modernas & Galas',
    status: 'activo',
    version: '1.8.0',
    description: 'Composición limpia inspirada en revistas de arquitectura y arte contemporáneo. Líneas suizas y tipografía sans-serif refinada.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80',
    styles: ['Minimalismo Puro', 'Blanco & Negro', 'Swiss Grid'],
    colors: { primary: '#E5E5E5', secondary: '#0A0A0A', accent: '#A3A3A3' },
    htmlCode: sampleImperialGoldHtml,
    activeVersion: 'v1.8.0',
    versionsCount: 2,
    createdAt: '2026-07-20T12:00:00Z',
  },
  {
    id: 'tpl-botanical-velvet',
    code: '#TPL-03',
    slug: 'botanical-velvet',
    name: 'Botanical Velvet Garden',
    category: 'Bodas al Aire Libre',
    status: 'activo',
    version: '1.5.0',
    description: 'Ilustraciones botánicas detalladas en acuarela esmeralda y toques de bronce satinado.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
    styles: ['Acuarela Botánica', 'Verde Esmeralda', 'Sellos Orgánicos'],
    colors: { primary: '#103B2B', secondary: '#1A1A1A', accent: '#D4AF37' },
    htmlCode: sampleImperialGoldHtml,
    activeVersion: 'v1.5.0',
    versionsCount: 3,
    createdAt: '2026-08-01T14:30:00Z',
  },
];

let memoryVersions: TemplateVersion[] = [
  {
    id: 'ver-1',
    templateId: 'tpl-imperial-gold',
    versionTag: 'v1.4.0',
    changelog: 'Añadido soporte para pases QR en wallet de Apple y confirmación instantánea WhatsApp.',
    htmlSource: sampleImperialGoldHtml,
    capabilities: ['rsvp', 'qr_individual', 'countdown', 'audio_cello', 'wax_seal'],
    isImmutable: true,
    isPublished: true,
    publishedAt: '2026-09-18T16:00:00Z',
  },
  {
    id: 'ver-2',
    templateId: 'tpl-imperial-gold',
    versionTag: 'v1.3.0',
    changelog: 'Versión previa inmutable conservada para eventos contratados en Q2.',
    htmlSource: sampleImperialGoldHtml,
    capabilities: ['rsvp', 'qr_individual', 'countdown'],
    isImmutable: true,
    isPublished: true,
    publishedAt: '2026-08-10T11:00:00Z',
  },
];

export const templatesService = {
  getAll: async (): Promise<Template[]> => {
    return [...memoryTemplates];
  },

  getTemplates: async (): Promise<Template[]> => {
    return [...memoryTemplates];
  },

  getById: async (id: string): Promise<Template | undefined> => {
    return memoryTemplates.find(t => t.id === id || t.slug === id);
  },

  getVersionsForTemplate: async (templateId: string): Promise<TemplateVersion[]> => {
    return memoryVersions.filter(v => v.templateId === templateId);
  },

  getActiveVersionHtml: (templateId: string): string => {
    const ver = memoryVersions.find(v => v.templateId === templateId && v.isPublished);
    return ver ? ver.htmlSource : sampleImperialGoldHtml;
  },

  uploadNewVersion: async (params: {
    templateId: string;
    versionTag: string;
    changelog: string;
    htmlSource: string;
    capabilities: string[];
  }): Promise<TemplateVersion> => {
    const newVersion: TemplateVersion = {
      id: `ver-${Date.now()}`,
      templateId: params.templateId,
      versionTag: params.versionTag,
      changelog: params.changelog,
      htmlSource: params.htmlSource,
      capabilities: params.capabilities,
      isImmutable: true,
      isPublished: true,
      publishedAt: new Date().toISOString(),
    };

    memoryVersions = [newVersion, ...memoryVersions];

    const tpl = memoryTemplates.find(t => t.id === params.templateId);
    if (tpl) {
      tpl.activeVersion = params.versionTag;
      tpl.versionsCount += 1;
    }

    await recordAuditEvent({
      actorName: 'Starlin',
      actorRole: 'Lead Producer & Ops',
      action: `Nueva versión de plantilla publicada: ${params.versionTag}`,
      entityType: 'template_version',
      entityId: newVersion.id,
      metadata: { templateId: params.templateId, capabilities: params.capabilities },
    });

    return newVersion;
  },
};
