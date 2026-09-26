import React, { useState, useEffect } from 'react';
import { teamService } from '../../services/teamService';
import { TeamMember, TeamRole } from '../../types';
import {
  Users,
  Search,
  Plus,
  ShieldCheck,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  Key,
  X
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const TeamView: React.FC = () => {
  const { showToast } = useToast();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New member form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TeamRole>('disenador');

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    const data = await teamService.getTeam();
    setTeam(data);
  };

  const handleToggleStatus = async (id: string) => {
    await teamService.toggleStatus(id);
    showToast('Estado del usuario actualizado', 'info');
    await loadTeam();
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    await teamService.addMember({
      name,
      email,
      role,
      status: 'activo',
      assignedEvents: 0,
      permissions: ['atelier_edit', 'guests_view']
    });

    setIsModalOpen(false);
    setName('');
    setEmail('');
    showToast(`Invitación enviada a ${email}`, 'success');
    await loadTeam();
  };

  const getRoleBadge = (r: TeamRole) => {
    switch (r) {
      case 'superadmin':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF8DC] text-[#8A6510] border border-[#F1DC91]">Superadmin</span>;
      case 'admin':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">Administrador</span>;
      case 'disenador':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">Diseñador Atelier</span>;
      case 'operaciones':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">Operaciones & Concierge</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">Ventas & Leads</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8A6510] font-semibold">Gobernanza & Seguridad</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-600 font-sans">{team.length} miembros activos</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="w-6 h-6 text-[#C99B18]" />
            Equipo & Control de Acceso (RBAC)
          </h1>
          <p className="text-sm text-slate-600 mt-0.5 font-sans">
            Gestión de roles de usuario, permisos granulares y asignación de carga de trabajo por evento.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D6AE36] hover:bg-[#C99B18] text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Invitar Miembro
        </button>
      </div>

      {/* Team Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F8F9FA] text-slate-600 font-medium">
              <th className="py-3 px-4">Miembro</th>
              <th className="py-3 px-4">Rol en Studio</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4">Eventos Asignados</th>
              <th className="py-3 px-4">Última Actividad</th>
              <th className="py-3 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {team.map(member => (
              <tr key={member.id} className="hover:bg-[#F9FAFB] transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FFF8DC] border border-[#F1DC91] flex items-center justify-center font-bold text-xs text-[#8A6510]">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 font-sans">{member.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" /> {member.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">{getRoleBadge(member.role)}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      member.status === 'activo'
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        member.status === 'activo' ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                    />
                    {member.status === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="py-3 px-4 font-sans text-slate-700">
                  <span className="font-bold text-slate-900">{member.assignedEvents}</span> proyectos
                </td>
                <td className="py-3 px-4 font-sans text-slate-500 text-[11px]">
                  {member.lastActivity}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleToggleStatus(member.id)}
                    className="text-xs text-slate-600 hover:text-slate-900 font-medium"
                  >
                    {member.status === 'activo' ? 'Suspender' : 'Reactivar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-heading">Invitar Miembro al Equipo</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1 font-sans">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Sofía Villarreal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#D6AE36]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1 font-sans">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  placeholder="sofia@invifty.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#D6AE36]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1 font-sans">Rol de Permisos</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as TeamRole)}
                  className="w-full bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#D6AE36]"
                >
                  <option value="disenador">Diseñador Atelier (Edición visual & plantillas)</option>
                  <option value="operaciones">Operaciones (Check-in, Seating, Invitados)</option>
                  <option value="ventas">Ventas (Gestión de prospectos & cotizaciones)</option>
                  <option value="admin">Administrador (Control de pagos y proyectos)</option>
                  <option value="superadmin">Superadmin (Acceso total & gobernanza)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#D6AE36] hover:bg-[#C99B18] text-white font-semibold shadow-xs"
                >
                  Enviar Invitación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
