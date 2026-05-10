'use client'
import { useState, useEffect } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { createClient } from '@/lib/supabase-browser'

const supabase = createClient()

interface Booking {
  id: string
  venue_name: string
  venue_city: string
  event_date: string
  start_time: string
  duration_hours: number
  genre: string
  cachet: number
  currency: string
  status: string
  promoter_name: string
  promoter_email: string
  promoter_phone: string
  notes: string
}

const STATUS_COLORS: Record<string, string> = {
  confirmado: 'text-green-400 bg-green-400/10',
  confirmed: 'text-green-400 bg-green-400/10',
  pendiente: 'text-yellow-400 bg-yellow-400/10',
  pending: 'text-yellow-400 bg-yellow-400/10',
  completado: 'text-muted bg-white/[0.05]',
  completed: 'text-muted bg-white/[0.05]',
  cancelado: 'text-red-400 bg-red-400/10',
  cancelled: 'text-red-400 bg-red-400/10',
}

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    loadBookings()
  }, [])

  async function loadBookings() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }
    setUserId(user.id)

    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('event_date', { ascending: true })

    setBookings(data || [])
    setLoading(false)
  }

  async function deleteBooking(id: string) {
    await supabase.from('bookings').delete().eq('id', id)
    loadBookings()
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b =>
    b.status === filter || b.status === (filter === 'confirmed' ? 'confirmado' : filter === 'pending' ? 'pendiente' : filter === 'completed' ? 'completado' : 'cancelado')
  )

  const totalRevenue = filtered
    .filter(b => b.status === 'confirmed' || b.status === 'confirmado' || b.status === 'completed' || b.status === 'completado')
    .reduce((sum, b) => sum + (b.cachet || 0), 0)

  return (
    <AppLayout>
      <div>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="page-title">Bookings</h1>
            <p className="page-sub mb-0">Manage all your gigs</p>
          </div>
          <button className="btn-primary" onClick={() => setShowNew(true)}>
            + New booking
          </button>
        </div>

        <div className="card">
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

          {loading ? (
            <div className="text-muted text-sm py-8 text-center">Loading bookings...</div>
          ) : filtered.length === 0 ? (
            <div className="text-muted text-sm py-8 text-center">
              {filter === 'all' ? 'No bookings yet. Add your first one!' : `No ${filter} bookings.`}
            </div>
          ) : (
            <div>
              {filtered.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between py-3.5 border-b border-white/[0.06] last:border-0">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{booking.venue_name}</div>
                    <div className="text-xs text-muted mt-1">
                      {new Date(booking.event_date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      {booking.start_time && ` · ${booking.start_time}`}
                      {booking.duration_hours && ` · ${booking.duration_hours}h`}
                      {booking.genre && ` · ${booking.genre}`}
                    </div>
                    {booking.promoter_email && (
                      <div className="text-xs text-muted/60 mt-0.5">{booking.promoter_email}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-sm font-semibold text-accent">
                      €{(booking.cachet || 0).toLocaleString()}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[booking.status] || 'text-muted bg-white/[0.05]'}`}>
                      {booking.status}
                    </span>
                    <button
                      className="text-xs text-muted hover:text-red-400 transition-colors px-2 py-1 rounded bg-surface2"
                      onClick={() => deleteBooking(booking.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-xs text-muted">{filtered.length} bookings</span>
            <span className="text-sm text-white">
              Total: <span className="text-accent font-semibold">€{totalRevenue.toLocaleString()}</span>
            </span>
          </div>
        </div>

        {showNew && (
          <NewBookingModal
            userId={userId}
            onClose={() => setShowNew(false)}
            onSaved={() => { setShowNew(false); loadBookings() }}
          />
        )}
      </div>
    </AppLayout>
  )
}

function NewBookingModal({ userId, onClose, onSaved }: { userId: string; onClose: () => void; onSaved: () => void }) {
  const [venueName, setVenueName] = useState('')
  const [venueCity, setVenueCity] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [startTime, setStartTime] = useState('23:00')
  const [duration, setDuration] = useState(4)
  const [genre, setGenre] = useState('')
  const [cachet, setCachet] = useState('')
  const [status, setStatus] = useState('pendiente')
  const [promoterEmail, setPromoterEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function save() {
    if (!venueName || !eventDate) { setError('Venue and date are required.'); return }
    setSaving(true)
    const supabase2 = createClient()
    const { data: { user } } = await supabase2.auth.getUser()
    console.log('USER:', user?.id)
    if (!user) { setError('Not logged in.'); setSaving(false); return }
    const insertData = {
      user_id: user.id,
      venue_name: venueName,
      venue_city: venueCity,
      event_date: eventDate,
      duration_hours: duration,
      genre,
      cachet: parseInt(cachet) || 0,
      status,
      promoter_email: promoterEmail,
      notes,
    }
    console.log('INSERT DATA:', JSON.stringify(insertData))
    const { error } = await supabase2.from('bookings').insert(insertData)
    if (error) { setError(JSON.stringify(error)); setSaving(false); return }
    onSaved()
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-white/[0.08] rounded-2xl p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold">New booking</h2>
          <button onClick={onClose} className="text-muted hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="form-label">Venue / Event *</label>
            <input className="form-input" placeholder="Club, festival, private event..." value={venueName} onChange={e => setVenueName(e.target.value)} />
          </div>
          <div>
            <label className="form-label">City</label>
            <input className="form-input" placeholder="Berlin, London..." value={venueCity} onChange={e => setVenueCity(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Date *</label>
              <input className="form-input" type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Fee (€)</label>
              <input className="form-input" type="number" placeholder="500" value={cachet} onChange={e => setCachet(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Start time</label>
              <input className="form-input" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Duration (hours)</label>
              <input className="form-input" type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} min="1" max="12" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Genre</label>
              <input className="form-input" placeholder="Techno, House..." value={genre} onChange={e => setGenre(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Status</label>
              <select className="form-input" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="pendiente">Pending</option>
                <option value="confirmado">Confirmed</option>
                <option value="completado">Completed</option>
                <option value="cancelado">Cancelled</option>
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">Promoter email</label>
            <input className="form-input" type="email" placeholder="booking@venue.com" value={promoterEmail} onChange={e => setPromoterEmail(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Notes</label>
            <textarea className="form-input" placeholder="Rider, special instructions..." rows={2} value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>

        {error && <div className="mt-3 text-xs text-red-400">{error}</div>}

        <div className="flex gap-3 mt-5">
          <button className="btn-primary flex-1" onClick={save} disabled={saving}>
            {saving ? 'Saving...' : 'Save booking'}
          </button>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
