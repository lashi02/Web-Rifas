import { useState, useMemo } from 'react';
import ClientDetails from '../../_Reservations/components/ClientDetails';

interface Participant {
  id: string;
  name: string;
  phone: string;
  province: string;
  beneficiary?: string;
  ticket_numbers: number[];
  payment_status: 'confirmed' | 'pending';
}

interface Props {
  title: string;
  description: string;
  image_url: string;
  ticket_price: number;
  total_tickets: number;
  sold_tickets: number;
  status: string;
  draw_date: string;
  created_at: string;
  participants: Participant[];
  availableNumbers: number[];
  raffleId: string;
  social_aid_percentage?: number;
}

export default function RaffleDetail({
  title,
  description,
  image_url,
  ticket_price,
  total_tickets,
  sold_tickets,
  status,
  draw_date,
  created_at,
  participants,
  availableNumbers,
  raffleId,
  social_aid_percentage,
}: Props) {
  const [showAllNumbers, setShowAllNumbers] = useState(false);
  const [search, setSearch] = useState('');
  const soldPercentage = (sold_tickets / total_tickets) * 100;
  const confirmedCount = participants.filter(p => p.payment_status === 'confirmed').length;
  const pendingCount = participants.filter(p => p.payment_status === 'pending').length;
  const totalReserved = participants.reduce((s, p) => s + p.ticket_numbers.length, 0);

  const filteredParticipants = useMemo(() => {
    if (!search) return participants;
    const q = search.toLowerCase();
    return participants.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.province.toLowerCase().includes(q)
    );
  }, [participants, search]);

  const statusBadge = (s: string) => {
    switch (s) {
      case 'active': return 'bg-green/20 text-green border-green/30';
      case 'finished': return 'bg-blue/20 text-blue border-blue/30';
      case 'cancelled': return 'bg-red/20 text-red border-red/30';
      default: return 'bg-neutral-700 text-neutral-400';
    }
  };

  const statusText = (s: string) => {
    switch (s) {
      case 'active': return 'Activa';
      case 'finished': return 'Finalizada';
      case 'cancelled': return 'Cancelada';
      default: return s;
    }
  };

  const displayNumbers = showAllNumbers ? availableNumbers : availableNumbers.slice(0, 100);

  return (
    <div class="space-y-6">
      {/* Header */}
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <a href="/admin/raffles" class="mb-2 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-gold">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a Rifas
          </a>
          <h1 class="text-2xl font-bold text-white">{title}</h1>
        </div>
        <div class="flex items-center gap-2">
          <a
            href={`/admin/reservations`}
            class="inline-flex items-center gap-2 rounded-lg border border-dark-border bg-dark-card px-4 py-2 text-sm font-medium text-neutral-300 transition-colors hover:border-gold hover:text-gold"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Ver Reservas
          </a>
        </div>
      </div>

      {/* Raffle info card */}
      <div class="card-premium overflow-hidden">
        <div class="flex flex-col sm:flex-row">
          <div class="h-48 w-full flex-shrink-0 sm:h-auto sm:w-64">
            <img src={image_url} alt={title} class="h-full w-full object-cover" />
          </div>
          <div class="flex-1 p-6">
            <div class="mb-4 flex items-center gap-3">
              <span class={`rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge(status)}`}>
                {statusText(status)}
              </span>
              <span class="text-xs text-neutral-500">Creada {new Date(created_at).toLocaleDateString('es-ES')}</span>
            </div>

            <p class="mb-4 text-sm leading-relaxed text-neutral-400">{description}</p>

            <div class="grid gap-4 sm:grid-cols-3">
              <div class="rounded-lg bg-dark p-3">
                <p class="text-xs text-neutral-500">Precio / Número</p>
                <p class="text-lg font-bold text-gold">${ticket_price.toFixed(2)}</p>
              </div>
              <div class="rounded-lg bg-dark p-3">
                <p class="text-xs text-neutral-500">Vendidos / Total</p>
                <p class="text-lg font-bold text-white">{sold_tickets} / {total_tickets}</p>
              </div>
              <div class="rounded-lg bg-dark p-3">
                <p class="text-xs text-neutral-500">Fecha del sorteo</p>
                <p class="text-lg font-bold text-white">{new Date(draw_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              {social_aid_percentage && (
                <div class="rounded-lg bg-dark p-3">
                  <p class="text-xs text-neutral-500">Ayuda Social</p>
                  <p class="text-lg font-bold text-white">{social_aid_percentage}%</p>
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div class="mt-4">
              <div class="h-2 overflow-hidden rounded-full bg-dark-border">
                <div class="h-full rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light transition-all" style={{ width: `${soldPercentage}%` }}></div>
              </div>
              <div class="mt-1 flex justify-between text-xs text-neutral-500">
                <span>{sold_tickets} vendidos ({soldPercentage.toFixed(0)}%)</span>
                <span>{total_tickets - sold_tickets} disponibles</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div class="card-premium overflow-hidden">
        <div class="flex flex-col gap-4 border-b border-dark-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="font-bold text-white">Participantes</h2>
            <p class="text-sm text-neutral-500">{participants.length} participantes · {totalReserved} números reservados</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="relative">
              <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar participante..."
                class="w-full rounded-lg border border-dark-border bg-dark py-2 pl-9 pr-3 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-gold sm:w-56"
              />
            </div>
            <div class="flex gap-2">
              <span class="rounded-full bg-green/20 px-3 py-1 text-xs font-semibold text-green">{confirmedCount} confirmados</span>
              {pendingCount > 0 && (
                <span class="rounded-full bg-amber/20 px-3 py-1 text-xs font-semibold text-amber">{pendingCount} pendientes</span>
              )}
            </div>
          </div>
        </div>

        {filteredParticipants.length === 0 ? (
          <div class="p-8 text-center text-neutral-500">
            <p>{search ? 'No se encontraron participantes con ese criterio' : 'No hay participantes en esta rifa'}</p>
          </div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead>
                <tr class="border-b border-dark-border text-xs uppercase tracking-wider text-neutral-500">
                  <th class="px-4 py-3">Participante</th>
                  <th class="px-4 py-3">Contacto</th>
                  <th class="px-4 py-3">Provincia</th>
                  <th class="px-4 py-3">Beneficiario</th>
                  <th class="px-4 py-3">Números</th>
                  <th class="px-4 py-3">Total</th>
                  <th class="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-dark-border">
                {filteredParticipants.map((p) => (
                  <tr key={p.id} class="transition-colors hover:bg-dark-hover">
                    <td class="px-4 py-3">
                      <ClientDetails
                        client={{
                          name: p.name,
                          phone: p.phone,
                          province: p.province,
                          beneficiary: p.beneficiary,
                          numbers: p.ticket_numbers,
                          amount: p.ticket_numbers.length * ticket_price,
                          status: p.payment_status,
                        }}
                      >
                        <div class="flex items-center gap-3">
                          <div class={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                            p.payment_status === 'confirmed' ? 'bg-green/20 text-green' : 'bg-amber/20 text-amber'
                          }`}>
                            {p.name.charAt(0)}
                          </div>
                          <span class="font-medium text-white hover:text-gold">{p.name}</span>
                        </div>
                      </ClientDetails>
                    </td>
                    <td class="px-4 py-3">
                      <a href={`https://wa.me/${p.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" class="text-green hover:text-green-dark">
                        {p.phone}
                      </a>
                    </td>
                    <td class="px-4 py-3 text-neutral-400">{p.province}</td>
                    <td class="px-4 py-3 text-neutral-400">{p.beneficiary || '-'}</td>
                    <td class="px-4 py-3">
                      <div class="flex flex-wrap gap-1">
                        {p.ticket_numbers.slice(0, 5).map((n) => (
                          <span key={n} class="rounded bg-dark px-1.5 py-0.5 text-[10px] text-gold">{n}</span>
                        ))}
                        {p.ticket_numbers.length > 5 && (
                          <span class="rounded bg-dark px-1.5 py-0.5 text-[10px] text-neutral-500">+{p.ticket_numbers.length - 5}</span>
                        )}
                      </div>
                    </td>
                    <td class="px-4 py-3 font-semibold text-gold">${(p.ticket_numbers.length * ticket_price).toFixed(2)}</td>
                    <td class="px-4 py-3">
                      <span class={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        p.payment_status === 'confirmed' ? 'bg-green/20 text-green' : 'bg-amber/20 text-amber'
                      }`}>
                        {p.payment_status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Available Numbers */}
      <div class="card-premium p-5">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h2 class="font-bold text-white">Números Disponibles</h2>
            <p class="text-sm text-neutral-500">{availableNumbers.length} números libres de {total_tickets}</p>
          </div>
          {availableNumbers.length > 100 && (
            <button
              onClick={() => setShowAllNumbers(!showAllNumbers)}
              class="text-sm font-medium text-gold hover:text-gold-light"
            >
              {showAllNumbers ? 'Mostrar menos' : `Ver todos (${availableNumbers.length})`}
            </button>
          )}
        </div>
        {availableNumbers.length === 0 ? (
          <p class="py-4 text-center text-neutral-500">No hay números disponibles</p>
        ) : (
          <div class="flex flex-wrap gap-1.5">
            {displayNumbers.map((n) => (
              <span key={n} class="rounded bg-dark px-2 py-1 text-xs font-medium text-neutral-300 transition-colors hover:bg-dark-hover hover:text-gold">
                {n}
              </span>
            ))}
            {!showAllNumbers && availableNumbers.length > 100 && (
              <button
                onClick={() => setShowAllNumbers(true)}
                class="rounded bg-dark px-2 py-1 text-xs font-medium text-gold hover:bg-dark-hover"
              >
                +{availableNumbers.length - 100} más
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
