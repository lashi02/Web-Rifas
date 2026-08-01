import { useState, useMemo } from 'react';
import ClientDetails from '../../_Reservations/components/ClientDetails';
import { participants, participantStats } from '../config/participants.config';

type Tab = 'all' | 'pending' | 'confirmed' | 'expired';

export default function AdminParticipantsPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('all');

  const filtered = useMemo(() => {
    return participants.filter((p) => {
      const matchesTab = activeTab === 'all' || p.status === activeTab;
      const matchesSearch = !search
        || p.name.toLowerCase().includes(search.toLowerCase())
        || p.phone.includes(search)
        || p.raffle_name.toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, search]);

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'all', label: 'Todos', count: participants.length },
    { id: 'pending', label: 'Pendientes', count: participantStats.pending },
    { id: 'confirmed', label: 'Confirmados', count: participantStats.confirmed },
    { id: 'expired', label: 'Vencidos', count: participantStats.expired },
  ];

  const statusBadge = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber/20 text-amber';
      case 'confirmed': return 'bg-green/20 text-green';
      case 'expired': return 'bg-red/20 text-red';
      default: return 'bg-neutral-700 text-neutral-400';
    }
  };

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
          <h1 class="text-2xl font-bold text-white">Participantes</h1>
          <p class="text-neutral-400">{participants.length} participantes en total</p>
        </div>
        <div class="flex gap-2">
          <span class="rounded-full bg-amber/20 px-3 py-1 text-xs font-semibold text-amber">{participantStats.pending} pendientes</span>
          <span class="rounded-full bg-green/20 px-3 py-1 text-xs font-semibold text-green">{participantStats.confirmed} confirmados</span>
          <span class="rounded-full bg-red/20 px-3 py-1 text-xs font-semibold text-red">{participantStats.expired} vencidos</span>
        </div>
      </div>

      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div class="flex gap-2 border-b border-dark-border">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id); setSearch(''); }}
              class={`border-b-2 px-4 py-3 text-sm transition-colors ${
                activeTab === t.id
                  ? 'border-gold font-semibold text-gold'
                  : 'border-transparent font-medium text-neutral-400 hover:text-white'
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>
        <div class="relative">
          <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, teléfono o rifa..."
            class="w-full rounded-lg border border-dark-border bg-dark py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-gold sm:w-72"
          />
        </div>
      </div>

      <div class="card-premium overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-dark-border text-xs uppercase tracking-wider text-neutral-500">
                <th class="px-4 py-3">Participante</th>
                <th class="px-4 py-3">Rifa</th>
                <th class="px-4 py-3">Números</th>
                <th class="px-4 py-3">Monto</th>
                <th class="px-4 py-3">Tiempo</th>
                <th class="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} class="px-4 py-12 text-center text-neutral-500">No se encontraron participantes</td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} class={`transition-colors hover:bg-dark-hover ${p.status === 'confirmed' ? 'bg-green/5' : p.status === 'expired' ? 'bg-red/5' : ''}`}>
                    <td class="px-4 py-3">
                      <ClientDetails
                        client={{
                          name: p.name,
                          phone: p.phone,
                          province: p.province,
                          beneficiary: p.beneficiary,
                          raffle: p.raffle_name,
                          numbers: p.numbers,
                          amount: p.amount,
                          time: p.time,
                          status: p.status,
                        }}
                      >
                        <div class="flex cursor-pointer items-center gap-3">
                          <div class={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                            p.status === 'pending' ? 'bg-amber/20 text-amber' :
                            p.status === 'confirmed' ? 'bg-green/20 text-green' :
                            'bg-red/20 text-red'
                          }`}>
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <p class="font-medium text-white hover:text-gold">{p.name}</p>
                            <p class="text-xs text-neutral-500">{p.phone}</p>
                          </div>
                        </div>
                      </ClientDetails>
                    </td>
                    <td class="px-4 py-3 text-neutral-300">{p.raffle_name}</td>
                    <td class="px-4 py-3">
                      <div class="flex flex-wrap gap-1">
                        {p.numbers.slice(0, 4).map((n) => (
                          <span key={n} class="rounded bg-dark px-1.5 py-0.5 text-[10px] text-neutral-400">{n}</span>
                        ))}
                        {p.numbers.length > 4 && (
                          <span class="rounded bg-dark px-1.5 py-0.5 text-[10px] text-neutral-500">+{p.numbers.length - 4}</span>
                        )}
                      </div>
                    </td>
                    <td class="px-4 py-3 font-semibold text-gold">${p.amount}</td>
                    <td class="px-4 py-3 text-neutral-500">{p.time}</td>
                    <td class="px-4 py-3">
                      <span class={`rounded-full px-2 py-1 text-xs font-semibold ${statusBadge(p.status)}`}>
                        {p.status === 'pending' ? 'Pendiente' : p.status === 'confirmed' ? 'Confirmado' : 'Vencido'}
                      </span>
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
