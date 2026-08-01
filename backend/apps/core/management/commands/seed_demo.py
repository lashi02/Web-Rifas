"""Comando para poblar la base con datos de demostración.

Replica los mocks del frontend (`src/data/*.ts` y los configs de admin) para
que la API devuelva lo mismo que hoy muestra la web. Idempotente: se puede
ejecutar varias veces.

Uso:
    python manage.py seed_demo
"""

from datetime import timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.core.models import User
from apps.raffles.models import Raffle, Reservation, SocialAid, Winner

DEMO_ADMIN_USERNAME = "admin"
DEMO_ADMIN_PASSWORD = "admin123"


def parse_dt(value: str):
    """Parsea una fecha ISO y la vuelve timezone-aware (zona del proyecto)."""
    dt = timezone.datetime.fromisoformat(value)
    if timezone.is_naive(dt):
        dt = timezone.make_aware(dt)
    return dt


class Command(BaseCommand):
    help = "Crea datos de demostración (rifas, reservas, ganadores y ayudas)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--flush",
            action="store_true",
            help="Borra las rifas/reservas/ganadores/ayudas actuales antes de sembrar.",
        )

    def handle(self, *args, **options):
        if options["flush"]:
            self.stdout.write("Borrando datos existentes...")
            for model in (Raffle, Winner, SocialAid):
                model.objects.all().delete()
        self.create_admin()
        raffles = self.create_raffles()
        self.create_reservations(raffles)
        self.create_winners(raffles)
        self.create_social_aids()

        self.stdout.write(self.style.SUCCESS(
            f"Seed completado: {Raffle.objects.count()} rifas, "
            f"{Reservation.objects.count()} reservas, "
            f"{Winner.objects.count()} ganadores, "
            f"{SocialAid.objects.count()} ayudas."
        ))

    def create_admin(self) -> User:
        user, created = User.objects.get_or_create(
            username=DEMO_ADMIN_USERNAME,
            defaults={
                "email": "admin@webrifas.com",
                "role": User.Roles.ADMIN,
            },
        )
        if created:
            user.set_password(DEMO_ADMIN_PASSWORD)
            user.is_staff = True
            user.is_superuser = True
            user.save()
            self.stdout.write("Usuario admin creado (admin/admin123).")
        return user

    def create_raffles(self) -> dict[str, Raffle]:
        now = timezone.now()
        seed = [
            {
                "id": 1,
                "title": "Combo Antiapagones: EcoFlow Delta 2 + TV 50\" + Panel Solar 220W",
                "description": "Solución completa para apagones: estación de energía portátil EcoFlow Delta 2 de 1024Wh con 12 salidas, smart TV Samsung 50\" 4K UHD y panel solar portátil de 220W para recarga independiente. Incluye todos los accesorios, cables de conexión y garantía de fábrica de 2 años.",
                "image_url": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=800",
                "images": [
                    "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=800",
                    "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800",
                    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800",
                ],
                "ticket_price": Decimal("50"),
                "total_tickets": 1000,
                "status": "active",
                "draw_date": now + timedelta(days=14),
                "featured": True,
                "rules": {
                    "draw_method": "Sorteo en vivo por Instagram y Facebook usando sistema aleatorio certificado",
                    "reservation_limit_minutes": 30,
                    "delivery_method": "Entrega personal en La Habana o envío a otras provincias por cuenta del ganador",
                    "conditions": [
                        "Cada número solo puede ser vendido una vez",
                        "El pago debe confirmarse en 30 minutos",
                        "El sorteo es definitivo e inapelable",
                        "El ganador será contactado por WhatsApp",
                        "La entrega se graba como prueba de transparencia",
                    ],
                },
                "social_aid_percentage": Decimal("10"),
                "payment_methods": [
                    {
                        "id": "zelle",
                        "name": "Zelle",
                        "type": "zelle",
                        "details": "Envía el pago por Zelle al email indicado",
                        "email": "pagos@webrifas.com",
                        "instructions": "Incluye en el concepto los números que reservaste. Ejemplo: \"Números 45, 77, 123\"",
                    },
                    {
                        "id": "transfer",
                        "name": "Transferencia Bancaria",
                        "type": "transfer",
                        "details": "Transferencia a cuenta bancaria",
                        "account_name": "WebRifas S.A.",
                        "account_number": "1234567890",
                        "instructions": "Incluye tu nombre y los números en el concepto",
                    },
                ],
            },
            {
                "id": 2,
                "title": "PlayStation 5 + 3 Juegos Exclusivos",
                "description": "Consola PlayStation 5 disco de 1TB con 3 juegos exclusivos: God of War Ragnarök, Spider-Man 2 y Horizon Forbidden West. Incluye control DualSense, cables HDMI y cargador. Garantía de Sony de 1 año.",
                "image_url": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800",
                "images": [
                    "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800",
                    "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800",
                ],
                "ticket_price": Decimal("30"),
                "total_tickets": 500,
                "status": "active",
                "draw_date": now + timedelta(days=19),
                "rules": {
                    "draw_method": "Sorteo en vivo por Facebook Live",
                    "reservation_limit_minutes": 30,
                    "delivery_method": "Entrega personal o envío",
                    "conditions": [
                        "Solo un número por persona",
                        "Pago confirmado en 30 minutos",
                        "Sorteo en vivo y transparente",
                    ],
                },
                "social_aid_percentage": Decimal("10"),
                "payment_methods": [
                    {
                        "id": "zelle",
                        "name": "Zelle",
                        "type": "zelle",
                        "details": "Envía el pago por Zelle",
                        "email": "pagos@webrifas.com",
                        "instructions": "Incluye los números en el concepto",
                    },
                ],
            },
            {
                "id": 3,
                "title": "Viaje a Cancún 5 Noches Todo Incluido",
                "description": "Paquete completo para 2 personas: vuelos ida y vuelta desde La Habana, hotel 5 estrellas all inclusive, tours a Chichén Itzá, Xcaret y cenotes. Incluye traslados aeropuerto-hotel y seguro de viaje.",
                "image_url": "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800",
                "images": [
                    "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800",
                    "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800",
                ],
                "ticket_price": Decimal("100"),
                "total_tickets": 300,
                "status": "active",
                "draw_date": now + timedelta(days=31),
                "rules": {
                    "draw_method": "Sorteo en vivo por Instagram",
                    "reservation_limit_minutes": 30,
                    "delivery_method": "Se gestionan los vuelos y hotel directamente con el ganador",
                    "conditions": [
                        "Válido para 2 personas",
                        "Fechas sujetas a disponibilidad",
                        "Pasaporte vigente requerido",
                    ],
                },
                "social_aid_percentage": Decimal("10"),
                "payment_methods": [
                    {
                        "id": "zelle",
                        "name": "Zelle",
                        "type": "zelle",
                        "details": "Envía el pago por Zelle",
                        "email": "pagos@webrifas.com",
                        "instructions": "Incluye los números en el concepto",
                    },
                ],
            },
            {
                "id": 4,
                "title": "MacBook Air M3 - 16GB RAM - 512GB SSD",
                "description": "Laptop Apple MacBook Air con chip M3, 16GB de RAM unificada y 512GB de SSD. Pantalla Liquid Retina de 13.6\", cámara FaceTime HD de 1080p, MagSafe, Thunderbolt y batería de hasta 18 horas. Color Medianoche.",
                "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
                "images": [
                    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
                    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
                ],
                "ticket_price": Decimal("75"),
                "total_tickets": 200,
                "status": "active",
                "draw_date": now + timedelta(days=40),
                "rules": {
                    "draw_method": "Sorteo en vivo por YouTube",
                    "reservation_limit_minutes": 30,
                    "delivery_method": "Entrega personal",
                    "conditions": [
                        "Garantía Apple de 1 año",
                        "Incluye cargador y caja original",
                    ],
                },
                "social_aid_percentage": Decimal("10"),
                "payment_methods": [
                    {
                        "id": "zelle",
                        "name": "Zelle",
                        "type": "zelle",
                        "details": "Envía el pago por Zelle",
                        "email": "pagos@webrifas.com",
                        "instructions": "Incluye los números en el concepto",
                    },
                ],
            },
            {
                "id": 5,
                "title": "Samsung Galaxy S24 Ultra - 256GB",
                "description": "El último flagship de Samsung con S Pen integrado, cámara de 200MP, pantalla Dynamic AMOLED 2X de 6.8\" con 120Hz, Snapdragon 8 Gen 3, 12GB RAM y 256GB de almacenamiento. Color Titanio Negro.",
                "image_url": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
                "images": [
                    "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
                ],
                "ticket_price": Decimal("40"),
                "total_tickets": 400,
                "status": "active",
                "draw_date": now + timedelta(days=24),
                "rules": {
                    "draw_method": "Sorteo en vivo por Facebook",
                    "reservation_limit_minutes": 30,
                    "delivery_method": "Entrega personal o envío",
                    "conditions": [
                        "Incluye S Pen, cargador y caja",
                        "Garantía Samsung de 1 año",
                    ],
                },
                "social_aid_percentage": Decimal("10"),
                "payment_methods": [
                    {
                        "id": "zelle",
                        "name": "Zelle",
                        "type": "zelle",
                        "details": "Envía el pago por Zelle",
                        "email": "pagos@webrifas.com",
                        "instructions": "Incluye los números en el concepto",
                    },
                ],
            },
            {
                "id": 6,
                "title": "Smart TV LG OLED 65\" 4K con Dolby Atmos",
                "description": "Televisor LG OLED de 65 pulgadas con resolución 4K, Dolby Vision IQ, Dolby Atmos, procesador α9 Gen6 AI, 120Hz, 4 puertos HDMI 2.1, webOS 24 y control remoto con voz. Ideal para gaming y cine en casa.",
                "image_url": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800",
                "images": [
                    "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800",
                ],
                "ticket_price": Decimal("60"),
                "total_tickets": 250,
                "status": "active",
                "draw_date": now + timedelta(days=35),
                "rules": {
                    "draw_method": "Sorteo en vivo por Instagram y Facebook",
                    "reservation_limit_minutes": 30,
                    "delivery_method": "Entrega personal con instalación incluida",
                    "conditions": [
                        "Instalación gratuita en La Habana",
                        "Garantía LG de 2 años",
                    ],
                },
                "social_aid_percentage": Decimal("10"),
                "payment_methods": [
                    {
                        "id": "zelle",
                        "name": "Zelle",
                        "type": "zelle",
                        "details": "Envía el pago por Zelle",
                        "email": "pagos@webrifas.com",
                        "instructions": "Incluye los números en el concepto",
                    },
                ],
            },
            {
                "id": 7,
                "title": "AirPods Pro 2 - USB-C",
                "description": "Apple AirPods Pro 2 con cancelación activa de ruido adaptativa, sonido espacial personalizado y estuche de carga USB-C con altavoz integrado.",
                "image_url": "https://images.unsplash.com/photo-1605462863863-10d9e47e15ee?w=800",
                "images": [],
                "ticket_price": Decimal("25"),
                "total_tickets": 200,
                "status": "finished",
                "draw_date": now - timedelta(days=12),
                "winner_ticket_number": 456,
            },
            {
                "id": 8,
                "title": "Tarjeta Starbucks $50",
                "description": "Tarjeta regalo Starbucks por valor de $50 USD para canjear en cualquier tienda del mundo.",
                "image_url": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
                "images": [],
                "ticket_price": Decimal("10"),
                "total_tickets": 100,
                "status": "finished",
                "draw_date": now - timedelta(days=22),
                "winner_ticket_number": 333,
            },
        ]

        raffles: dict[str, Raffle] = {}
        for data in seed:
            raffle, _ = Raffle.objects.update_or_create(
                id=data["id"],
                defaults={k: v for k, v in data.items() if k != "id"},
            )
            raffles[str(data["id"])] = raffle
        return raffles

    def create_reservations(self, raffles: dict[str, Raffle]) -> None:
        if Reservation.objects.exists():
            self.stdout.write("Reservas ya existentes: se omiten (usa --flush para regenerar).")
            return

        now = timezone.now()
        raf1 = raffles["1"]
        raf2 = raffles["2"]
        raf3 = raffles["3"]

        confirmed_participants = [
            ("Carlos M.", "+53 5555 1234", "La Habana", "", [45, 46, 47, 123, 456]),
            ("María G.", "+1 (305) 555-0123", "Otro (EE.UU.)", "Pedro García - Santiago de Cuba", [77, 234, 567, 891]),
            ("Roberto L.", "+53 5555 5678", "Camagüey", "", [12, 88, 333]),
            ("Ana P.", "+1 (786) 555-0456", "Otro (EE.UU.)", "Familia Pérez - Holguín", [99, 100, 201, 444, 678, 999]),
            ("Laura R.", "+53 5555 3456", "Guantánamo", "", [50, 51, 52, 53, 54, 55, 56, 57, 58, 59]),
            ("José D.", "+1 (212) 555-0789", "Otro (EE.UU.)", "María Díaz - Las Tunas", [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]),
            ("Carmen V.", "+53 5555 7890", "Cienfuegos", "", [777]),
            ("Francisco T.", "+53 5555 2345", "Matanzas", "", [111, 222, 444, 888]),
            ("Isabel N.", "+1 (305) 555-1234", "Otro (EE.UU.)", "Hermanos Núñez - Pinar del Río", [3, 13, 23, 33, 43, 53, 63, 73, 83, 93]),
        ]

        pending_reservations = [
            (raf1, "Pedro S.", "+53 5555 9012", "Santa Clara", [155, 288]),
            (raf2, "Rosa M.", "+53 5555 1111", "La Habana", [42, 87, 156]),
            (raf1, "Juan P.", "+1 (305) 555-2222", "Otro (EE.UU.)", [777]),
            (raf3, "María L.", "+53 5555 3333", "Holguín", [50, 51, 52, 53, 54]),
        ]

        for name, phone, province, beneficiary, numbers in confirmed_participants:
            Reservation.objects.create(
                raffle=raf1,
                ticket_numbers=numbers,
                buyer_name=name,
                buyer_phone=phone,
                buyer_country="US" if phone.startswith("+1") else "CU",
                buyer_province=province,
                beneficiary_name=beneficiary,
                payment_status=Reservation.PaymentStatus.COMPLETED,
                amount=Decimal(len(numbers)) * raf1.ticket_price,
                created_at=now - timedelta(days=3),
                confirmed_at=now - timedelta(days=3),
            )

        for raffle, name, phone, province, numbers in pending_reservations:
            Reservation.objects.create(
                raffle=raffle,
                ticket_numbers=numbers,
                buyer_name=name,
                buyer_phone=phone,
                buyer_country="US" if phone.startswith("+1") else "CU",
                buyer_province=province,
                payment_status=Reservation.PaymentStatus.PENDING,
                amount=Decimal(len(numbers)) * raffle.ticket_price,
                expires_at=now + timedelta(minutes=30),
            )

        Reservation.objects.create(
            raffle=raf2,
            ticket_numbers=[321],
            buyer_name="Luis R.",
            buyer_phone="+53 5555 6666",
            buyer_province="Las Tunas",
            payment_status=Reservation.PaymentStatus.EXPIRED,
            amount=Decimal("30"),
            created_at=now - timedelta(days=3),
            expires_at=now - timedelta(days=3),
            admin_notes="Sin pago",
        )

    def create_winners(self, raffles: dict[str, Raffle]) -> None:
        seed = [
            {
                "id": 1,
                "ticket_number": 234,
                "winner_name": "María G.",
                "winner_phone": "+1 (305) 555-0123",
                "winner_province": "La Habana",
                "prize": "iPhone 15 Pro Max 256GB",
                "drawn_at": "2026-06-15T20:00:00",
                "delivered_at": "2026-06-18T14:00:00",
                "delivery_photo": "https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=400",
            },
            {
                "id": 2,
                "ticket_number": 891,
                "winner_name": "Carlos R.",
                "winner_phone": "+53 5555 4321",
                "winner_province": "Santiago de Cuba",
                "prize": "Samsung Smart TV 55\" QLED",
                "drawn_at": "2026-06-01T20:00:00",
                "delivered_at": "2026-06-05T10:00:00",
                "delivery_photo": "https://images.unsplash.com/photo-1574263867128-a3d5c1b1decc?w=400",
            },
            {
                "id": 3,
                "ticket_number": 156,
                "winner_name": "Ana L.",
                "winner_phone": "+53 5555 8765",
                "winner_province": "Camagüey",
                "prize": "PlayStation 5 + 2 Juegos",
                "drawn_at": "2026-05-20T20:00:00",
                "delivered_at": "2026-05-24T16:00:00",
                "delivery_photo": "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400",
            },
            {
                "id": 4,
                "ticket_number": 423,
                "winner_name": "Roberto M.",
                "winner_phone": "+1 (786) 555-9876",
                "winner_province": "Santa Clara",
                "prize": "MacBook Air M2",
                "drawn_at": "2026-05-10T20:00:00",
                "delivered_at": "2026-05-14T11:00:00",
                "delivery_photo": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
            },
            {
                "id": 5,
                "ticket_number": 678,
                "winner_name": "Laura P.",
                "winner_phone": "+53 5555 3456",
                "winner_province": "Holguín",
                "prize": "Samsung Galaxy S23 Ultra",
                "drawn_at": "2026-04-28T20:00:00",
                "delivered_at": "2026-05-02T09:00:00",
                "delivery_photo": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
            },
            {
                "id": 6,
                "ticket_number": 999,
                "winner_name": "Pedro S.",
                "winner_phone": "+53 5555 9012",
                "winner_province": "Guantánamo",
                "prize": "Smart TV LG 50\" OLED",
                "drawn_at": "2026-04-15T20:00:00",
                "delivered_at": "2026-04-19T15:00:00",
                "delivery_photo": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
            },
        ]

        for data in seed:
            delivered = bool(data.get("delivered_at"))
            Winner.objects.update_or_create(
                id=data["id"],
                defaults={
                    "ticket_number": data["ticket_number"],
                    "winner_name": data["winner_name"],
                    "winner_phone": data["winner_phone"],
                    "winner_province": data["winner_province"],
                    "prize": data["prize"],
                    "drawn_at": parse_dt(data["drawn_at"]),
                    "delivered": delivered,
                    "delivered_at": parse_dt(data["delivered_at"]) if delivered else None,
                    "delivery_photo": data.get("delivery_photo", ""),
                },
            )

        # Vincular los ganadores de las rifas finalizadas del mock (AirPods y Starbucks).
        raffles["7"].winner_ticket_number = 456
        raffles["7"].save()
        raffles["8"].winner_ticket_number = 333
        raffles["8"].save()

    def create_social_aids(self) -> None:
        seed = [
            {
                "id": 1,
                "title": "Apoyo a familia afectada por incendio",
                "description": "Familia de 5 miembros en Santa Clara perdió su vivienda por un cortocircuito. Se cubrieron gastos de alojamiento temporal, ropa y alimentos básicos para un mes.",
                "image": "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600",
                "date": "2026-07-10",
                "amount": Decimal("500"),
                "location": "Santa Clara",
            },
            {
                "id": 2,
                "title": "Medicamentos para niños con enfermedades crónicas",
                "description": "Compra de medicamentos esenciales para 8 niños con enfermedades crónicas en Camagüey que no tenían acceso a tratamiento.",
                "image": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600",
                "date": "2026-06-25",
                "amount": Decimal("800"),
                "location": "Camagüey",
            },
            {
                "id": 3,
                "title": "Reparación de techo para abuelos",
                "description": "Reparación completa del techo de una pareja de abuelos en Holguín que vivían con filtraciones constantes durante las lluvias.",
                "image": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600",
                "date": "2026-06-10",
                "amount": Decimal("350"),
                "location": "Holguín",
            },
            {
                "id": 4,
                "title": "Útiles escolares para 50 niños",
                "description": "Entrega de útiles escolares completos para 50 niños de escuela primaria en Santiago de Cuba. Incluyó cuadernos, lápices, mochilas y uniformes.",
                "image": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600",
                "date": "2026-05-20",
                "amount": Decimal("400"),
                "location": "Santiago de Cuba",
            },
            {
                "id": 5,
                "title": "Alimentos para hogar de ancianos",
                "description": "Donación de alimentos no perecederos, medicamentos y productos de higiene para el hogar de ancianos \"Hermanos Cruz\" en La Habana.",
                "image": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600",
                "date": "2026-05-05",
                "amount": Decimal("600"),
                "location": "La Habana",
            },
            {
                "id": 6,
                "title": "Materiales para escuela rural",
                "description": "Envío de materiales educativos, deportivos y artísticos a escuela rural en Pinar del Río con 120 alumnos y recursos muy limitados.",
                "image": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600",
                "date": "2026-04-18",
                "amount": Decimal("450"),
                "location": "Pinar del Río",
            },
        ]

        for data in seed:
            SocialAid.objects.update_or_create(
                id=data["id"],
                defaults={k: v for k, v in data.items() if k != "id"},
            )
