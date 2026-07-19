# WebRifas - Plataforma de Rifas y Sorteos

Plataforma web profesional para organizar rifas y sorteos con reserva de números, aprobación manual de pagos y panel administrativo. Diseñada para clientes cubanos y familiares en EE.UU.

## Stack Tecnológico

- **Framework:** Astro 7 (output: server)
- **UI:** React 19 + TypeScript
- **Estilos:** Tailwind CSS 4
- **Base de datos:** Supabase (pendiente de configurar)
- **Hosting:** Node.js (Adaptador @astrojs/node)

## Arquitectura del Proyecto

```
frontend/src/
├── config/                    # Configuración global del sitio
│   └── site.config.ts         # Nav, WhatsApp, social, footer
│
├── features/                  # Módulos por funcionalidad
│   ├── home/                  # Secciones del home
│   │   ├── Hero/              # Sección principal
│   │   ├── HowItWorks/        # Cómo funciona
│   │   ├── Trust/             # Confianza y transparencia
│   │   └── WinnersHome/       # Ganadores recientes
│   ├── raffles/               # Rifas
│   │   ├── RaffleCard/        # Tarjeta de rifa
│   │   └── RaffleDetail/      # Detalle (reglas, participantes, updates)
│   └── admin/                 # Panel administrativo
│       ├── Dashboard/         # Dashboard principal
│       └── Reservations/      # Gestión de reservas
│
├── components/ui/             # Componentes compartidos
│   ├── CountdownTimer.tsx     # Contador regresivo
│   ├── ImageGallery.tsx       # Galería de imágenes
│   ├── ShareButton.tsx        # Botón compartir
│   └── WhatsAppButton.tsx     # Botón WhatsApp flotante
│
├── layouts/                   # Layouts reutilizables
│   ├── Header/                # Navegación principal
│   └── Footer/                # Pie de página
│
├── pages/                     # Rutas de Astro
│   ├── index.astro            # Home
│   ├── raffles/               # Rifas (listado + detalle)
│   ├── winners.astro          # Ganadores
│   ├── social.astro           # Ayuda social
│   ├── how-to-participate.astro # Cómo participar
│   ├── terms.astro            # Términos y condiciones
│   ├── privacy.astro          # Política de privacidad
│   └── admin/                 # Panel administrativo
│
├── types/                     # Tipos TypeScript
├── data/                      # Mock data
├── lib/                       # Utilidades (Supabase client)
└── styles/                    # Estilos globales (Tailwind)
```

## Páginas

### Público
| Ruta | Descripción |
|------|-------------|
| `/` | Home con hero, rifa destacada, rifas activas, cómo funciona, confianza, ganadores |
| `/raffles` | Listado de todas las rifas disponibles |
| `/raffles/[id]` | Detalle de rifa con galería, reglas, selector de números, participantes |
| `/winners` | Historial de ganadores con fotos de entrega |
| `/social` | Ayuda social y donaciones documentadas |
| `/how-to-participate` | Guía paso a paso (Cuba + EE.UU.) con FAQ |
| `/terms` | Términos y condiciones |
| `/privacy` | Política de privacidad |

### Administrativo
| Ruta | Descripción |
|------|-------------|
| `/admin` | Dashboard con stats, reservas pendientes, actividad reciente |
| `/admin/reservations` | Tabla completa de reservas con filtros y acciones |

## Características Principales

- **Diseño mobile-first** optimizado para conexión lenta
- **Estética premium** dark con acentos dorados
- **Contador regresivo** en tiempo real por rifa
- **Barra de progreso** de ventas con porcentaje
- **Botón WhatsApp** flotante global con mensaje prellenado
- **Compartir** en WhatsApp, Facebook, Twitter, copiar enlace
- **Panel admin** con aprobación/cancelación de reservas y confirmaciones
- **Datos mock** realistas para desarrollo (EcoFlow Delta 2, PS5, etc.)

## Comandos

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev          # Servidor en localhost:4321

# Build
npm run build        # Build de producción
npm run preview      # Preview del build
```

## Variables de Entorno

Copiar `.env.example` a `.env` y configurar:

```env
PUBLIC_SUPABASE_URL=tu-url-de-supabase
PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```
