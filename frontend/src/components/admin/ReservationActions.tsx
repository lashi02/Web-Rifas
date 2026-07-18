import { useState } from 'react';

interface Reservation {
  id: string;
  raffle: string;
  name: string;
  phone: string;
  numbers: number[];
  amount: number;
  time: string;
  status: string;
}

interface Props {
  reservation: Reservation;
  onApprove: (id: string) => void;
  onCancel: (id: string, reason: string) => void;
}

export default function ReservationActions({ reservation, onApprove, onCancel }: Props) {
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [actionDone, setActionDone] = useState<'approved' | 'cancelled' | null>(null);

  const handleApprove = () => {
    onApprove(reservation.id);
    setActionDone('approved');
    setShowApproveConfirm(false);
  };

  const handleCancel = () => {
    if (!cancelReason.trim()) return;
    onCancel(reservation.id, cancelReason);
    setActionDone('cancelled');
    setShowCancelConfirm(false);
    setCancelReason('');
  };

  if (actionDone === 'approved') {
    return (
      <div className="flex items-center gap-2 text-green">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
        </svg>
        <span className="text-sm font-semibold">Aprobado</span>
      </div>
    );
  }

  if (actionDone === 'cancelled') {
    return (
      <div className="flex items-center gap-2 text-red">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        <span className="text-sm font-semibold">Cancelado</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowApproveConfirm(true)}
          className="rounded-lg bg-green/20 px-3 py-1.5 text-xs font-semibold text-green transition-colors hover:bg-green/30"
        >
          Aprobar
        </button>
        <button
          onClick={() => setShowCancelConfirm(true)}
          className="rounded-lg bg-red/20 px-3 py-1.5 text-xs font-semibold text-red transition-colors hover:bg-red/30"
        >
          Cancelar
        </button>
      </div>

      {/* Approve Confirmation Modal */}
      {showApproveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-dark-border bg-dark-card p-6 shadow-xl">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green/20 mx-auto">
              <svg className="h-7 w-7 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 className="mb-2 text-center text-xl font-bold text-white">¿Aprobar pago?</h3>
            <p className="mb-4 text-center text-neutral-400">
              Se confirmará el pago de <span className="font-semibold text-gold">${reservation.amount}</span> de{' '}
              <span className="font-semibold text-white">{reservation.name}</span> por los números{' '}
              <span className="font-semibold text-white">{reservation.numbers.join(', ')}</span> en la rifa{' '}
              <span className="font-semibold text-white">{reservation.raffle}</span>.
            </p>
            <p className="mb-6 text-center text-sm text-amber">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveConfirm(false)}
                className="flex-1 rounded-xl border border-dark-border bg-dark py-3 font-semibold text-neutral-300 transition-colors hover:text-white"
              >
                Volver
              </button>
              <button
                onClick={handleApprove}
                className="flex-1 rounded-xl bg-green py-3 font-bold text-white transition-colors hover:bg-green-dark"
              >
                Sí, Aprobar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-dark-border bg-dark-card p-6 shadow-xl">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red/20 mx-auto">
              <svg className="h-7 w-7 text-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <h3 className="mb-2 text-center text-xl font-bold text-white">¿Cancelar reserva?</h3>
            <p className="mb-4 text-center text-neutral-400">
              Se cancelará la reserva de <span className="font-semibold text-white">{reservation.name}</span> por los números{' '}
              <span className="font-semibold text-white">{reservation.numbers.join(', ')}</span>.
            </p>
            <p className="mb-4 text-center text-sm text-amber">
              Los números volverán a estar disponibles.
            </p>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-neutral-300">Motivo de cancelación *</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ej: Pago no recibido, datos incorrectos, cliente solicita cancelación..."
                rows={3}
                className="w-full rounded-lg border border-dark-border bg-dark px-4 py-3 text-white placeholder-neutral-500 focus:border-red focus:outline-none resize-none"
              />
              {!cancelReason.trim() && (
                <p className="mt-1 text-xs text-red">El motivo es obligatorio</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelConfirm(false);
                  setCancelReason('');
                }}
                className="flex-1 rounded-xl border border-dark-border bg-dark py-3 font-semibold text-neutral-300 transition-colors hover:text-white"
              >
                Volver
              </button>
              <button
                onClick={handleCancel}
                disabled={!cancelReason.trim()}
                className="flex-1 rounded-xl bg-red py-3 font-bold text-white transition-colors hover:bg-red/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sí, Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
