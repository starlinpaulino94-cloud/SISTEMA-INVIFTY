# Invifty 2.0 — System Architecture

## Overview
Invifty 2.0 is a luxury digital invitation and event management operating system catering to high-end weddings, galas, and private celebrations in the Dominican Republic and international destinations.

## Core Architectural Tiers

1. **Invifty Studio (Desktop-first OS)**
   - Target Resolution: 1440px+
   - Internal workstation for Studio Leads, Production Directors, Concierges, and Designers.
   - Modules: Leads, Clients, Events, Production Pipeline, Reviews, Payments, Templates, Audit Log, Team SLA.

2. **Invifty App (Mobile-first PWA)**
   - Target Resolution: 390px mobile viewport + tablet/desktop responsive.
   - Host client application for couples, event planners, and banquet captains.
   - Modules: Event Countdown & Live Status, RSVP Overview, Interactive Guest List, Seating & Seating Diagram, Real-Time Door Check-In with QR scanning, Gifts & Banking Registry.

3. **Invitation Runtime (Sandboxed Public Experience)**
   - Isolated iframe container running customer-approved, immutable HTML/CSS/JS template versions.
   - Secured via the **Invifty Template Bridge** (`postMessage` validated protocol).
   - Zero direct database access, safeguarding private guest and host data.

## Domain Model & Multi-Tenant Hierarchy

```
ACCOUNT / CLIENT (e.g. María Fernández & Carlos Rodríguez)
  ├── COLLABORATORS (e.g. Novios, Wedding Planner Lic. Patricia Ramos)
  └── EVENTS (e.g. Boda María & Carlos, Jarabacoa Nov 2026)
        ├── CONTRACT / ORDER (RD$4,000, RD$2,500 paid, RD$1,500 pending)
        ├── INVITATION INSTANCE (v4.2, Template: Imperial Gold Foil)
        ├── GUESTS (150 total: 89 confirmed, 42 pending, 19 declined)
        ├── TABLES & SEATING (Mesa 2 - Terraza Jardín, etc.)
        ├── CHECK-IN LOGS (Door check-in, dietary requirements)
        ├── REVIEWS & COMMENTS (V4 review workflow)
        └── AUDIT TRAIL
```

## Security & Authorization Model
- Role-based server verification: `requireStudioUser()`, `requireAccountAccess()`, `requireEventAccess()`.
- Client role differentiation: `account_owner`, `planner_collaborator`, `checkin_operator`.
- Token-less sandboxed template execution with strict origin isolation.
