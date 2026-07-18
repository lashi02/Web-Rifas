export interface Raffle {
  id: string;
  title: string;
  description: string;
  image_url: string;
  ticket_price: number;
  total_tickets: number;
  sold_tickets: number;
  status: 'active' | 'finished' | 'cancelled';
  draw_date: string;
  created_at: string;
}

export interface Ticket {
  id: string;
  raffle_id: string;
  ticket_number: number;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  payment_status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface Winner {
  id: string;
  raffle_id: string;
  ticket_id: string;
  winner_name: string;
  winner_email: string;
  drawn_at: string;
}
