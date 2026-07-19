import { useState } from 'react';

interface Client {
  name: string;
  phone: string;
  province: string;
  beneficiary?: string;
  raffle: string;
  numbers: number[];
  amount: number;
  time: string;
  status: string;
}

interface Props {
  client: Client;
  children: React.ReactNode;
}

export default function ClientDetails({ client, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="text-left hover:opacity-80">
        {children}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setIsOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl border border-dark-border bg-dark-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Datos del Cliente</h3>
              <button onClick={() => setIsOpen(false)} className="text-neutral-500 hover:text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 text-2xl font-bold text-gold">
                {client.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">{client.name}</h4>
                <p className="text-sm text-neutral-400">{client.raffle}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-dark p-4">
                <span className="text-sm text-neutral-500">Teléfono / WhatsApp</span>
                <a href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-green hover:text-green-dark">
                  {client.phone}
                </a>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-dark p-4">
                <span className="text-sm text-neutral-500">Provincia / País</span>
                <span className="text-sm font-semibold text-white">{client.province}</span>
              </div>

              {client.beneficiary && (
                <div className="flex items-center justify-between rounded-lg bg-dark p-4">
                  <span className="text-sm text-neutral-500">Beneficiario en Cuba</span>
                  <span className="text-sm font-semibold text-white">{client.beneficiary}</span>
                </div>
              )}

              <div className="flex items-center justify-between rounded-lg bg-dark p-4">
                <span className="text-sm text-neutral-500">Números reservados</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {client.numbers.map((n) => (
                    <span key={n} className="rounded bg-gold/20 px-2 py-0.5 text-xs font-semibold text-gold">
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-dark p-4">
                <span className="text-sm text-neutral-500">Monto total</span>
                <span className="text-lg font-bold text-gold">${client.amount}</span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-dark p-4">
                <span className="text-sm text-neutral-500">Hora de reserva</span>
                <span className="text-sm text-white">{client.time}</span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-dark p-4">
                <span className="text-sm text-neutral-500">Estado</span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  client.status === 'pending' ? 'bg-amber/20 text-amber' :
                  client.status === 'confirmed' ? 'bg-green/20 text-green' :
                  'bg-red/20 text-red'
                }`}>
                  {client.status === 'pending' ? 'Pendiente' :
                   client.status === 'confirmed' ? 'Confirmado' : 'Cancelado'}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(client.name)}%2C%20tu%20reserva%20de%20los%20n%C3%BAmeros%20${client.numbers.join(',')}%20est%C3%A1%20pendiente.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green py-3 font-semibold text-white transition-colors hover:bg-green-dark"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-xl border border-dark-border bg-dark py-3 font-semibold text-neutral-300 transition-colors hover:text-white"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
