export const reservations = [
  { id: '1', raffle: 'EcoFlow Delta 2', name: 'Pedro S.', phone: '+53 5555 9012', province: 'Santa Clara', numbers: [155, 288], amount: 100, time: 'Hace 15 min', status: 'pending' },
  { id: '2', raffle: 'PS5 + 3 Juegos', name: 'Rosa M.', phone: '+53 5555 1111', province: 'La Habana', numbers: [42, 87, 156], amount: 90, time: 'Hace 32 min', status: 'pending' },
  { id: '3', raffle: 'EcoFlow Delta 2', name: 'Juan P.', phone: '+1 (305) 555-2222', province: 'Otro (EE.UU.)', beneficiary: 'Familia Pérez - Camagüey', numbers: [777], amount: 50, time: 'Hace 1 hora', status: 'pending' },
  { id: '4', raffle: 'Viaje Cancún', name: 'María L.', phone: '+53 5555 3333', province: 'Holguín', numbers: [50, 51, 52, 53, 54], amount: 500, time: 'Hace 2 horas', status: 'pending' },
  { id: '5', raffle: 'EcoFlow Delta 2', name: 'Carlos M.', phone: '+53 5555 1234', province: 'La Habana', numbers: [45, 46, 47, 123, 456], amount: 250, time: 'Hace 3 horas', status: 'confirmed' },
  { id: '6', raffle: 'EcoFlow Delta 2', name: 'María G.', phone: '+1 (305) 555-0123', province: 'Otro (EE.UU.)', beneficiary: 'Pedro García - Santiago de Cuba', numbers: [77, 234, 567, 891], amount: 200, time: 'Hace 5 horas', status: 'confirmed' },
  { id: '7', raffle: 'EcoFlow Delta 2', name: 'Roberto L.', phone: '+53 5555 5678', province: 'Camagüey', numbers: [12, 88, 333], amount: 150, time: 'Hace 6 horas', status: 'confirmed' },
  { id: '8', raffle: 'PS5 + 3 Juegos', name: 'Ana P.', phone: '+1 (786) 555-0456', province: 'Otro (EE.UU.)', beneficiary: 'Familia Pérez - Holguín', numbers: [99, 100, 201, 444, 678, 999], amount: 180, time: 'Hace 8 horas', status: 'confirmed' },
  { id: '9', raffle: 'MacBook Air M3', name: 'Laura R.', phone: '+53 5555 3456', province: 'Guantánamo', numbers: [50, 51, 52, 53, 54, 55, 56, 57, 58, 59], amount: 750, time: 'Ayer', status: 'confirmed' },
  { id: '10', raffle: 'Galaxy S24 Ultra', name: 'José D.', phone: '+1 (212) 555-0789', province: 'Otro (EE.UU.)', beneficiary: 'María Díaz - Las Tunas', numbers: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100], amount: 400, time: 'Ayer', status: 'confirmed' },
  { id: '11', raffle: 'EcoFlow Delta 2', name: 'Carmen V.', phone: '+53 5555 7890', province: 'Cienfuegos', numbers: [777], amount: 50, time: 'Ayer', status: 'confirmed' },
  { id: '12', raffle: 'LG OLED 65"', name: 'Francisco T.', phone: '+53 5555 2345', province: 'Matanzas', numbers: [111, 222, 444, 888], amount: 240, time: 'Hace 2 días', status: 'confirmed' },
  { id: '13', raffle: 'EcoFlow Delta 2', name: 'Isabel N.', phone: '+1 (305) 555-1234', province: 'Otro (EE.UU.)', beneficiary: 'Hermanos Núñez - Pinar del Río', numbers: [3, 13, 23, 33, 43, 53, 63, 73, 83, 93], amount: 500, time: 'Hace 2 días', status: 'confirmed' },
  { id: '14', raffle: 'PS5 + 3 Juegos', name: 'Luis R.', phone: '+53 5555 6666', province: 'Las Tunas', numbers: [321], amount: 30, time: 'Hace 3 días', status: 'expired' },
];

export const stats = {
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