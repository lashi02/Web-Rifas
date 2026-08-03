# Web-Rifas Backend

API REST de Web-Rifas (rifas y sorteos benéficos) construida con **Django 6** +
**Django REST Framework**, pensada para desplegarse como **función serverless en
Vercel** (plan Hobby). El frontend ([Astro](../frontend/)) consume estos
endpoints.

## Stack

| Capa      | Tecnología                                                        |
| --------- | ----------------------------------------------------------------- |
| Framework | Django 6 + Django REST Framework 3.16                            |
| Auth      | JWT (SimpleJWT): `/api/auth/token/` y `/api/auth/token/refresh/` |
| BD        | PostgreSQL en Supabase (vía `DATABASE_URL`, pooler transaction); en local cae a SQLite |
| Despliegue| Vercel serverless, entrypoint `config.wsgi:application`          |

## Estructura

```
backend/
├── config/               # Settings (base/dev/production), urls, wsgi/asgi
├── apps/
│   ├── core/             # User (admin/operator/editor), AuditLog, health
│   └── raffles/          # Raffle, Reservation, Winner, SocialAid + API
├── manage.py
├── pyproject.toml        # Dependencias, entrypoint Vercel, config pytest
├── .env.example
└── README.md
```

## Modelo de datos (ideas clave)

- Los números **vendidos/reservados/libres** NO se guardan como arrays duplicados:
  se calculan desde `Reservation.ticket_numbers` (props `sold_count`,
  `reserved_numbers`, `free_numbers` en `Raffle`). Fuente de verdad única = reservas.
- Las reservas con `payment_status=pending` vencen según
  `rules.reservation_limit_minutes` (default 30); el vencimiento se evalúa de
  forma perezosa con `Reservation.is_expired()`.
- `User.role` en `admin | operator | editor`. Solo `admin` accede a
  `/api/reservations/`.

## Setup local

Requisitos: Python 3.12+ (probado con 3.13).

### Con `uv`

```powershell
cd backend
uv sync --extra dev

# Configura variables (opcional; sin .env usa SQLite y DEBUG=False)
Copy-Item .env.example .env

# Migraciones + seed demo (replica los mocks del frontend)
uv run python manage.py migrate
uv run python manage.py seed_demo

# Servidor de desarrollo
uv run python manage.py runserver
```

Verifica con `uv run python manage.py check`. El usuario admin del seed es
`admin` / `admin123` (accede al panel `/admin/` y a `/api/reservations/`).

### Flujo anterior con pip

Si prefieres seguir con `pip`, el equivalente era:

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -e ".[dev]"

# Configura variables (opcional; sin .env usa SQLite y DEBUG=False)
Copy-Item .env.example .env

# Migraciones + seed demo (replica los mocks del frontend)
python manage.py migrate
python manage.py seed_demo

# Servidor de desarrollo
python manage.py runserver
```

Verifica con `python manage.py check`.

## Variables de entorno (`.env`)

| Variable                 | Uso                                            |
| ------------------------ | ---------------------------------------------- |
| `DJANGO_SECRET_KEY`      | Secreto de Django (requerido en producción)    |
| `DEBUG`                  | `True` en local, `False` en producción         |
| `DJANGO_ALLOWED_HOSTS`   | Hosts permitidos, separados por coma           |
| `DATABASE_URL`           | Postgres (Supabase pooler). Vacío → SQLite     |
| `CORS_ALLOWED_ORIGINS`   | Orígenes frontend permitidos                   |
| `JWT_ACCESS_MINUTES`     | Vida del access token (default 30)             |
| `JWT_REFRESH_DAYS`       | Vida del refresh token (default 7)             |
| `DJANGO_CONN_MAX_AGE`    | 0 en serverless (no reutilizar conexiones)     |

## Endpoints

Públicos (sin auth):

- `GET  /api/health/` — health check
- `GET  /api/raffles/` — lista de rifas (`?status=active&featured=true`)
- `GET  /api/raffles/<id>/` — detalle
- `GET  /api/raffles/<id>/numbers/` — grilla de números (available/reserved/paid/winner)
- `POST /api/reservations/` — reservar números (pago offline; valida rango y disponibilidad, calcula `amount` y `expires_at`)
- `GET  /api/winners/` — ganadores
- `GET  /api/social-aids/` — ayudas sociales publicadas

Autenticados (JWT Bearer):

- `POST /api/auth/token/` — obtener token (`username`/`password`)
- `POST /api/auth/token/refresh/` — renovar token
- `GET  /api/reservations/` — solo admin (`IsAdminUser`)

La salida sigue las interfaces de `frontend/src/types/index.ts` (`Raffle`,
`Winner`, `SocialAid`, `NumberState`), así el frontend no requiere cambios
estructurales.

## Tests

```powershell
uv sync --extra dev
uv run pytest
```

## Despliegue en Vercel

1. Empuja el repo a GitHub e importa el proyecto en Vercel.
2. Configura las variables de entorno (igual que `.env.example`), con
   `DATABASE_URL` apuntando al pooler transaction de Supabase y `DEBUG=False`.
3. Root directory: `backend`. Framework preset: **Other**. Build: `python manage.py migrate && python manage.py collectstatic` (o usa `vercel.json`). El entrypoint lo define `pyproject.toml` → `[tool.vercel] entrypoint = "config.wsgi:application"`.
4. Cada deploy genera una función serverless que arranca Django. `CONN_MAX_AGE=0`
   porque cada request es una ejecución nueva.

> Nota: en Vercel Hobby los deploys deben producirse vía git (sin CLI por token).
> Con `DATABASE_URL` la BD usa `psycopg` v3 (`psycopg[binary]`) para minimizar el
> tamaño del bundle.

## Migración a `uv`

`uv` reemplaza el combo de `venv + pip + requirements.txt` por un flujo único:

- `uv sync --extra dev` crea el entorno, resuelve dependencias y deja el proyecto listo.
- `uv run ...` ejecuta comandos dentro del entorno sin activarlo manualmente.
- `uv lock` genera o actualiza el lockfile para fijar versiones exactas.

En este backend ya tienes `pyproject.toml`, así que la migración consiste sobre todo en cambiar los comandos de uso diario. No hace falta mantener `requirements.txt` si el proyecto se instala desde `pyproject.toml`.

## Roadmap (siguiente fase)

- Panel de admin de reservas (confirmar/vencer pagos) con JWT.
- Consumo de la API desde el frontend Astro (reemplazar mocks de `src/data/`).
