import { clsx } from 'clsx'
import type { BookingStatus } from '@/types'

const STATUS_LABELS: Record<BookingStatus, string> = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  completado: 'Completado',
  cancelado: 'Cancelado',
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={clsx('text-xs px-2.5 py-1 rounded-full font-medium', {
      'badge-confirmed': status === 'confirmado',
      'badge-pending': status === 'pendiente',
      'badge-completed': status === 'completado',
      'badge-cancelled': status === 'cancelado',
    })}>
      {STATUS_LABELS[status]}
    </span>
  )
}
