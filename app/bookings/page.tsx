'use client'
import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { StatusBadge } from '@/components/ui/Badge'
import type { Booking, BookingStatus } from '@/types'

// Datos de ejemplo — en producción vendrán de Supabase
const MOCK_BOOKINGS: Booking[] = [
  { id: '1', created_at: '', user_id: '', venue_name: 'Club Fabrik, Madrid', venue_city: 'Madrid', event_date: '2025-05-10', start_time: '23:00', duration_hours: 5, genre: 'Techno', cachet: 600, currency: 'EUR', travel_included: true, accomodation_included: false, status: 'confirmado', promoter_name: 'Juan García', promoter_email: 'juan@fabrik.es', promoter_phone: null, notes: null, rider_notes: null },
  { id: '2', created_at: '', user_id: '', venue_name: 'Terraza Sala Equis, Barcelona', venue_city: 'Barcelona', event_date: '2025-05-11', start_time: '16:00', duration_hours: 5, genre: 'House', cachet: 450, currency: 'EUR', travel_included: false, accomodation_included: false, status: 'pendiente', promoter_name: null, promoter_email: 'booking@salaequis.com', promoter_phone: null, notes: null, rider_notes: null },
  { id: '3', created_at: '', user_id: '', venue_name: 'Boda privada · Sevilla', venue_city: 'Sevilla', event_date: '2025-05-17', start_time: '20:00', duration_hours: 7, genre: 'Mixed', cachet: 900, currency: 'EUR', travel_included: true, accomodation_included: true, status: 'confirmado', promoter_name: 'Ana & Carlos', promoter_email: 'anaycarlos2025@gmail.com', promoter_phone: '+34 612 345 678', notes: 'Ceremonia 20h, cena 22h, pista 00h-03h', rider_notes: null },
  { id: '4', created_at: '', user_id: '', venue_name: 'Festival Electrobeach', venue_city: 'Valencia', event_date: '2025-05-03', start_time: '02:00', duration_hours: 2, genre: 'Techno', cachet: 750, currency: 'EUR', travel_included: true, accomodation_included: true, status: 'completado', promoter_name: null, promoter_email: null, promoter_phone: null, notes: null, rider_notes: null },
  { id: '5', created_at: '', user_id: '', venue_name: 'Rooftop Club, Málaga', venue_city: 'Málaga', event_date: '2025-05-24', start_time: '22:00', duration_hours: 5, genre: 'Afrohouse', cachet: 500, currency: 'EUR', travel_included: false, accomodation_included: false, status: 'pendiente', promoter_name: null, promoter_email: null, promoter_phone: null, notes: null, rider_notes: null },
]

const FILTERS: { value: BookingStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'confirmado', label: 'Confirmados' },
  { value: 'pendiente', label: 'Pendientes' },
  { value: 'completado', label: 'Completados' },
  { value: 'cancelado', label: 'Cancelados' },
]

export default function BookingsPage() {
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all')
  const [showNew, setShowNew] = useState(false)

  const filtered = filter === 'all' ? MOCK_BOOKINGS : MOCK_BOOKINGS.filter(b => b.status === filter)

  const totalRevenue = filtered
    .filter(b => b.status === 'confirmado' || b.status === 'completado')
    .reduce((sum, b) => sum + b.cachet, 0)

  return (
    <AppLayout>
      <div>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="page-title">Bookings</h1>
            <p className="page-sub mb-0">Gestiona todas tus actuaciones</p>
          </div>
          <button className="btn-primary" onClick={() => setShowNew(true)}>
            + Nuevo booking
          </button>
        </div>

        <div className="card">
          {/* Filters */}
          <div className="flex gap-2 mb-5">
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={filter === f.value ? 'btn-primary text-sm py-1.5 px-3' : 'btn-ghost text-sm py-1.5 px-3'}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div>
            {filtered.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between py-3.5 border-b border-white/[0.06] last:border-0">
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{booking.venue_name}</div>
                  <div className="text-xs text-muted mt-1">
                    {new Date(booking.event_date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                    {booking.start_time && ` · ${booking.start_time}`}
                    {` · ${booking.duration_hours}h`}
                    {booking.genre && ` · ${booking.genre}`}
                  </div>
                  {booking.promoter_email && (
                    <div className="text-xs text-muted/60 mt-0.5">{booking.promoter_email}</div>
                  )}
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className={`text-sm font-semibold ${booking.status === 'completado' ? 'text-muted' : 'text-accent'}`}>
                    €{booking.cachet.toLocaleString()}
                  </span>
                  <StatusBadge status={booking.status} />
                  <button className="text-xs text-muted hover:text-white transition-colors px-2 py-1 rounded bg-surface2">
                    ···
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-xs text-muted">{filtered.length} bookings</span>
            <span className="text-sm text-white">
              Total: <span className="text-accent font-semibold">€{totalRevenue.toLocaleString()}</span>
            </span>
          </div>
        </div>

        {/* New booking modal */}
        {showNew && <NewBookingModal onClose={() => setShowNew(false)} />}
      </div>
    </AppLayout>
  )
}

function NewBookingModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-white/[0.08] rounded-2xl p-7 w-full max-w-lg">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold">Nuevo booking</h2>
          <button onClick={onClose} className="text-muted hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="form-label">Venue / Evento *</label>
            <input className="form-input" placeholder="Club, festival, boda privada..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Fecha *</label>
              <input className="form-input" type="date" />
            </div>
            <div>
              <label className="form-label">Cachet (€) *</label>
              <input className="form-input" type="number" placeholder="500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Hora inicio</label>
              <input className="form-input" type="time" defaultValue="23:00" />
            </div>
            <div>
              <label className="form-label">Duración (horas)</label>
              <input className="form-input" type="number" defaultValue="4" min="1" max="12" />
            </div>
          </div>
          <div>
            <label className="form-label">Género musical</label>
            <input className="form-input" placeholder="Techno, House, Mixed..." />
          </div>
          <div>
            <label className="form-label">Email del promotor</label>
            <input className="form-input" type="email" placeholder="booking@venue.com" />
          </div>
          <div>
            <label className="form-label">Notas</label>
            <textarea className="form-input" placeholder="Rider, instrucciones especiales..." rows={2} />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button className="btn-primary flex-1">Guardar booking</button>
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}
