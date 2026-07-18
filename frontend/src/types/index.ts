export interface Raffle {
  id: string;
  title: string;
  description: string;
  image_url: string;
  images: string[];
  ticket_price: number;
  total_tickets: number;
  sold_tickets: number;
  reserved_tickets: number;
  status: 'active' | 'finished' | 'cancelled';
  draw_date: string;
  created_at: string;
  rules: RaffleRules;
  social_aid_percentage: number;
  payment_methods: PaymentMethod[];
}

export interface RaffleRules {
  draw_method: string;
  reservation_limit_minutes: number;
  delivery_method: string;
  conditions: string[];
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'zelle' | 'transfer' | 'other';
  details: string;
  account_name?: string;
  account_number?: string;
  email?: string;
  instructions: string;
}

export interface Ticket {
  id: string;
  raffle_id: string;
  ticket_number: number;
  buyer_name: string;
  buyer_phone: string;
  buyer_country: 'CU' | 'US';
  buyer_province: string;
  beneficiary_name?: string;
  payment_status: 'pending' | 'completed' | 'expired';
  payment_method: string;
  amount: number;
  created_at: string;
  expires_at: string;
}

export interface NumberState {
  number: number;
  status: 'available' | 'reserved' | 'paid' | 'winner';
  holder_name?: string;
  holder_phone?: string;
  reserved_at?: string;
  paid_at?: string;
}

export interface Winner {
  id: string;
  raffle_id: string;
  ticket_number: number;
  winner_name: string;
  winner_phone: string;
  winner_province: string;
  prize: string;
  drawn_at: string;
  delivered: boolean;
  delivered_at?: string;
  delivery_photo?: string;
  delivery_video?: string;
}

export interface SocialAid {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  amount: number;
  location: string;
  published: boolean;
}

export interface Participant {
  id: string;
  raffle_id: string;
  name: string;
  phone: string;
  province: string;
  beneficiary?: string;
  ticket_numbers: number[];
  payment_status: 'confirmed' | 'pending';
  purchased_at: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'editor';
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  details: string;
  timestamp: string;
}
