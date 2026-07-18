import { useState, useMemo, useCallback, useRef, useEffect } from 'react';

type NumberStatus = 'available' | 'reserved' | 'paid' | 'winner';

interface NumberItem {
  number: number;
  status: NumberStatus;
  holder?: string;
}

interface Props {
  totalNumbers: number;
  ticketPrice: number;
  drawDate: string;
  raffleTitle: string;
  raffleId: string;
}

const statusConfig: Record<NumberStatus, { color: string; bg: string; border: string; label: string }> = {
  available: { color: 'text-green', bg: 'bg-green/10', border: 'border-green/30', label: 'Disponible' },
  reserved: { color: 'text-amber', bg: 'bg-amber/10', border: 'border-amber/30', label: 'Reservado' },
  paid: { color: 'text-neutral-600', bg: 'bg-neutral-800', border: 'border-neutral-700', label: 'Pagado' },
  winner: { color: 'text-gold', bg: 'bg-gold/20', border: 'border-gold', label: 'Ganador' },
};

// Mock data: simulate some numbers being taken
function generateMockNumbers(total: number): NumberItem[] {
  const numbers: NumberItem[] = [];
  const reserved = new Set([45, 46, 47, 77, 123, 234, 333, 444, 456, 567, 678, 789, 888, 999]);
  const paid = new Set([12, 88, 100, 201, 250, 500, 742, 777, 999]);

  for (let i = 1; i <= total; i++) {
    let status: NumberStatus = 'available';
    if (paid.has(i)) status = 'paid';
    else if (reserved.has(i)) status = 'reserved';

    numbers.push({ number: i, status });
  }
  return numbers;
}

export default function NumberSelector({ totalNumbers, ticketPrice, drawDate, raffleTitle, raffleId }: Props) {
  const [numbers, setNumbers] = useState<NumberItem[]>(() => generateMockNumbers(totalNumbers));
  const [selected, setSelected] = useState<number[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | NumberStatus>('all');
  const [showForm, setShowForm] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [reservedNumbers, setReservedNumbers] = useState<number[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const stats = useMemo(() => {
    const available = numbers.filter(n => n.status === 'available').length;
    const reservedCount = numbers.filter(n => n.status === 'reserved').length;
    const paidCount = numbers.filter(n => n.status === 'paid').length;
    return { available, reserved: reservedCount, paid: paidCount, total: numbers.length };
  }, [numbers]);

  const filteredNumbers = useMemo(() => {
    if (filterStatus === 'all') return numbers;
    return numbers.filter(n => n.status === filterStatus);
  }, [numbers, filterStatus]);

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const toggleNumber = useCallback((num: number) => {
    const item = numbers.find(n => n.number === num);
    if (!item || item.status !== 'available') return;

    setSelected(prev => {
      if (prev.includes(num)) {
        return prev.filter(n => n !== num);
      }
      return [...prev, num];
    });
  }, [numbers]);

  const selectRandom = useCallback((count: number) => {
    const available = numbers.filter(n => n.status === 'available' && !selected.includes(n.number));
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    const random = shuffled.slice(0, count).map(n => n.number);
    setSelected(prev => [...prev, ...random]);
  }, [numbers, selected]);

  const scrollToNumber = useCallback((num: number) => {
    const el = gridRef.current?.querySelector(`[data-number="${num}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-gold', 'ring-offset-2', 'ring-offset-dark');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-gold', 'ring-offset-2', 'ring-offset-dark');
      }, 2000);
    }
  }, []);

  const handleSearch = useCallback(() => {
    const num = parseInt(searchValue);
    if (num >= 1 && num <= totalNumbers) {
      scrollToNumber(num);
      if (numbers.find(n => n.number === num)?.status === 'available' && !selected.includes(num)) {
        setSelected(prev => [...prev, num]);
      }
    }
  }, [searchValue, totalNumbers, scrollToNumber, numbers, selected]);

  const handleReserve = useCallback(() => {
    if (selected.length === 0) return;
    setShowForm(true);
  }, [selected]);

  const handleFormSubmit = useCallback((formData: { name: string; phone: string; province: string; beneficiary?: string }) => {
    // Simulate reservation
    setReservedNumbers(selected);
    setNumbers(prev => prev.map(n =>
      selected.includes(n.number) ? { ...n, status: 'reserved' as NumberStatus, holder: formData.name } : n
    ));
    setSelected([]);
    setShowForm(false);
    setShowPayment(true);
  }, [selected]);

  const selectedTotal = selected.length * ticketPrice;

  if (showPayment) {
    return (
      <PaymentInstructions
        numbers={reservedNumbers}
        total={reservedNumbers.length * ticketPrice}
        raffleTitle={raffleTitle}
        raffleId={raffleId}
        onClose={() => setShowPayment(false)}
      />
    );
  }

  if (showForm) {
    return (
      <ReservationForm
        selectedNumbers={[...selected].sort((a, b) => a - b)}
        total={selectedTotal}
        ticketPrice={ticketPrice}
        onSubmit={handleFormSubmit}
        onBack={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Selecciona tus Números</h2>
        <p className="mt-1 text-neutral-400">
          Haz clic en los números disponibles para seleccionarlos
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-dark p-3 text-center">
          <p className="text-2xl font-bold text-green">{stats.available}</p>
          <p className="text-xs text-neutral-500">Disponibles</p>
        </div>
        <div className="rounded-lg bg-dark p-3 text-center">
          <p className="text-2xl font-bold text-amber">{stats.reserved}</p>
          <p className="text-xs text-neutral-500">Reservados</p>
        </div>
        <div className="rounded-lg bg-dark p-3 text-center">
          <p className="text-2xl font-bold text-neutral-600">{stats.paid}</p>
          <p className="text-xs text-neutral-500">Pagados</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={searchRef}
            type="number"
            min={1}
            max={totalNumbers}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={`Buscar número (1-${totalNumbers})`}
            className="w-full rounded-lg border border-dark-border bg-dark px-4 py-3 pl-10 text-white placeholder-neutral-500 focus:border-gold focus:outline-none"
          />
          <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <button
          onClick={handleSearch}
          className="rounded-lg bg-gold px-4 py-3 font-semibold text-dark transition-colors hover:bg-gold-light"
        >
          Buscar
        </button>
      </div>

      {/* Filters + Random */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(['all', 'available', 'reserved', 'paid'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                filterStatus === status
                  ? status === 'available' ? 'bg-green/20 text-green' :
                    status === 'reserved' ? 'bg-amber/20 text-amber' :
                    status === 'paid' ? 'bg-neutral-700 text-neutral-300' :
                    'bg-gold/20 text-gold'
                  : 'bg-dark text-neutral-400 hover:text-white'
              }`}
            >
              {status === 'all' ? 'Todos' : statusConfig[status].label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {[3, 5, 10].map((count) => (
            <button
              key={count}
              onClick={() => selectRandom(count)}
              className="rounded-lg border border-dark-border bg-dark px-3 py-2 text-sm text-neutral-300 transition-colors hover:border-gold hover:text-gold"
            >
              +{count} random
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-neutral-500">
        {(Object.entries(statusConfig) as [NumberStatus, typeof statusConfig[NumberStatus]][]).map(([status, config]) => (
          <div key={status} className="flex items-center gap-1.5">
            <span className={`h-3 w-3 rounded ${config.bg} border ${config.border}`}></span>
            <span>{config.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-blue/30 border border-blue"></span>
          <span>Seleccionado</span>
        </div>
      </div>

      {/* Number Grid */}
      <div
        ref={gridRef}
        className="grid max-h-[500px] grid-cols-5 gap-1.5 overflow-y-auto rounded-xl border border-dark-border bg-dark p-3 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12"
      >
        {filteredNumbers.map((item) => {
          const isSelected = selectedSet.has(item.number);
          const isAvailable = item.status === 'available';

          return (
            <button
              key={item.number}
              data-number={item.number}
              onClick={() => toggleNumber(item.number)}
              disabled={!isAvailable}
              className={`
                relative flex h-10 items-center justify-center rounded-lg text-sm font-medium transition-all
                ${isSelected
                  ? 'bg-blue/20 border border-blue text-blue scale-105 shadow-lg shadow-blue/20'
                  : isAvailable
                    ? 'bg-dark-card border border-dark-border text-neutral-300 hover:border-green hover:bg-green/10 hover:text-green cursor-pointer'
                    : item.status === 'reserved'
                      ? 'bg-amber/10 border border-amber/30 text-amber/60 cursor-not-allowed'
                      : item.status === 'paid'
                        ? 'bg-neutral-800 border border-neutral-700 text-neutral-600 cursor-not-allowed'
                        : 'bg-gold/20 border border-gold text-gold cursor-not-allowed'
                }
              `}
              title={isAvailable ? `Número ${item.number} - Disponible` : `${item.number} - ${statusConfig[item.status].label}`}
            >
              {item.number}
              {isSelected && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue text-[8px] text-white">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Cart Summary - Sticky on mobile */}
      {selected.length > 0 && (
        <div className="sticky bottom-0 z-10 rounded-xl border border-gold/30 bg-dark-card p-4 shadow-lg shadow-gold/10">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">Seleccionados</p>
              <p className="text-lg font-bold text-white">
                {selected.length} {selected.length === 1 ? 'número' : 'números'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Total a pagar</p>
              <p className="text-2xl font-bold text-gold">${selectedTotal.toFixed(2)}</p>
            </div>
          </div>

          <div className="mb-3 flex flex-wrap gap-1">
            {[...selected].sort((a, b) => a - b).slice(0, 20).map((num) => (
              <span key={num} className="rounded bg-blue/20 px-2 py-0.5 text-xs font-medium text-blue">
                {num}
              </span>
            ))}
            {selected.length > 20 && (
              <span className="rounded bg-dark px-2 py-0.5 text-xs text-neutral-500">
                +{selected.length - 20} más
              </span>
            )}
          </div>

          <button
            onClick={handleReserve}
            className="w-full rounded-xl bg-gold py-3 text-lg font-bold text-dark transition-colors hover:bg-gold-light"
          >
            Reservar Números
          </button>
        </div>
      )}
    </div>
  );
}


// --- Sub-components ---

function ReservationForm({
  selectedNumbers,
  total,
  ticketPrice,
  onSubmit,
  onBack,
}: {
  selectedNumbers: number[];
  total: number;
  ticketPrice: number;
  onSubmit: (data: { name: string; phone: string; province: string; beneficiary?: string }) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [isFromUS, setIsFromUS] = useState(false);

  const provinces = [
    'La Habana', 'Santiago de Cuba', 'Camagüey', 'Holguín', 'Santa Clara',
    'Guantánamo', 'Bayamo', 'Las Tunas', 'Cienfuegos', 'Pinar del Río',
    'Matanzas', 'Ciego de Ávila', 'Sancti Spíritus', 'Trinidad', 'Otro (EE.UU.)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !province) return;
    onSubmit({ name, phone, province, beneficiary: isFromUS ? beneficiary : undefined });
  };

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-gold hover:text-gold-light">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Volver a selección
      </button>

      <div className="card-premium p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Tus Números Seleccionados</h2>
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedNumbers.map((num) => (
            <span key={num} className="rounded-lg bg-blue/20 px-3 py-1.5 text-sm font-semibold text-blue">
              {num}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between rounded-lg bg-dark p-4">
          <span className="text-neutral-400">Total a pagar</span>
          <span className="text-2xl font-bold text-gold">${total.toFixed(2)}</span>
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          {selectedNumbers.length} × ${ticketPrice.toFixed(2)} = ${total.toFixed(2)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-premium space-y-4 p-6">
        <h2 className="text-xl font-bold text-white">Tus Datos</h2>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-300">Nombre completo *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ej: Carlos García"
            className="w-full rounded-lg border border-dark-border bg-dark px-4 py-3 text-white placeholder-neutral-500 focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-300">WhatsApp / Teléfono *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="Ej: +53 5555 1234"
            className="w-full rounded-lg border border-dark-border bg-dark px-4 py-3 text-white placeholder-neutral-500 focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-300">Provincia / País *</label>
          <select
            value={province}
            onChange={(e) => {
              setProvince(e.target.value);
              setIsFromUS(e.target.value === 'Otro (EE.UU.)');
            }}
            required
            className="w-full rounded-lg border border-dark-border bg-dark px-4 py-3 text-white focus:border-gold focus:outline-none"
          >
            <option value="">Selecciona una opción</option>
            {provinces.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {isFromUS && (
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-300">
              Nombre del beneficiario en Cuba
            </label>
            <input
              type="text"
              value={beneficiary}
              onChange={(e) => setBeneficiary(e.target.value)}
              placeholder="Nombre de quien recibe el premio"
              className="w-full rounded-lg border border-dark-border bg-dark px-4 py-3 text-white placeholder-neutral-500 focus:border-gold focus:outline-none"
            />
            <p className="mt-1 text-xs text-neutral-500">
              Si pagas desde EE.UU. para un familiar en Cuba, indica su nombre
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-xl bg-gold py-4 text-lg font-bold text-dark transition-colors hover:bg-gold-light"
        >
          Confirmar Reserva
        </button>
      </form>
    </div>
  );
}


function PaymentInstructions({
  numbers,
  total,
  raffleTitle,
  raffleId,
  onClose,
}: {
  numbers: number[];
  total: number;
  raffleTitle: string;
  raffleId: string;
  onClose: () => void;
}) {
  const numbersStr = numbers.join(', ');
  const whatsappMessage = encodeURIComponent(
    `Hola, reservé los números ${numbersStr} en la rifa "${raffleTitle}". Aquí envío comprobante de pago. Total: $${total.toFixed(2)}`
  );
  const whatsappUrl = `https://wa.me/1234567890?text=${whatsappMessage}`;

  return (
    <div className="space-y-6">
      <div className="card-premium border-glow p-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green/20">
          <svg className="h-8 w-8 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-white">¡Números Reservados!</h2>
        <p className="text-neutral-400">
          Tus números están reservados por <span className="font-semibold text-amber">30 minutos</span>.
          No estarán confirmados hasta que verifiquemos tu pago.
        </p>
      </div>

      <div className="card-premium p-6">
        <h3 className="mb-4 text-lg font-bold text-white">Tus Números Reservados</h3>
        <div className="mb-4 flex flex-wrap gap-2">
          {numbers.map((num) => (
            <span key={num} className="rounded-lg bg-amber/20 px-3 py-1.5 text-sm font-semibold text-amber">
              {num}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between rounded-lg bg-dark p-4">
          <span className="text-neutral-400">Total a pagar</span>
          <span className="text-2xl font-bold text-gold">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="card-premium p-6">
        <h3 className="mb-4 text-lg font-bold text-white">Instrucciones de Pago</h3>

        <div className="space-y-4">
          <div className="rounded-lg bg-dark p-4">
            <p className="mb-2 text-sm font-semibold text-gold">Opción 1: Zelle</p>
            <p className="text-sm text-neutral-400">
              <span className="font-medium text-white">Nombre:</span> [Tu nombre receptor]
            </p>
            <p className="text-sm text-neutral-400">
              <span className="font-medium text-white">Email:</span> [tu@email.com]
            </p>
            <p className="mt-2 text-xs text-amber">
              Incluye en el concepto: "{numbersStr}"
            </p>
          </div>

          <div className="rounded-lg bg-dark p-4">
            <p className="mb-2 text-sm font-semibold text-gold">Opción 2: Transferencia Bancaria</p>
            <p className="text-sm text-neutral-400">
              [Datos de cuenta bancaria]
            </p>
          </div>

          <div className="rounded-lg border border-amber/30 bg-amber/10 p-4">
            <p className="text-sm font-semibold text-amber">⚠️ Importante</p>
            <p className="mt-1 text-xs text-neutral-400">
              Revisa el monto y los datos antes de enviar. Los pagos incorrectos no se pueden reembolsar.
              Envía el comprobante por WhatsApp para confirmar tu reserva.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-green py-4 text-lg font-bold text-white transition-colors hover:bg-green-dark"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Enviar Comprobante por WhatsApp
        </a>

        <button
          onClick={onClose}
          className="w-full rounded-xl border border-dark-border bg-dark py-3 font-semibold text-neutral-300 transition-colors hover:border-gold hover:text-gold"
        >
          Volver a la Rifa
        </button>
      </div>

      <p className="text-center text-xs text-neutral-500">
        Tu reserva expira en 30 minutos si no se confirma el pago.
        Los números volverán a estar disponibles para otros participantes.
      </p>
    </div>
  );
}
