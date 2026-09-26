import { TeamMember, TeamRole } from '../types';
import { logAudit } from '../lib/audit';

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'usr-1',
    name: 'Starlin Paulino',
    email: 'starlinpaulino94@gmail.com',
    role: 'superadmin',
    status: 'activo',
    assignedEvents: 14,
    lastActivity: 'Hace 5 minutos',
    permissions: ['all_access', 'billing_manage', 'team_manage', 'export_data', 'system_config']
  },
  {
    id: 'usr-2',
    name: 'Carolina Herrera V.',
    email: 'carolina.diseno@invifty.com',
    role: 'disenador',
    status: 'activo',
    assignedEvents: 8,
    lastActivity: 'Hace 1 hora',
    permissions: ['atelier_edit', 'reviews_manage', 'media_upload']
  },
  {
    id: 'usr-3',
    name: 'Mateo Sandoval',
    email: 'mateo.concierge@invifty.com',
    role: 'operaciones',
    status: 'activo',
    assignedEvents: 12,
    lastActivity: 'Hace 24 minutos',
    permissions: ['guests_edit', 'checkin_scan', 'seating_assign', 'whatsapp_send']
  },
  {
    id: 'usr-4',
    name: 'Valeria Benítez',
    email: 'valeria.sales@invifty.com',
    role: 'ventas',
    status: 'activo',
    assignedEvents: 0,
    lastActivity: 'Ayer a las 18:30',
    permissions: ['leads_manage', 'clients_create', 'payments_view']
  },
  {
    id: 'usr-5',
    name: 'Rodrigo Albarrán',
    email: 'rodrigo.admin@invifty.com',
    role: 'admin',
    status: 'activo',
    assignedEvents: 6,
    lastActivity: 'Hace 2 horas',
    permissions: ['leads_manage', 'clients_create', 'payments_manage', 'reviews_manage']
  }
];

class TeamService {
  private team: TeamMember[] = [...initialTeamMembers];

  async getTeam(): Promise<TeamMember[]> {
    return [...this.team];
  }

  async addMember(member: Omit<TeamMember, 'id' | 'lastActivity'>): Promise<TeamMember> {
    const newMember: TeamMember = {
      ...member,
      id: `usr-${Date.now()}`,
      lastActivity: 'Recién invitado'
    };
    this.team.push(newMember);
    logAudit({
      actor: 'Superadmin',
      action: 'Creación de usuario del equipo',
      target: newMember.name,
      details: `Rol asignado: ${newMember.role} (${newMember.email})`
    });
    return newMember;
  }

  async updateMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember | null> {
    const idx = this.team.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.team[idx] = { ...this.team[idx], ...updates };
      logAudit({
        actor: 'Superadmin',
        action: 'Modificación de usuario del equipo',
        target: this.team[idx].name,
        details: `Actualizados campos: ${Object.keys(updates).join(', ')}`
      });
      return this.team[idx];
    }
    return null;
  }

  async toggleStatus(id: string): Promise<TeamMember | null> {
    const member = this.team.find(u => u.id === id);
    if (member) {
      member.status = member.status === 'activo' ? 'inactivo' : 'activo';
      return member;
    }
    return null;
  }
}

export const teamService = new TeamService();
