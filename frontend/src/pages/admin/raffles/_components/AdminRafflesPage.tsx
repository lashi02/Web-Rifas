import { useState } from 'react';
import type { Raffle, PaymentMethod } from '../../../../types';
import RaffleTable from './RaffleTable';
import RaffleFormModal from './RaffleFormModal';

interface Props {
  initialRaffles: Raffle[];
}

export default function AdminRafflesPage({ initialRaffles }: Props) {
  const [raffles, setRaffles] = useState<Raffle[]>(initialRaffles);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Raffle | null>(null);

  const existingForValidation = raffles.map(r => ({ id: r.id, title: r.title, featured: r.featured }));

  const handleCreate = (data: any) => {
    const newRaffle: Raffle = {
      id: String(Date.now()),
      title: data.title,
      description: data.description,
      image_url: data.image_url || 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=800',
      ticket_price: data.ticket_price,
      total_tickets: data.total_tickets,
      sold_tickets: 0,
      reserved_tickets: [],
      free_tickets: Array.from({ length: data.total_tickets }, (_, i) => i + 1),
      status: data.status,
      draw_date: data.draw_date,
      created_at: new Date().toISOString(),
      featured: data.featured,
      rules: {
        draw_method: '',
        reservation_limit_minutes: data.reservation_limit_minutes,
        delivery_method: '',
        conditions: [],
      },
      social_aid_percentage: data.social_aid_percentage,
      payment_methods: data.payment_methods.map((pm: any, i: number) => ({
        id: String(Date.now() + i),
        name: pm.name,
        type: pm.type,
        details: pm.details,
        account_name: pm.account_name,
        account_number: pm.account_number,
        email: pm.email,
        instructions: pm.instructions,
      })),
    };
    setRaffles([newRaffle, ...raffles]);
    setShowCreate(false);
  };

  const handleEdit = (data: any) => {
    if (!editing) return;
    setRaffles(raffles.map((r) =>
      r.id === editing.id
        ? {
            ...r,
            title: data.title,
            description: data.description,
            image_url: data.image_url,
            ticket_price: data.ticket_price,
            total_tickets: data.total_tickets,
            draw_date: data.draw_date,
            status: data.status,
            featured: data.featured,
            social_aid_percentage: data.social_aid_percentage,
            rules: {
              ...r.rules,
              reservation_limit_minutes: data.reservation_limit_minutes,
            },
            payment_methods: data.payment_methods.map((pm: any, i: number) => ({
              id: pm.id || String(Date.now() + i),
              name: pm.name,
              type: pm.type,
              details: pm.details,
              account_name: pm.account_name,
              account_number: pm.account_number,
              email: pm.email,
              instructions: pm.instructions,
            })),
          }
        : r
    ));
    setEditing(null);
  };

  const handleDelete = (raffle: Raffle) => {
    if (confirm(`¿Eliminar la rifa "${raffle.title}"? Esta acción no se puede deshacer.`)) {
      setRaffles(raffles.filter((r) => r.id !== raffle.id));
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
          <h1 class="text-2xl font-bold text-white">Rifas</h1>
          <p class="text-neutral-400">{raffles.length} rifas en total</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          class="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-dark transition-colors hover:bg-gold-light"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Rifa
        </button>
      </div>

      <RaffleTable raffles={raffles} onEdit={setEditing} onDelete={handleDelete} />

      {showCreate && (
        <RaffleFormModal
          mode="create"
          existingRaffles={existingForValidation}
          onClose={() => setShowCreate(false)}
          onSave={handleCreate}
        />
      )}

      {editing && (
        <RaffleFormModal
          mode="edit"
          editingId={editing.id}
          existingRaffles={existingForValidation}
          initialData={{
            title: editing.title,
            description: editing.description,
            image_url: editing.image_url,
            ticket_price: editing.ticket_price,
            total_tickets: editing.total_tickets,
            draw_date: editing.draw_date,
            status: editing.status,
            social_aid_percentage: editing.social_aid_percentage,
            reservation_limit_minutes: editing.rules?.reservation_limit_minutes || 30,
            featured: editing.featured || false,
            payment_methods: (editing.payment_methods || []).map(pm => ({
              name: pm.name,
              type: pm.type,
              details: pm.details,
              account_name: pm.account_name || '',
              account_number: pm.account_number || '',
              email: pm.email || '',
              instructions: pm.instructions,
            })),
          }}
          onClose={() => setEditing(null)}
          onSave={handleEdit}
        />
      )}
    </>
  );
}
