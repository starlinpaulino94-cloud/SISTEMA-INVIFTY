# Invifty 2.0 — Invitation Template Architecture & Sandboxed Bridge

## Non-Negotiable Principle: Human-Crafted Luxury Only
- **NO AI TEMPLATES**: Official invitation templates are designed and coded by the Invifty engineering and haute-couture design team. AI generation of templates is explicitly prohibited.

## Template Lifecycle
```
Designer/Developer Crafts Source (HTML/CSS/JS)
                 ↓
Upload to Invifty Studio Atelier (/studio/templates/import)
                 ↓
Validation & Schema Extraction (Dynamic fields & capabilities)
                 ↓
Immutable Version Assignment (e.g. Imperial Gold Foil v1.0.0)
                 ↓
Customer Invitation Instance Binds (template_id + template_version_id)
                 ↓
Sandboxed Iframe Execution via Invifty Template Bridge
```

## Template Bridge Security Contract
The template is loaded in an isolated iframe with restricted sandbox flags:
`sandbox="allow-scripts allow-forms allow-popups"` (WITHOUT `allow-same-origin` or credential inheritance).

All communication with the host app flows strictly through validated `window.postMessage` payloads:
- Host to Template: `INIT_CONTENT`, `SET_GUEST_INFO`, `APPLY_THEME`
- Template to Host: `SUBMIT_RSVP`, `OPEN_MAP`, `VIEW_GALLERY`, `INTERACTION_EVENT`
