import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Guest } from '../../types';

export interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (guestData: Partial<Guest>) => void;
  initialGuest?: Guest | null;
}

export const GuestModal: React.FC<GuestModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialGuest,
}) => {
  const [formData, setFormData] = useState<Partial<Guest>>({
    name: initialGuest?.name || '',
    companionName: initialGuest?.companionName || '',
    category: initialGuest?.category || 'Familia Novia',
    tableNumber: initialGuest?.tableNumber || 'Mesa 01',
    status: initialGuest?.status || 'pendiente',
    pax: initialGuest?.pax || 2,
    phone: initialGuest?.phone || '',
    email: initialGuest?.email || '',
    dietaryNotes: initialGuest?.dietaryNotes || '',
    isVip: initialGuest?.isVip ?? true,
    hotelRequired: initialGuest?.hotelRequired ?? false,
    transportRequired: initialGuest?.transportRequired ?? false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialGuest ? 'Editar Huésped VIP' : 'Registrar Nuevo Huésped'}
      subtitle="Control de asignación de mesa, régimen alimenticio y pases QR"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre Completo del Titular *"
            placeholder="Ej. Roberto Gómez"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Nombre del Acompañante"
            placeholder="Ej. Ana Gómez"
            value={formData.companionName}
            onChange={(e) => setFormData({ ...formData, companionName: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5 font-sans">
              Categoría
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#D6AE36] focus:ring-1 focus:ring-[#D6AE36]"
            >
              <option value="Familia Novia">Familia Novia</option>
              <option value="Familia Novio">Familia Novio</option>
              <option value="Corte de Honor">Corte de Honor</option>
              <option value="Amigos Novios">Amigos Novios</option>
              <option value="Invitados VIP">Invitados VIP</option>
              <option value="Corporativo / Social">Corporativo / Social</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5 font-sans">
              Mesa Asignada
            </label>
            <select
              value={formData.tableNumber}
              onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
              className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#D6AE36] focus:ring-1 focus:ring-[#D6AE36]"
            >
              <option value="Mesa Presidencial">Mesa Presidencial</option>
              <option value="Mesa 01 Imperial">Mesa 01 Imperial</option>
              <option value="Mesa 02 Bellagio">Mesa 02 Bellagio</option>
              <option value="Mesa 03 Florencia">Mesa 03 Florencia</option>
              <option value="Mesa 04 Versailles">Mesa 04 Versailles</option>
              <option value="Mesa 05 Toscana">Mesa 05 Toscana</option>
              <option value="Sin asignar">Sin asignar</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5 font-sans">
              Estado RSVP
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#D6AE36] focus:ring-1 focus:ring-[#D6AE36]"
            >
              <option value="confirmado">Confirmado</option>
              <option value="pendiente">Pendiente</option>
              <option value="rechazado">Rechazado</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="WhatsApp / Celular"
            placeholder="+1 (809) 555-0144"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="roberto.gomez@empresa.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <Input
            label="Restricciones Alimenticias / Alergias"
            placeholder="Ej. Intolerante al gluten severo / Vegetariano / Alergia a mariscos"
            value={formData.dietaryNotes}
            onChange={(e) => setFormData({ ...formData, dietaryNotes: e.target.value })}
          />
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
            <input
              type="checkbox"
              checked={formData.isVip}
              onChange={(e) => setFormData({ ...formData, isVip: e.target.checked })}
              className="rounded bg-white border-slate-300 text-[#D6AE36] focus:ring-[#D6AE36]"
            />
            <span>Tratamiento VIP (Check-in prioritario)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
            <input
              type="checkbox"
              checked={formData.transportRequired}
              onChange={(e) => setFormData({ ...formData, transportRequired: e.target.checked })}
              className="rounded bg-white border-slate-300 text-[#D6AE36] focus:ring-[#D6AE36]"
            />
            <span>Requiere Transporte / Shuttle</span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="gold" type="submit">
            Guardar Huésped
          </Button>
        </div>
      </form>
    </Modal>
  );
};
