export const siteConfig = {
  name: 'WebRifas',
  description: 'Rifas 100% transparentes y seguras. Participa y gana increíbles premios.',
  url: 'https://webrifas.com',
  whatsapp: {
    number: '1234567890',
    message: 'Hola, quiero información sobre las rifas',
  },
  social: {
    facebook: '#',
    instagram: '#',
    youtube: '#',
  },
  nav: [
    { href: '/', label: 'Inicio' },
    { href: '/raffles', label: 'Rifas' },
    { href: '/winners', label: 'Ganadores' },
    { href: '/social', label: 'Ayuda Social' },
    { href: '/how-to-participate', label: 'Cómo Participar' },
  ],
  footer: {
    nav: [
      { href: '/', label: 'Inicio' },
      { href: '/raffles', label: 'Rifas' },
      { href: '/winners', label: 'Ganadores' },
      { href: '/social', label: 'Ayuda Social' },
      { href: '/how-to-participate', label: 'Cómo Participar' },
    ],
    legal: [
      { href: '/terms', label: 'Términos y Condiciones' },
      { href: '/privacy', label: 'Política de Privacidad' },
    ],
  },
  admin: {
    nav: [
      { href: '/admin', label: 'Dashboard', icon: 'home' },
      { href: '/admin/raffles', label: 'Rifas', icon: 'raffles' },
      { href: '/admin/reservations', label: 'Reservas', icon: 'reservations' },
      { href: '/admin/participants', label: 'Participantes', icon: 'participants' },
      { href: '/admin/winners', label: 'Ganadores', icon: 'winners' },
      { href: '/admin/social', label: 'Ayuda Social', icon: 'social' },
      { href: '/admin/settings', label: 'Configuración', icon: 'settings' },
    ],
  },
};
