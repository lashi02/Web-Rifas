import { useState, useMemo } from 'react';
import ClientDetails from '../../_Reservations/components/ClientDetails';
import { getWinners } from '../config/winners.config';

export default function AdminWinnersPage() {
  const [search, setSearch] = useState('');

  const winners = useMemo(() => getWinners(), []);

  const filtered = useMemo(() => {
    if (!search) return winners;
    const q = search.toLowerCase();
    return winners.filter(w =>
      w.participant.name.toLowerCase().includes(q)
      || w.participant.phone.includes(q)
      || w.raffle_title.toLowerCase().includes(q)
    );
  }, [winners, search]);

  return (
    <>
      <div class="mb-6 flex items-center justify-between">
        <div>
          <a href="/admin" class="mb-2 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-gold">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </a>
          <h1 class="text-2xl font-bold text-white">Ganadores</h1>
          <p class="text-neutral-400">{winners.length} ganadores registrados</p>
        </div>
        <div class="relative">
          <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar ganador o rifa..."
            class="w-full rounded-lg border border-dark-border bg-dark py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-gold sm:w-72"
          />
        </div>
      </div>

      <div class="card-premium overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-dark-border text-xs uppercase tracking-wider text-neutral-500">
                <th class="px-4 py-3">Ganador</th>
                <th class="px-4 py-3">Rifa</th>
                <th class="px-4 py-3">Número Ganador</th>
                <th class="px-4 py-3">Premio</th>
                <th class="px-4 py-3">Sorteado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} class="px-4 py-12 text-center text-neutral-500">No se encontraron ganadores</td>
                </tr>
              ) : (
                filtered.map((w) => (
                  <tr key={w.raffle_id} class="transition-colors hover:bg-dark-hover">
                    <td class="px-4 py-3">
                      <ClientDetails
                        client={{
                          name: w.participant.name,
                          phone: w.participant.phone,
                          province: w.participant.province,
                          beneficiary: w.participant.beneficiary,
                          raffle: w.raffle_title,
                          numbers: w.participant.numbers,
                          amount: w.participant.amount,
                          time: w.participant.time,
                          status: 'confirmed',
                        }}
                      >
                        <div class="flex cursor-pointer items-center gap-3">
                          <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">
                            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                            </svg>
                          </div>
                          <div>
                            <p class="font-medium text-white hover:text-gold">{w.participant.name}</p>
                            <p class="text-xs text-neutral-500">{w.participant.phone}</p>
                          </div>
                        </div>
                      </ClientDetails>
                    </td>
                    <td class="px-4 py-3 text-neutral-300">{w.raffle_title}</td>
                    <td class="px-4 py-3">
                      <span class="rounded-full bg-gold/20 px-3 py-1 text-xs font-bold text-gold">#{w.winner_ticket_number}</span>
                    </td>
                    <td class="px-4 py-3 font-semibold text-white">
                      <span class="text-gold">${w.participant.amount}</span>
                      <span class="text-neutral-500"> en boletos</span>
                    </td>
                    <td class="px-4 py-3 text-neutral-500">
                      {new Date(w.draw_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
