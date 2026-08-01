import { useState, useEffect, useMemo } from 'react';
import ClientDetails from './ClientDetails';
import ReservationActions from './ReservationActions';

interface Reservation {
  id: string;
  raffle: string;
  name: string;
  phone: string;
  province: string;
  beneficiary?: string;
  numbers: number[];
  amount: number;
  time: string;
  status: 'pending' | 'confirmed' | 'expired';
}

interface Props {
  initialReservations: Reservation[];
}

type Tab = 'all' | 'pending' | 'confirmed' | 'expired';

export default function AdminReservationsPage({ initialReservations }: Props) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as Tab | null;
    const searchParam = params.get('search');
    if (tabParam && ['all', 'pending', 'confirmed', 'expired'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    if (searchParam) {
      setSearch(searchParam);
    }
    setInitialized(true);
  }, [initialized]);

  const updateUrl = (tab: Tab, q: string) => {
    const params = new URLSearchParams();
    if (tab !== 'all') params.set('tab', tab);
    if (q) params.set('search', q);
    const url = params.toString() ? `/admin/reservations?${params.toString()}` : '/admin/reservations';
    window.history.replaceState(null, '', url);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSearch('');
    updateUrl(tab, '');
  };

  const handleSearchChange = (q: string) => {
    setSearch(q);
    updateUrl(activeTab, q);
  };

  const filtered = useMemo(() => {
    return initialReservations.filter((r) => {
      const matchesTab = activeTab === 'all' || r.status === activeTab;
      const matchesSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.phone.includes(search);
      return matchesTab && matchesSearch;
    });
  }, [initialReservations, activeTab, search]);

  const pending = initialReservations.filter(r => r.status === 'pending');
  const confirmed = initialReservations.filter(r => r.status === 'confirmed');
  const expired = initialReservations.filter(r => r.status === 'expired');

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'all', label: 'Todas', count: initialReservations.length },
    { id: 'pending', label: 'Pendientes', count: pending.length },
    { id: 'confirmed', label: 'Confirmadas', count: confirmed.length },
    { id: 'expired', label: 'Vencidas', count: expired.length },
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
          <h1 class="text-2xl font-bold text-white">Todas las Reservas</h1>
          <p class="text-neutral-400">{initialReservations.length} reservas en total</p>
        </div>
        <div class="flex gap-2">
          <span class="rounded-full bg-amber/20 px-3 py-1 text-xs font-semibold text-amber">{pending.length} pendientes</span>
          <span class="rounded-full bg-green/20 px-3 py-1 text-xs font-semibold text-green">{confirmed.length} confirmadas</span>
          <span class="rounded-full bg-red/20 px-3 py-1 text-xs font-semibold text-red">{expired.length} vencidas</span>
        </div>
      </div>

      {/* Tabs + Search */}
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div class="flex gap-2 border-b border-dark-border">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
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
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Buscar por nombre o teléfono..."
            class="w-full rounded-lg border border-dark-border bg-dark py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-gold sm:w-72"
          />
        </div>
      </div>

      {/* Table */}
      <div class="card-premium overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-dark-border text-xs uppercase tracking-wider text-neutral-500">
                <th class="px-4 py-3">Cliente</th>
                <th class="px-4 py-3">Rifa</th>
                <th class="px-4 py-3">Números</th>
                <th class="px-4 py-3">Monto</th>
                <th class="px-4 py-3">Tiempo</th>
                <th class="px-4 py-3">Estado</th>
                <th class="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} class="px-4 py-12 text-center text-neutral-500">No se encontraron reservas</td>
                </tr>
              ) : (
                filtered.map((res) => (
                  <tr key={res.id} class={`transition-colors hover:bg-dark-hover ${res.status === 'confirmed' ? 'bg-green/5' : res.status === 'expired' ? 'bg-red/5' : ''}`}>
                    <td class="px-4 py-3">
                      <ClientDetails client={res}>
                        <div class="flex cursor-pointer items-center gap-3">
                          <div class={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                            res.status === 'pending' ? 'bg-amber/20 text-amber' :
                            res.status === 'confirmed' ? 'bg-green/20 text-green' :
                            'bg-red/20 text-red'
                          }`}>
                            {res.name.charAt(0)}
                          </div>
                          <div>
                            <p class="font-medium text-white hover:text-gold">{res.name}</p>
                            <p class="text-xs text-neutral-500">{res.phone}</p>
                          </div>
                        </div>
                      </ClientDetails>
                    </td>
                    <td class="px-4 py-3 text-neutral-300">{res.raffle}</td>
                    <td class="px-4 py-3">
                      <div class="flex flex-wrap gap-1">
                        {res.numbers.slice(0, 4).map((n) => (
                          <span key={n} class="rounded bg-dark px-1.5 py-0.5 text-[10px] text-neutral-400">{n}</span>
                        ))}
                        {res.numbers.length > 4 && (
                          <span class="rounded bg-dark px-1.5 py-0.5 text-[10px] text-neutral-500">+{res.numbers.length - 4}</span>
                        )}
                      </div>
                    </td>
                    <td class="px-4 py-3 font-semibold text-gold">${res.amount}</td>
                    <td class="px-4 py-3 text-neutral-500">{res.time}</td>
                    <td class="px-4 py-3">
                      <span class={`rounded-full px-2 py-1 text-xs font-semibold ${statusBadge(res.status)}`}>
                        {res.status === 'pending' ? 'Pendiente' : res.status === 'confirmed' ? 'Confirmado' : 'Vencido'}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <ReservationActions
                        reservation={res}
                        onApprove={(id) => console.log('Aprobar:', id)}
                        onCancel={(id, reason) => console.log('Cancelar:', id, reason)}
                      />
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
