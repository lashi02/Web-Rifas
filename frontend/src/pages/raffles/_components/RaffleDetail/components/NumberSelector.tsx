import { useState } from 'react';

interface Props {
  raffleId: string;
  raffleTitle: string;
  ticketPrice: number;
  freeTickets: number[];
  reservedTickets: number[];
  whatsappNumber: string;
}

interface FormData {
  name: string;
  phone: string;
  province: string;
  beneficiary: string;
}

export default function NumberSelector({
  raffleId,
  raffleTitle,
  ticketPrice,
  freeTickets,
  reservedTickets,
  whatsappNumber,
}: Props) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [step, setStep] = useState<'select' | 'form' | 'confirm'>('select');
  const [form, setForm] = useState<FormData>({
    name: '',
    phone: '',
    province: '',
    beneficiary: '',
  });

  const totalPrice = selectedNumbers.length * ticketPrice;

  const toggleNumber = (num: number) => {
    setSelectedNumbers(prev =>
      prev.includes(num)
        ? prev.filter(n => n !== num)
        : [...prev, num]
    );
  };

  const isNumberReserved = (num: number) => reservedTickets.includes(num);

  const handleOpenForm = () => {
    if (selectedNumbers.length === 0) return;
    setStep('form');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirm');
  };

  const handleConfirm = () => {
    const message = `¡Hola! Quiero participar en la rifa "${raffleTitle}" con los siguientes números: ${[...selectedNumbers].sort((a, b) => a - b).join(', ')}. Total a pagar: $${totalPrice.toFixed(2)}. Mis datos: ${form.name}, ${form.phone}, ${form.province}${form.beneficiary ? `, Beneficiario: ${form.beneficiary}` : ''}.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    setSelectedNumbers([]);
    setForm({ name: '', phone: '', province: '', beneficiary: '' });
    setStep('select');
  };

  const handleCancel = () => {
    setSelectedNumbers([]);
    setForm({ name: '', phone: '', province: '', beneficiary: '' });
    setStep('select');
  };

  const provinces = [
    'La Habana', 'Artemisa', 'Mayabeque', 'Matanzas', 'Villa Clara',
    'Cienfuegos', 'Sancti Spíritus', 'Ciego de Ávila', 'Camagüey',
    'Las Tunas', 'Holguín', 'Granma', 'Santiago de Cuba', 'Guantánamo',
    'Pinar del Río', 'Isla de la Juventud',
  ];

  return (
    <>
      {/* Price Counter */}
      <div class="mb-4 flex items-center justify-between rounded-lg bg-dark p-4">
        <div>
          <span class="text-sm text-neutral-500">Precio por número</span>
          <p class="text-2xl font-bold text-gold">${ticketPrice.toFixed(2)}</p>
        </div>
        {selectedNumbers.length > 0 && (
          <div class="text-right">
            <span class="text-sm text-neutral-500">Total seleccionado</span>
            <p class="text-lg font-bold text-white">
              <span class="text-gold">{selectedNumbers.length}</span> números · <span class="text-gold">${totalPrice.toFixed(2)}</span>
            </p>
          </div>
        )}
      </div>

      {/* Number Grid */}
      <div class="mb-4">
        <p class="mb-3 text-sm font-semibold text-neutral-300">
          Números disponibles
          {selectedNumbers.length > 0 && (
            <span class="ml-2 text-gold">({selectedNumbers.length} seleccionados)</span>
          )}
        </p>
        <div class="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-5">
          {freeTickets.map((num) => {
            const selected = selectedNumbers.includes(num);
            const reserved = isNumberReserved(num);
            return (
              <button
                key={num}
                onClick={() => !reserved && toggleNumber(num)}
                disabled={reserved}
                class={`relative rounded-lg border p-2 text-center transition-all sm:p-3 ${
                  reserved
                    ? 'cursor-not-allowed border-dark-border bg-dark-card text-neutral-600'
                    : selected
                      ? 'border-gold bg-gold/15 text-gold shadow-glow'
                      : 'border-dark-border bg-dark text-neutral-300 hover:border-gold hover:text-gold hover:shadow-glow'
                }`}
              >
                <p class="text-base font-bold sm:text-lg">{num}</p>
                {reserved && (
                  <svg class="mx-auto h-3 w-3 text-neutral-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Select Button */}
      <button
        onClick={handleOpenForm}
        disabled={selectedNumbers.length === 0}
        class={`mb-3 w-full rounded-xl py-4 text-center text-lg font-bold transition-all ${
          selectedNumbers.length > 0
            ? 'bg-gold text-dark hover:bg-gold-light shadow-gold cursor-pointer'
            : 'cursor-not-allowed bg-dark-border text-neutral-600'
        }`}
      >
        {selectedNumbers.length > 0
          ? `Seleccionar Números (${selectedNumbers.length})`
          : 'Selecciona tus números'}
      </button>

      {/* Selected numbers summary */}
      {selectedNumbers.length > 0 && (
        <div class="mb-4 rounded-lg bg-dark p-3">
          <div class="flex flex-wrap gap-1">
            {[...selectedNumbers].sort((a, b) => a - b).map((num) => (
              <span class="inline-flex items-center gap-1 rounded bg-gold/20 px-2 py-0.5 text-xs font-semibold text-gold">
                {num}
                <button onClick={() => toggleNumber(num)} class="text-gold-dark hover:text-gold-light">
                  <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* FORM MODAL */}
      {step === 'form' && (
        <div class="fixed inset-0 z-50 overflow-y-auto bg-black/70" onClick={() => setStep('select')}>
          <div class="flex min-h-full items-start justify-center px-4 pb-8 pt-16 sm:items-center sm:p-4">
            <div class="w-full max-w-lg rounded-2xl border border-dark-border bg-dark-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div class="mb-6 flex items-center justify-between">
              <h3 class="text-xl font-bold text-white">Tus datos</h3>
              <button onClick={() => setStep('select')} class="text-neutral-500 hover:text-white">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Selected numbers summary */}
            <div class="mb-4 rounded-lg bg-dark p-3">
              <p class="mb-2 text-xs text-neutral-500">Números seleccionados</p>
              <div class="flex flex-wrap gap-1">
                {[...selectedNumbers].sort((a, b) => a - b).map((num) => (
                  <span class="rounded bg-gold/20 px-2 py-0.5 text-xs font-semibold text-gold">{num}</span>
                ))}
              </div>
              <p class="mt-2 text-right text-sm font-semibold text-gold">Total: ${totalPrice.toFixed(2)}</p>
            </div>

            <form onSubmit={handleFormSubmit} class="space-y-4">
              <div>
                <label class="mb-1 block text-sm font-medium text-neutral-400">Nombre completo *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej: Juan Pérez"
                  class="w-full rounded-lg border border-dark-border bg-dark p-3 text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-gold"
                />
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium text-neutral-400">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Ej: +53 51234567"
                  class="w-full rounded-lg border border-dark-border bg-dark p-3 text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-gold"
                />
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium text-neutral-400">Provincia / País *</label>
                <select
                  required
                  value={form.province}
                  onChange={(e) => setForm({ ...form, province: e.target.value })}
                  class="w-full rounded-lg border border-dark-border bg-dark p-3 text-white outline-none transition-colors focus:border-gold"
                >
                  <option value="" disabled>Selecciona una provincia</option>
                  <option value="EE.UU.">EE.UU.</option>
                  <option value="Otro">Otro país</option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium text-neutral-400">Beneficiario en Cuba (opcional)</label>
                <input
                  type="text"
                  value={form.beneficiary}
                  onChange={(e) => setForm({ ...form, beneficiary: e.target.value })}
                  placeholder="Nombre del beneficiario"
                  class="w-full rounded-lg border border-dark-border bg-dark p-3 text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-gold"
                />
              </div>

              <button
                type="submit"
                class="w-full rounded-xl bg-gold py-3 text-lg font-bold text-dark transition-colors hover:bg-gold-light"
              >
                Confirmar reserva
              </button>
            </form>
          </div>
        </div>
      </div>
      )}

      {/* CONFIRMATION MODAL */}
      {step === 'confirm' && (
        <div class="fixed inset-0 z-50 overflow-y-auto bg-black/70">
          <div class="flex min-h-full items-start justify-center px-4 pb-8 pt-16 sm:items-center sm:p-4">
            <div class="w-full max-w-md rounded-2xl border border-dark-border bg-dark-card p-6 shadow-xl text-center">
            <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
              <svg class="h-8 w-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h3 class="mb-2 text-xl font-bold text-white">¡Reserva casi lista!</h3>

            <div class="mb-4 rounded-lg bg-dark p-3">
              <div class="flex flex-wrap justify-center gap-1">
                {[...selectedNumbers].sort((a, b) => a - b).map((num) => (
                  <span class="rounded bg-gold/20 px-2 py-0.5 text-xs font-semibold text-gold">{num}</span>
                ))}
              </div>
            </div>

            <p class="mb-6 text-sm leading-relaxed text-neutral-400">
              Confirma tu reserva. Se te enviará una conversación con el administrador para realizar el pago. Si deseas cancelar tu reserva, comunícate de igual forma con el administrador.
            </p>

            <div class="flex gap-3">
              <button
                onClick={handleCancel}
                class="flex-1 rounded-xl border border-dark-border bg-dark py-3 font-semibold text-neutral-300 transition-colors hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green py-3 font-semibold text-white transition-colors hover:bg-green-dark"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Ir a WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
    </>
  );
}
