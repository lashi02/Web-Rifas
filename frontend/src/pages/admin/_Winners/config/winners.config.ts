import { mockRaffles } from '../../../../data/mockRaffles';
import { participants, type ParticipantEntry } from '../../_Participants/config/participants.config';

export interface WinnerEntry {
  raffle_id: string;
  raffle_title: string;
  ticket_price: number;
  draw_date: string;
  winner_ticket_number: number;
  participant: ParticipantEntry;
}

export function getWinners(): WinnerEntry[] {
  return mockRaffles
    .filter(r => r.winner_id)
    .map(r => {
      const p = participants.find(p => p.id === r.winner_id);
      if (!p) return null;
      return {
        raffle_id: r.id,
        raffle_title: r.title,
        ticket_price: r.ticket_price,
        draw_date: r.draw_date,
        winner_ticket_number: r.winner_ticket_number!,
        participant: p,
      };
    })
    .filter((w): w is WinnerEntry => w !== null)
    .sort((a, b) => new Date(b.draw_date).getTime() - new Date(a.draw_date).getTime());
}
