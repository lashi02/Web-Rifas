import type { Winner } from '../types';

export const mockWinners: Winner[] = [
  {
    id: '1',
    raffle_id: 'prev-1',
    ticket_number: 234,
    winner_name: 'María G.',
    winner_phone: '+1 (305) 555-0123',
    winner_province: 'La Habana',
    prize: 'iPhone 15 Pro Max 256GB',
    drawn_at: '2026-06-15T20:00:00',
    delivered: true,
    delivered_at: '2026-06-18T14:00:00',
    delivery_photo: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=400',
  },
  {
    id: '2',
    raffle_id: 'prev-2',
    ticket_number: 891,
    winner_name: 'Carlos R.',
    winner_phone: '+53 5555 4321',
    winner_province: 'Santiago de Cuba',
    prize: 'Samsung Smart TV 55" QLED',
    drawn_at: '2026-06-01T20:00:00',
    delivered: true,
    delivered_at: '2026-06-05T10:00:00',
    delivery_photo: 'https://images.unsplash.com/photo-1574263867128-a3d5c1b1decc?w=400',
  },
  {
    id: '3',
    raffle_id: 'prev-3',
    ticket_number: 156,
    winner_name: 'Ana L.',
    winner_phone: '+53 5555 8765',
    winner_province: 'Camagüey',
    prize: 'PlayStation 5 + 2 Juegos',
    drawn_at: '2026-05-20T20:00:00',
    delivered: true,
    delivered_at: '2026-05-24T16:00:00',
    delivery_photo: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400',
  },
  {
    id: '4',
    raffle_id: 'prev-4',
    ticket_number: 423,
    winner_name: 'Roberto M.',
    winner_phone: '+1 (786) 555-9876',
    winner_province: 'Santa Clara',
    prize: 'MacBook Air M2',
    drawn_at: '2026-05-10T20:00:00',
    delivered: true,
    delivered_at: '2026-05-14T11:00:00',
    delivery_photo: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
  },
  {
    id: '5',
    raffle_id: 'prev-5',
    ticket_number: 678,
    winner_name: 'Laura P.',
    winner_phone: '+53 5555 3456',
    winner_province: 'Holguín',
    prize: 'Samsung Galaxy S23 Ultra',
    drawn_at: '2026-04-28T20:00:00',
    delivered: true,
    delivered_at: '2026-05-02T09:00:00',
    delivery_photo: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
  },
  {
    id: '6',
    raffle_id: 'prev-6',
    ticket_number: 999,
    winner_name: 'Pedro S.',
    winner_phone: '+53 5555 9012',
    winner_province: 'Guantánamo',
    prize: 'Smart TV LG 50" OLED',
    drawn_at: '2026-04-15T20:00:00',
    delivered: true,
    delivered_at: '2026-04-19T15:00:00',
    delivery_photo: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
  },
];

export function getRecentWinners(limit: number = 6): Winner[] {
  return mockWinners
    .sort((a, b) => new Date(b.drawn_at).getTime() - new Date(a.drawn_at).getTime())
    .slice(0, limit);
}

export function getWinnerStats() {
  return {
    totalWinners: mockWinners.length,
    totalPrizes: '$15,000+',
    provinces: new Set(mockWinners.map(w => w.winner_province)).size,
    allDelivered: mockWinners.every(w => w.delivered),
  };
}
