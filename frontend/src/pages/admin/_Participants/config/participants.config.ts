import { mockParticipants, getParticipantsByRaffle } from '../../../../data/mockParticipants';
import { mockRaffles } from '../../../../data/mockRaffles';
import { reservations } from '../../_Reservations/config/reservations.config';

export interface ParticipantEntry {
  id: string;
  raffle_name: string;
  raffle_id: string;
  name: string;
  phone: string;
  province: string;
  beneficiary?: string;
  numbers: number[];
  amount: number;
  time: string;
  status: 'pending' | 'confirmed' | 'expired';
  purchased_at: string;
}

const raffleMap = new Map(mockRaffles.map(r => [r.id, r.title]));

function buildParticipants(): ParticipantEntry[] {
  const seen = new Set<string>();
  const result: ParticipantEntry[] = [];

  // From mockParticipants
  for (const p of mockParticipants) {
    seen.add(p.id);
    const title = raffleMap.get(p.raffle_id) || 'Rifa';
    const pendingRes = reservations.find(r => r.id === p.id);
    result.push({
      id: p.id,
      raffle_name: title,
      raffle_id: p.raffle_id,
      name: p.name,
      phone: p.phone,
      province: p.province,
      beneficiary: p.beneficiary,
      numbers: p.ticket_numbers,
      amount: p.ticket_numbers.length * 50,
      time: pendingRes?.time || formatTimeAgo(p.purchased_at),
      status: p.payment_status === 'confirmed' ? 'confirmed' : 'pending',
      purchased_at: p.purchased_at,
    });
  }

  // From reservations not in mockParticipants (pending/expired ones)
  for (const r of reservations) {
    if (seen.has(r.id)) continue;
    seen.add(r.id);
    const raffleId = [...raffleMap.entries()].find(([, t]) => t === r.raffle)?.[0] || '0';
    result.push({
      id: r.id,
      raffle_name: r.raffle,
      raffle_id: raffleId,
      name: r.name,
      phone: r.phone,
      province: r.province,
      beneficiary: r.beneficiary,
      numbers: r.numbers,
      amount: r.amount,
      time: r.time,
      status: r.status,
      purchased_at: '',
    });
  }

  return result;
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours} horas`;
  return `Hace ${Math.floor(hours / 24)} días`;
}

export const participants = buildParticipants();

export const participantStats = {
  total: participants.length,
  pending: participants.filter(p => p.status === 'pending').length,
  confirmed: participants.filter(p => p.status === 'confirmed').length,
  expired: participants.filter(p => p.status === 'expired').length,
};
