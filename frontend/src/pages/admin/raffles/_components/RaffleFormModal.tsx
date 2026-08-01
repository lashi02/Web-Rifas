import { useState } from 'react';
import type { PaymentMethod } from '../../../../types';

interface PaymentMethodEntry {
  name: string;
  type: 'zelle' | 'transfer' | 'other';
  details: string;
  account_name: string;
  account_number: string;
  email: string;
  instructions: string;
}

interface RaffleFormData {
  title: string;
  description: string;
  image_url: string;
  ticket_price: number;
  total_tickets: number;
  draw_date: string;
  status: 'active' | 'finished' | 'cancelled';
  social_aid_percentage: number;
  reservation_limit_minutes: number;
  featured: boolean;
  payment_methods: PaymentMethodEntry[];
}

interface Props {
  mode: 'create' | 'edit';
  initialData?: Partial<RaffleFormData>;
  editingId?: string;
  existingRaffles: { id: string; title: string; featured?: boolean }[];
  onClose: () => void;
  onSave: (data: RaffleFormData) => void;
}

const emptyPayment: PaymentMethodEntry = {
  name: '', type: 'zelle', details: '', account_name: '',
  account_number: '', email: '', instructions: '',
};

const defaultForm: RaffleFormData = {
  title: '',
  description: '',
  image_url: '',
  ticket_price: 0,
  total_tickets: 100,
  draw_date: '',
  status: 'active',
  social_aid_percentage: 10,
  reservation_limit_minutes: 30,
  featured: false,
  payment_methods: [],
};

export default function RaffleFormModal({ mode, initialData, editingId, existingRaffles, onClose, onSave }: Props) {
  const [form, setForm] = useState<RaffleFormData>({ ...defaultForm, ...initialData });
  const [featuredError, setFeaturedError] = useState('');

  const alreadyFeatured = existingRaffles.find(r => r.featured && r.id !== editingId);

  const handleFeaturedChange = (checked: boolean) => {
    setFeaturedError('');
    if (checked && alreadyFeatured) {
      setFeaturedError(`Ya hay una rifa destacada: "${alreadyFeatured.title}". Desmárcala primero.`);
      return;
    }
    setForm({ ...form, featured: checked });
  };

  const addPayment = () => {
    setForm({
      ...form,
      payment_methods: [
        ...form.payment_methods,
        { ...emptyPayment, id: String(Date.now()) },
      ],
    });
  };

  const removePayment = (i: number) => {
    setForm({ ...form, payment_methods: form.payment_methods.filter((_, idx) => idx !== i) });
  };

  const updatePayment = (i: number, field: keyof PaymentMethodEntry, value: string) => {
    const updated = [...form.payment_methods];
    (updated[i] as any)[field] = value;
    setForm({ ...form, payment_methods: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.featured && alreadyFeatured) {
      setFeaturedError(`Ya hay una rifa destacada: "${alreadyFeatured.title}". Desmárcala primero.`);
      return;
    }
    onSave(form);
  };

  return (
    <div class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 pt-10" onClick={onClose}>
      <div class="w-full max-w-2xl rounded-2xl border border-dark-border bg-dark-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div class="mb-6 flex items-center justify-between">
          <h3 class="text-xl font-bold text-white">{mode === 'create' ? 'Nueva Rifa' : 'Editar Rifa'}</h3>
          <button onClick={onClose} class="text-neutral-500 hover:text-white">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} class="space-y-5">
          <div class="grid gap-5 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label class="mb-1 block text-sm font-medium text-neutral-400">Título *</label>
              <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Nombre de la rifa" class="w-full rounded-lg border border-dark-border bg-dark p-3 text-white outline-none placeholder:text-neutral-600 focus:border-gold" />
            </div>

            <div class="sm:col-span-2">
              <label class="mb-1 block text-sm font-medium text-neutral-400">Descripción *</label>
              <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Describe el premio..." class="w-full rounded-lg border border-dark-border bg-dark p-3 text-white outline-none placeholder:text-neutral-600 focus:border-gold" />
            </div>

            <div class="sm:col-span-2">
              <label class="mb-1 block text-sm font-medium text-neutral-400">URL de la imagen</label>
              <input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." class="w-full rounded-lg border border-dark-border bg-dark p-3 text-white outline-none placeholder:text-neutral-600 focus:border-gold" />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-400">Precio por número ($) *</label>
              <input type="number" required min={1} value={form.ticket_price} onChange={(e) => setForm({ ...form, ticket_price: Number(e.target.value) })} class="w-full rounded-lg border border-dark-border bg-dark p-3 text-white outline-none focus:border-gold" />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-400">Total de números *</label>
              <input type="number" required min={1} value={form.total_tickets} onChange={(e) => setForm({ ...form, total_tickets: Number(e.target.value) })} class="w-full rounded-lg border border-dark-border bg-dark p-3 text-white outline-none focus:border-gold" />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-400">Fecha del sorteo *</label>
              <input type="datetime-local" required value={form.draw_date} onChange={(e) => setForm({ ...form, draw_date: e.target.value })} class="w-full rounded-lg border border-dark-border bg-dark p-3 text-white outline-none focus:border-gold [color-scheme:dark]" />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-400">Estado</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} class="w-full rounded-lg border border-dark-border bg-dark p-3 text-white outline-none focus:border-gold">
                <option value="active">Activa</option>
                <option value="finished">Finalizada</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-400">% Ayuda Social</label>
              <input type="number" min={0} max={100} value={form.social_aid_percentage} onChange={(e) => setForm({ ...form, social_aid_percentage: Number(e.target.value) })} class="w-full rounded-lg border border-dark-border bg-dark p-3 text-white outline-none focus:border-gold" />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-400">Límite de reserva (minutos)</label>
              <input type="number" min={1} value={form.reservation_limit_minutes} onChange={(e) => setForm({ ...form, reservation_limit_minutes: Number(e.target.value) })} class="w-full rounded-lg border border-dark-border bg-dark p-3 text-white outline-none focus:border-gold" />
            </div>

            <div class="sm:col-span-2">
              <label class="flex items-center gap-3 rounded-lg border border-dark-border bg-dark p-4 transition-colors has-checked:border-gold has-checked:bg-gold/5">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => handleFeaturedChange(e.target.checked)}
                  class="h-5 w-5 rounded border-dark-border bg-dark text-gold accent-gold focus:ring-gold"
                />
                <div>
                  <span class="font-medium text-white">Rifa destacada</span>
                  <p class="text-xs text-neutral-500">Mostrar esta rifa como principal en la página de inicio</p>
                </div>
              </label>
              {featuredError && (
                <p class="mt-2 flex items-center gap-1 text-sm text-red">
                  <svg class="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {featuredError}
                </p>
              )}
            </div>
          </div>

          <div class="border-t border-dark-border pt-5">
            <div class="mb-4 flex items-center justify-between">
              <h4 class="font-semibold text-white">Métodos de pago</h4>
              <button type="button" onClick={addPayment} class="inline-flex items-center gap-1 rounded-lg bg-gold/20 px-3 py-1.5 text-xs font-semibold text-gold transition-colors hover:bg-gold/30">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar método
              </button>
            </div>

            {form.payment_methods.length === 0 && (
              <p class="py-3 text-center text-sm text-neutral-500">No hay métodos de pago agregados</p>
            )}

            <div class="space-y-3">
              {form.payment_methods.map((pm, i) => (
                <div key={i} class="rounded-lg border border-dark-border bg-dark p-4">
                  <div class="mb-3 flex items-center justify-between">
                    <span class="text-sm font-medium text-neutral-300">Método #{i + 1}</span>
                    <button type="button" onClick={() => removePayment(i)} class="text-red hover:text-red/80">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div class="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label class="mb-1 block text-xs text-neutral-500">Nombre *</label>
                      <input type="text" required value={pm.name} onChange={(e) => updatePayment(i, 'name', e.target.value)} placeholder="Zelle, Transferencia..." class="w-full rounded-lg border border-dark-border bg-dark-card p-2.5 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-gold" />
                    </div>
                    <div>
                      <label class="mb-1 block text-xs text-neutral-500">Tipo</label>
                      <select value={pm.type} onChange={(e) => updatePayment(i, 'type', e.target.value)} class="w-full rounded-lg border border-dark-border bg-dark-card p-2.5 text-sm text-white outline-none focus:border-gold">
                        <option value="zelle">Zelle</option>
                        <option value="transfer">Transferencia</option>
                        <option value="other">Otro</option>
                      </select>
                    </div>
                    <div class="sm:col-span-2">
                      <label class="mb-1 block text-xs text-neutral-500">Detalles *</label>
                      <input type="text" required value={pm.details} onChange={(e) => updatePayment(i, 'details', e.target.value)} placeholder="Descripción breve del método de pago" class="w-full rounded-lg border border-dark-border bg-dark-card p-2.5 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-gold" />
                    </div>
                    {pm.type === 'zelle' && (
                      <div class="sm:col-span-2">
                        <label class="mb-1 block text-xs text-neutral-500">Email Zelle</label>
                        <input type="email" value={pm.email} onChange={(e) => updatePayment(i, 'email', e.target.value)} placeholder="email@ejemplo.com" class="w-full rounded-lg border border-dark-border bg-dark-card p-2.5 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-gold" />
                      </div>
                    )}
                    {pm.type === 'transfer' && (
                      <>
                        <div>
                          <label class="mb-1 block text-xs text-neutral-500">Titular de la cuenta</label>
                          <input type="text" value={pm.account_name} onChange={(e) => updatePayment(i, 'account_name', e.target.value)} placeholder="Nombre del titular" class="w-full rounded-lg border border-dark-border bg-dark-card p-2.5 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-gold" />
                        </div>
                        <div>
                          <label class="mb-1 block text-xs text-neutral-500">Número de cuenta</label>
                          <input type="text" value={pm.account_number} onChange={(e) => updatePayment(i, 'account_number', e.target.value)} placeholder="1234567890" class="w-full rounded-lg border border-dark-border bg-dark-card p-2.5 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-gold" />
                        </div>
                      </>
                    )}
                    <div class="sm:col-span-2">
                      <label class="mb-1 block text-xs text-neutral-500">Instrucciones</label>
                      <input type="text" value={pm.instructions} onChange={(e) => updatePayment(i, 'instructions', e.target.value)} placeholder="Ej: Incluye tu nombre y los números en el concepto" class="w-full rounded-lg border border-dark-border bg-dark-card p-2.5 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-gold" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" onClick={onClose} class="flex-1 rounded-xl border border-dark-border bg-dark py-3 font-semibold text-neutral-300 transition-colors hover:text-white">Cancelar</button>
            <button type="submit" class="flex-1 rounded-xl bg-gold py-3 font-semibold text-dark transition-colors hover:bg-gold-light">
              {mode === 'create' ? 'Crear Rifa' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
