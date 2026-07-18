import type { Raffle } from '../types';

export const mockRaffles: Raffle[] = [
  {
    id: '1',
    title: 'Combo Antiapagones: EcoFlow Delta 2 + TV 50" + Panel Solar 220W',
    description: 'Solución completa para apagones: estación de energía portátil EcoFlow Delta 2 de 1024Wh con 12 salidas, smart TV Samsung 50" 4K UHD y panel solar portátil de 220W para recarga independiente. Incluye todos los accesorios, cables de conexión y garantía de fábrica de 2 años. Ideal para familias que sufren apagones frecuentes.',
    image_url: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=800',
    images: [
      'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=800',
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800',
    ],
    ticket_price: 50,
    total_tickets: 1000,
    sold_tickets: 742,
    reserved_tickets: 45,
    status: 'active',
    draw_date: '2026-08-15T20:00:00',
    created_at: '2026-07-01T10:00:00',
    rules: {
      draw_method: 'Sorteo en vivo por Instagram y Facebook usando sistema aleatorio certificado',
      reservation_limit_minutes: 30,
      delivery_method: 'Entrega personal en La Habana o envío a otras provincias por cuenta del ganador',
      conditions: [
        'Cada número solo puede ser vendido una vez',
        'El pago debe confirmarse en 30 minutos',
        'El sorteo es definitivo e inapelable',
        'El ganador será contactado por WhatsApp',
        'La entrega se graba como prueba de transparencia',
      ],
    },
    social_aid_percentage: 10,
    payment_methods: [
      {
        id: 'zelle',
        name: 'Zelle',
        type: 'zelle',
        details: 'Envía el pago por Zelle al email indicado',
        email: 'pagos@webrifas.com',
        instructions: 'Incluye en el concepto los números que reservaste. Ejemplo: "Números 45, 77, 123"',
      },
      {
        id: 'transfer',
        name: 'Transferencia Bancaria',
        type: 'transfer',
        details: 'Transferencia a cuenta bancaria',
        account_name: 'WebRifas S.A.',
        account_number: '1234567890',
        instructions: 'Incluye tu nombre y los números en el concepto',
      },
    ],
  },
  {
    id: '2',
    title: 'PlayStation 5 + 3 Juegos Exclusivos',
    description: 'Consola PlayStation 5 disco de 1TB con 3 juegos exclusivos: God of War Ragnarök, Spider-Man 2 y Horizon Forbidden West. Incluye control DualSense, cables HDMI y cargador. Garantía de Sony de 1 año.',
    image_url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
    images: [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
      'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800',
    ],
    ticket_price: 30,
    total_tickets: 500,
    sold_tickets: 312,
    reserved_tickets: 28,
    status: 'active',
    draw_date: '2026-08-20T20:00:00',
    created_at: '2026-07-05T10:00:00',
    rules: {
      draw_method: 'Sorteo en vivo por Facebook Live',
      reservation_limit_minutes: 30,
      delivery_method: 'Entrega personal o envío',
      conditions: [
        'Solo un número por persona',
        'Pago confirmado en 30 minutos',
        'Sorteo en vivo y transparente',
      ],
    },
    social_aid_percentage: 10,
    payment_methods: [
      {
        id: 'zelle',
        name: 'Zelle',
        type: 'zelle',
        details: 'Envía el pago por Zelle',
        email: 'pagos@webrifas.com',
        instructions: 'Incluye los números en el concepto',
      },
    ],
  },
  {
    id: '3',
    title: 'Viaje a Cancún 5 Noches Todo Incluido',
    description: 'Paquete completo para 2 personas: vuelos ida y vuelta desde La Habana, hotel 5 estrellas all inclusive, tours a Chichén Itzá, Xcaret y cenotes. Incluye traslados aeropuerto-hotel y seguro de viaje.',
    image_url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800',
    images: [
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800',
      'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800',
    ],
    ticket_price: 100,
    total_tickets: 300,
    sold_tickets: 189,
    reserved_tickets: 15,
    status: 'active',
    draw_date: '2026-09-01T20:00:00',
    created_at: '2026-07-10T10:00:00',
    rules: {
      draw_method: 'Sorteo en vivo por Instagram',
      reservation_limit_minutes: 30,
      delivery_method: 'Se gestionan los vuelos y hotel directamente con el ganador',
      conditions: [
        'Válido para 2 personas',
        'Fechas sujetas a disponibilidad',
        'Pasaporte vigente requerido',
      ],
    },
    social_aid_percentage: 10,
    payment_methods: [
      {
        id: 'zelle',
        name: 'Zelle',
        type: 'zelle',
        details: 'Envía el pago por Zelle',
        email: 'pagos@webrifas.com',
        instructions: 'Incluye los números en el concepto',
      },
    ],
  },
  {
    id: '4',
    title: 'MacBook Air M3 - 16GB RAM - 512GB SSD',
    description: 'Laptop Apple MacBook Air con chip M3, 16GB de RAM unificada y 512GB de SSD. Pantalla Liquid Retina de 13.6", cámara FaceTime HD de 1080p, MagSafe, Thunderbolt y batería de hasta 18 horas. Color Medianoche.',
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    ],
    ticket_price: 75,
    total_tickets: 200,
    sold_tickets: 89,
    reserved_tickets: 12,
    status: 'active',
    draw_date: '2026-09-10T20:00:00',
    created_at: '2026-07-12T10:00:00',
    rules: {
      draw_method: 'Sorteo en vivo por YouTube',
      reservation_limit_minutes: 30,
      delivery_method: 'Entrega personal',
      conditions: [
        'Garantía Apple de 1 año',
        'Incluye cargador y caja original',
      ],
    },
    social_aid_percentage: 10,
    payment_methods: [
      {
        id: 'zelle',
        name: 'Zelle',
        type: 'zelle',
        details: 'Envía el pago por Zelle',
        email: 'pagos@webrifas.com',
        instructions: 'Incluye los números en el concepto',
      },
    ],
  },
  {
    id: '5',
    title: 'Samsung Galaxy S24 Ultra - 256GB',
    description: 'El último flagship de Samsung con S Pen integrado, cámara de 200MP, pantalla Dynamic AMOLED 2X de 6.8" con 120Hz, Snapdragon 8 Gen 3, 12GB RAM y 256GB de almacenamiento. Color Titanio Negro.',
    image_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
    ],
    ticket_price: 40,
    total_tickets: 400,
    sold_tickets: 287,
    reserved_tickets: 20,
    status: 'active',
    draw_date: '2026-08-25T20:00:00',
    created_at: '2026-07-08T10:00:00',
    rules: {
      draw_method: 'Sorteo en vivo por Facebook',
      reservation_limit_minutes: 30,
      delivery_method: 'Entrega personal o envío',
      conditions: [
        'Incluye S Pen, cargador y caja',
        'Garantía Samsung de 1 año',
      ],
    },
    social_aid_percentage: 10,
    payment_methods: [
      {
        id: 'zelle',
        name: 'Zelle',
        type: 'zelle',
        details: 'Envía el pago por Zelle',
        email: 'pagos@webrifas.com',
        instructions: 'Incluye los números en el concepto',
      },
    ],
  },
  {
    id: '6',
    title: 'Smart TV LG OLED 65" 4K con Dolby Atmos',
    description: 'Televisor LG OLED de 65 pulgadas con resolución 4K, Dolby Vision IQ, Dolby Atmos, procesador α9 Gen6 AI, 120Hz, 4 puertos HDMI 2.1, webOS 24 y control remoto con voz. Ideal para gaming y cine en casa.',
    image_url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
    ],
    ticket_price: 60,
    total_tickets: 250,
    sold_tickets: 134,
    reserved_tickets: 18,
    status: 'active',
    draw_date: '2026-09-05T20:00:00',
    created_at: '2026-07-15T10:00:00',
    rules: {
      draw_method: 'Sorteo en vivo por Instagram y Facebook',
      reservation_limit_minutes: 30,
      delivery_method: 'Entrega personal con instalación incluida',
      conditions: [
        'Instalación gratuita en La Habana',
        'Garantía LG de 2 años',
      ],
    },
    social_aid_percentage: 10,
    payment_methods: [
      {
        id: 'zelle',
        name: 'Zelle',
        type: 'zelle',
        details: 'Envía el pago por Zelle',
        email: 'pagos@webrifas.com',
        instructions: 'Incluye los números en el concepto',
      },
    ],
  },
];

export function getRaffleById(id: string): Raffle | undefined {
  return mockRaffles.find(r => r.id === id);
}

export function getActiveRaffles(): Raffle[] {
  return mockRaffles.filter(r => r.status === 'active');
}

export function getFeaturedRaffle(): Raffle {
  return mockRaffles[0];
}
