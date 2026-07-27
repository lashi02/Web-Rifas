import type { PaymentMethod, Raffle, RaffleRules } from '../../../types';

export const activeRafflesContent = {
  title: 'Rifas Activas',
  emptyMessage: 'No hay rifas disponibles en este momento.',
};

const defaultPaymentMethods: PaymentMethod[] = [
  {
    id: 'zelle',
    name: 'Zelle',
    type: 'zelle',
    details: 'Envia el pago por Zelle al email indicado.',
    email: 'pagos@webrifas.com',
    instructions: 'Incluye en el concepto los numeros que reservaste.',
  },
  {
    id: 'transfer',
    name: 'Transferencia Bancaria',
    type: 'transfer',
    details: 'Transferencia a cuenta bancaria.',
    account_name: 'WebRifas S.A.',
    account_number: '1234567890',
    instructions: 'Incluye tu nombre y los numeros reservados en el concepto.',
  },
];

const defaultRules: RaffleRules = {
  draw_method: 'Sorteo en vivo por redes sociales usando sistema aleatorio certificado.',
  reservation_limit_minutes: 30,
  delivery_method: 'Entrega personal o envio coordinado con el ganador.',
  conditions: [
    'Cada numero solo puede venderse una vez.',
    'El pago debe confirmarse antes de vencer la reserva.',
    'El sorteo es definitivo e inapelable.',
    'El ganador sera contactado por WhatsApp.',
  ],
};

export const mockActiveRaffles: Raffle[] = [
  {
    id: '1',
    title: 'Combo Antiapagones: EcoFlow Delta 2 + TV + Panel Solar',
    description: 'Solucion completa para apagones: estacion de energia portatil, smart TV y panel solar para recarga independiente.',
    image_url: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=800',
    images: [
      'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=800',
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800',
    ],
    ticket_price: 50,
    total_tickets: 1000,
    sold_tickets: 742,
    reserved_tickets: [13, 42, 57, 155, 288],
    free_tickets: [1, 3, 5, 7, 8, 10, 20, 35, 54, 56, 262, 777],
    status: 'active',
    draw_date: '2026-08-15T20:00:00',
    created_at: '2026-07-01T10:00:00',
    rules: {
      ...defaultRules,
      delivery_method: 'Entrega personal en La Habana o envio a otras provincias por cuenta del ganador.',
      conditions: [
        ...defaultRules.conditions,
        'Incluye estacion EcoFlow, TV y panel solar.',
      ],
    },
    social_aid_percentage: 10,
    payment_methods: defaultPaymentMethods,
  },
  {
    id: '2',
    title: 'PlayStation 5 + 3 Juegos',
    description: 'Consola PS5 con disco de 1TB junto con 3 juegos exclusivos.',
    image_url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
    images: [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
      'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800',
    ],
    ticket_price: 30,
    total_tickets: 500,
    sold_tickets: 312,
    reserved_tickets: [42, 87, 156, 221],
    free_tickets: [2, 9, 14, 25, 31, 63, 101, 144, 205, 333],
    status: 'active',
    draw_date: '2026-08-20T20:00:00',
    created_at: '2026-07-05T10:00:00',
    rules: {
      ...defaultRules,
      draw_method: 'Sorteo en vivo por Facebook Live.',
      conditions: [
        ...defaultRules.conditions,
        'Incluye consola, control DualSense y 3 juegos.',
      ],
    },
    social_aid_percentage: 10,
    payment_methods: defaultPaymentMethods,
  },
  {
    id: '3',
    title: 'Viaje a Cancun 5 Noches Todo Incluido',
    description: 'Paquete completo para 2 personas: vuelo, hotel 5 estrellas, tours y traslados.',
    image_url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800',
    images: [
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800',
      'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800',
    ],
    ticket_price: 100,
    total_tickets: 300,
    sold_tickets: 189,
    reserved_tickets: [50, 51, 52, 53, 54],
    free_tickets: [6, 12, 18, 24, 36, 48, 60, 72, 96, 108],
    status: 'active',
    draw_date: '2026-09-01T20:00:00',
    created_at: '2026-07-10T10:00:00',
    rules: {
      ...defaultRules,
      draw_method: 'Sorteo en vivo por Instagram.',
      delivery_method: 'Se gestionan los vuelos y el hotel directamente con el ganador.',
      conditions: [
        ...defaultRules.conditions,
        'Valido para 2 personas.',
        'Fechas sujetas a disponibilidad.',
      ],
    },
    social_aid_percentage: 10,
    payment_methods: defaultPaymentMethods,
  },
];
