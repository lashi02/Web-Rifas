export const dashboardStats = {
  activeRaffles: 6,
  pendingReservations: 12,
  soldToday: 47,
  totalParticipants: 342,
  estimatedRevenue: '$17,100',
};

export const pendingReservations = [
  { id: '1', raffle: 'EcoFlow Delta 2', name: 'Pedro S.', phone: '+53 5555 9012', numbers: [155, 288], amount: 100, time: 'Hace 15 min', status: 'pending' },
  { id: '2', raffle: 'PS5 + 3 Juegos', name: 'Rosa M.', phone: '+53 5555 1111', numbers: [42, 87, 156], amount: 90, time: 'Hace 32 min', status: 'pending' },
  { id: '3', raffle: 'EcoFlow Delta 2', name: 'Juan P.', phone: '+1 (305) 555-2222', numbers: [777], amount: 50, time: 'Hace 1 hora', status: 'pending' },
  { id: '4', raffle: 'Viaje Cancún', name: 'María L.', phone: '+53 5555 3333', numbers: [50, 51, 52, 53, 54], amount: 500, time: 'Hace 2 horas', status: 'pending' },
];

export const recentActivity = [
  { action: 'Pago aprobado', detail: 'Carlos M. - EcoFlow Delta 2 - #45,46,47', time: 'Hace 5 min' },
  { action: 'Nueva reserva', detail: 'Pedro S. - EcoFlow Delta 2 - #155,288', time: 'Hace 15 min' },
  { action: 'Pago aprobado', detail: 'Ana P. - EcoFlow Delta 2 - #99,100,201', time: 'Hace 1 hora' },
  { action: 'Reserva vencida', detail: 'Luis R. - PS5 - #321 (sin pago)', time: 'Hace 2 horas' },
  { action: 'Nuevo participante', detail: 'María G. - EcoFlow Delta 2 - #77,234', time: 'Hace 3 horas' },
];
