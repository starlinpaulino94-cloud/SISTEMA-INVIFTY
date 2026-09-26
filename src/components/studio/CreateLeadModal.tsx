import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { leadsService } from '../../services/leadsService';
import { Lead } from '../../types';

export interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadCreated: (newLead: Lead) => void;
}

export const CreateLeadModal: React.FC<CreateLeadModalProps> = ({
  isOpen,
  onClose,
  onLeadCreated,
}) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    partnerName: '',
    email: '',
    phone: '',
    eventType: 'Boda de Alta Gama',
    eventDate: '2026-11-20',
    location: 'Jarabacoa, La Vega',
    plan: 'Imperial Gold ($4,200 USD)',
    estimatedGuests: 250,
    estimatedBudget: '$4,200 USD',
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      addToast('Por favor completa el nombre, correo y teléfono del titular', 'warning');
      return;
    }

    try {
      setLoading(true);
      const newLead = await leadsService.createLead({
        name: formData.name,
        partnerName: formData.partnerName,
        email: formData.email,
        phone: formData.phone,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        location: formData.location,
        plan: formData.plan,
        estimatedGuests: Number(formData.estimatedGuests) || 200,
        estimatedBudget: formData.estimatedBudget,
        status: 'nuevo',
        source: 'Formulario Web VIP',
        notes: formData.notes,
      });

      addToast(`Lead ${newLead.code} registrado con éxito`, 'success');
      onLeadCreated(newLead);
      onClose();
      // Reset
      setFormData({
        name: '',
        partnerName: '',
        email: '',
        phone: '',
        eventType: 'Boda de Alta Gama',
        eventDate: '2026-11-20',
        location: 'Jarabacoa, La Vega',
        plan: 'Imperial Gold ($4,200 USD)',
        estimatedGuests: 250,
        estimatedBudget: '$4,200 USD',
        notes: '',
      });
    } catch {
      addToast('Error al registrar el lead', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Nuevo Prospecto VIP"
      subtitle="Ingresa los datos para la cotización de invitaciones digitales y concierge de evento"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre del Titular *"
            placeholder="Ej. Isabella Morales"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Nombre de la Pareja / Co-anfitrión"
            placeholder="Ej. Juan Carlos Vicini"
            value={formData.partnerName}
            onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Correo Electrónico *"
            type="email"
            placeholder="isabella@morales.do"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="WhatsApp / Teléfono *"
            placeholder="+1 (809) 555-0199"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5 font-sans">
              Tipo de Celebración
            </label>
            <select
              value={formData.eventType}
              onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
              className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#D6AE36] focus:ring-1 focus:ring-[#D6AE36]"
            >
              <option value="Boda de Alta Gama">Boda de Alta Gama</option>
              <option value="Boda de Destino">Boda de Destino</option>
              <option value="Gala Benéfica">Gala Benéfica</option>
              <option value="Quinceañero de Lujo">Quinceañero de Lujo</option>
              <option value="Celebración Corporativa">Celebración Corporativa</option>
            </select>
          </div>

          <Input
            label="Fecha Estimada"
            type="date"
            value={formData.eventDate}
            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
          />

          <Input
            label="Invitados Estimados"
            type="number"
            value={formData.estimatedGuests}
            onChange={(e) => setFormData({ ...formData, estimatedGuests: Number(e.target.value) })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Lugar o Destino Tentativo"
            placeholder="Ej. Casa de Campo, Jarabacoa, Cap Cana"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5 font-sans">
              Colección / Plan de Interés
            </label>
            <select
              value={formData.plan}
              onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
              className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#D6AE36] focus:ring-1 focus:ring-[#D6AE36]"
            >
              <option value="Imperial Gold ($4,200 USD)">Imperial Gold ($4,200 USD)</option>
              <option value="Royal Heritage ($3,200 USD)">Royal Heritage ($3,200 USD)</option>
              <option value="Atelier Bespoke ($6,500 USD)">Atelier Bespoke ($6,500 USD)</option>
              <option value="Signature ($2,400 USD)">Signature ($2,400 USD)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5 font-sans">
            Notas de la Consulta / Requisitos Especiales
          </label>
          <textarea
            rows={3}
            placeholder="Desean confirmación por pases QR con control de acceso en entrada y soporte bilingüe inglés/español."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full bg-white border border-[#E5E7EB] rounded-lg p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#D6AE36] focus:ring-1 focus:ring-[#D6AE36]"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="gold" type="submit" isLoading={loading}>
            Registrar Prospecto
          </Button>
        </div>
      </form>
    </Modal>
  );
};
