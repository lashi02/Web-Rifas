import type { Raffle } from '../../../../types';
import { mockRaffles } from '../../../../data/mockRaffles';
import { mockParticipants } from '../../../../data/mockParticipants';

export const stats = {
  activeRaffles: mockRaffles.filter(r => r.status === 'active').length,
  totalRaffles: mockRaffles.length,
  totalSold: mockRaffles.reduce((s, r) => s + r.sold_tickets, 0),
  totalRevenue: mockRaffles.reduce((s, r) => s + r.sold_tickets * r.ticket_price, 0),
};

export function getRaffles(): Raffle[] {
  return mockRaffles;
}

export function getRaffleById(id: string): Raffle | undefined {
  return mockRaffles.find(r => r.id === id);
}

export function getParticipantsByRaffle(raffleId: string) {
  return mockParticipants.filter(p => p.raffle_id === raffleId);
}

export function generateTickets(raffle: Raffle) {
  const soldTickets = mockParticipants
    .filter(p => p.raffle_id === raffle.id)
    .flatMap(p => p.ticket_numbers);
  const allTickets = Array.from({ length: raffle.total_tickets }, (_, i) => i + 1);
  const available = allTickets.filter(n => !soldTickets.includes(n));
  return { allTickets, soldTickets, available };
}

export const provinces = [
  'La Habana', 'Artemisa', 'Mayabeque', 'Matanzas', 'Villa Clara',
  'Cienfuegos', 'Sancti Spíritus', 'Ciego de Ávila', 'Camagüey',
  'Las Tunas', 'Holguín', 'Granma', 'Santiago de Cuba', 'Guantánamo',
  'Pinar del Río', 'Isla de la Juventud',
];
