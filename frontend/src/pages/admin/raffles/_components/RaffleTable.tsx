import { useState } from 'react';
import type { Raffle } from '../../../../types';

interface Props {
  raffles: Raffle[];
  onEdit: (raffle: Raffle) => void;
  onDelete: (raffle: Raffle) => void;
}

export default function RaffleTable({ raffles, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'finished' | 'cancelled'>('all');

  const filtered = raffles.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green/20 text-green';
      case 'finished': return 'bg-blue/20 text-blue';
      case 'cancelled': return 'bg-red/20 text-red';
      default: return 'bg-neutral-700 text-neutral-400';
    }
  };

  return (
    <div class="space-y-4">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="relative flex-1">
          <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar rifas..."
            class="w-full rounded-lg border border-dark-border bg-dark py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-gold"
          />
        </div>
        <div class="flex gap-2">
          {(['all', 'active', 'finished', 'cancelled'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              class={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                statusFilter === s
                  ? 'bg-gold/20 text-gold'
                  : 'bg-dark text-neutral-400 hover:text-white'
              }`}
            >
              {s === 'all' ? 'Todas' : s === 'active' ? 'Activas' : s === 'finished' ? 'Finalizadas' : 'Canceladas'}
            </button>
          ))}
        </div>
      </div>

      <div class="card-premium overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-dark-border text-xs uppercase tracking-wider text-neutral-500">
                <th class="px-4 py-3">Rifa</th>
                <th class="px-4 py-3">Precio</th>
                <th class="px-4 py-3">Vendidos</th>
                <th class="px-4 py-3">Total</th>
                <th class="px-4 py-3">Estado</th>
                <th class="px-4 py-3">Sorteo</th>
                <th class="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} class="px-4 py-12 text-center text-neutral-500">No se encontraron rifas</td>
                </tr>
              ) : (
                filtered.map((raffle) => (
                  <tr key={raffle.id} class="transition-colors hover:bg-dark-hover">
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-3">
                        <div class="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-dark">
                          <img src={raffle.image_url} alt="" class="h-full w-full object-cover" />
                        </div>
                        <div>
                          <a href={`/admin/raffles/${raffle.id}`} class="font-medium text-white hover:text-gold">{raffle.title}</a>
                          <p class="text-xs text-neutral-500">Creada {new Date(raffle.created_at).toLocaleDateString('es-ES')}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3 font-semibold text-gold">${raffle.ticket_price.toFixed(2)}</td>
                    <td class="px-4 py-3 text-white">{raffle.sold_tickets}</td>
                    <td class="px-4 py-3 text-neutral-400">{raffle.total_tickets}</td>
                    <td class="px-4 py-3">
                      <span class={`rounded-full px-2 py-1 text-xs font-semibold ${statusBadge(raffle.status)}`}>
                        {raffle.status === 'active' ? 'Activa' : raffle.status === 'finished' ? 'Finalizada' : 'Cancelada'}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-neutral-400">
                      {new Date(raffle.draw_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </td>
                    <td class="px-4 py-3 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <a
                          href={`/admin/raffles/${raffle.id}`}
                          class="rounded-lg bg-dark p-2 text-neutral-400 transition-colors hover:bg-dark-hover hover:text-white"
                          title="Ver detalles"
                        >
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </a>
                        <button
                          onClick={() => onEdit(raffle)}
                          class="rounded-lg bg-dark p-2 text-neutral-400 transition-colors hover:bg-dark-hover hover:text-gold"
                          title="Editar"
                        >
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDelete(raffle)}
                          class="rounded-lg bg-dark p-2 text-neutral-400 transition-colors hover:bg-dark-hover hover:text-red"
                          title="Eliminar"
                        >
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
