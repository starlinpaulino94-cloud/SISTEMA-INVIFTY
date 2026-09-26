# Invifty 2.0 — Supabase Integration & Schema Preservation

## Existing Database Philosophy
Invifty operates on an existing Supabase PostgreSQL instance. Under strict production continuity rules:
- **Zero Destructive Migrations**: No table drops, column drops, truncations, or key deletions.
- **Historical Concept Preservation**: Tables such as `clientes`, `pedidos`, `pagos`, `formularios`, `invitaciones`, `confirmaciones`, `invitados`, `leads`, `demos`, `historial_estados`, `auditoria`, `generaciones`, `visitas`, `versiones`, `revisiones`, `comentarios`, `mesas`, `hogares`, `entradas`, `avisos`, `frenos`, `cuentas_cliente`, `miembros_cuenta`, `invitaciones_cuenta`, `recuperaciones`, `pagos_reportados`, `aportes`, `fotos_galeria` remain intact.
- **Additive Compatibility Layer**: Extended columns (such as separate lifecycle statuses, immutable template version foreign keys, and granular member seating) are added non-destructively.

## Status Separation (Anti-Overload Pattern)
Separate business statuses are strictly partitioned:
- **EVENT STATUS**: `planning`, `upcoming`, `live`, `completed`, `archived`, `cancelled`
- **ORDER STATUS**: `draft`, `pending_payment`, `partially_paid`, `paid`, `refunded`, `cancelled`
- **PRODUCTION STATUS**: `waiting_for_information`, `information_received`, `designing`, `internal_review`, `client_review`, `changes_requested`, `approved`, `ready_to_publish`, `completed`
- **INVITATION STATUS**: `draft`, `review`, `published`, `paused`, `expired`, `archived`

## Storage Buckets
Private, authenticated Supabase Storage buckets:
- `templates`: HTML/CSS/JS source bundles for approved atelier templates.
- `template-assets`: Fonts, textures, metallic gold foil SVG masks.
- `event-media`: High-resolution couple photography, venue drone shots.
- `payment-receipts`: Private deposit slips, Banreservas / Banco Popular transfer receipts.
