import type { SocialAid } from '../types';

export const mockSocialAids: SocialAid[] = [
  {
    id: '1',
    title: 'Apoyo a familia afectada por incendio',
    description: 'Familia de 5 miembros en Santa Clara perdió su vivienda por un cortocircuito. Se cubrieron gastos de alojamiento temporal, ropa y alimentos básicos para un mes.',
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600',
    date: '2026-07-10',
    amount: 500,
    location: 'Santa Clara',
    published: true,
  },
  {
    id: '2',
    title: 'Medicamentos para niños con enfermedades crónicas',
    description: 'Compra de medicamentos esenciales para 8 niños con enfermedades crónicas en Camagüey que no tenían acceso a tratamiento.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600',
    date: '2026-06-25',
    amount: 800,
    location: 'Camagüey',
    published: true,
  },
  {
    id: '3',
    title: 'Reparación de techo para abuelos',
    description: 'Reparación completa del techo de una pareja de abuelos en Holguín que vivían con filtraciones constantes durante las lluvias.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600',
    date: '2026-06-10',
    amount: 350,
    location: 'Holguín',
    published: true,
  },
  {
    id: '4',
    title: 'Útiles escolares para 50 niños',
    description: 'Entrega de útiles escolares completos para 50 niños de escuela primaria en Santiago de Cuba. Incluyó cuadernos, lápices, mochilas y uniformes.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600',
    date: '2026-05-20',
    amount: 400,
    location: 'Santiago de Cuba',
    published: true,
  },
  {
    id: '5',
    title: 'Alimentos para hogar de ancianos',
    description: 'Donación de alimentos no perecederos, medicamentos y productos de higiene para el hogar de ancianos "Hermanos Cruz" en La Habana.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600',
    date: '2026-05-05',
    amount: 600,
    location: 'La Habana',
    published: true,
  },
  {
    id: '6',
    title: 'Materiales para escuela rural',
    description: 'Envío de materiales educativos, deportivos y artísticos a escuela rural en Pinar del Río con 120 alumnos y recursos muy limitados.',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600',
    date: '2026-04-18',
    amount: 450,
    location: 'Pinar del Río',
    published: true,
  },
];

export function getPublishedAids(): SocialAid[] {
  return mockSocialAids.filter(a => a.published);
}

export function getSocialAidStats() {
  const published = getPublishedAids();
  return {
    totalAids: published.length,
    totalAmount: published.reduce((sum, aid) => sum + aid.amount, 0),
    locations: new Set(published.map(a => a.location)).size,
  };
}
