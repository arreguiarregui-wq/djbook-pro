import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'

// Datos de ejemplo — en producción vendrán de Supabase
const stats = {
  bookings_this_month: 12,
  revenue_this_month: 3800,
  avg_rating: 4.9,
  response_rate: 94,
}

const upcomingBookings = [
  { id: '1', venue_name: 'Club Fabrik, Madrid', event_date: '2025-05-10', start_time: '23:00', genre: 'Techno', cachet: 600, status: 'confirmado' as const },
  { id: '2', venue_name: 'Terraza Sala Equis', event_date: '2025-05-11', start_time: '16:00', genre: 'House', cachet: 450, status: 'pendiente' as const },
  { id: '3', venue_name: 'Boda privada · Sevilla', event_date: '2025-05-17', start_time: '20:00', genre: 'Mixed', cachet: 900, status: 'confirmado' as const },
]

const statusColors: Record<string, string> = {
  confirmado: 'text-accent bg-accent/10',
  pendiente: 'text-yellow-400 bg-yellow-400/10',
}

export default function DashboardPage() {
  return (
    <AppLayout>
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-sub">Bienvenido de vuelta · 2 bookings pendientes</p>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="card">
            <div className="stat-value">{stats.bookings_this_month}</div>
            <div className="stat-label">Bookings este mes</div>
            <div className="text-xs text-green-400 mt-1">↑ +3 vs anterior</div>
          </div>
          <div className="card">
            <div className="stat-value">€{stats.revenue_this_month.toLocaleString()}</div>
            <div className="stat-label">Ingresos mes</div>
            <div className="text-xs text-green-400 mt-1">↑ +18%</div>
          </div>
          <div className="card">
            <div className="stat-value">{stats.avg_rating}★</div>
            <div className="stat-label">Valoración media</div>
            <div className="text-xs text-green-400 mt-1">47 reseñas</div>
          </div>
          <div className="card">
            <div className="stat-value">{stats.response_rate}%</div>
            <div className="stat-label">Tasa de respuesta</div>
            <div className="text-xs text-green-400 mt-1">↑ Excelente</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {/* Upcoming bookings */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <span className="section-title mb-0">Próximos bookings</span>
              <Link href="/bookings" className="text-xs text-muted hover:text-white transition-colors">
                Ver todos →
              </Link>
            </div>
            <div className="space-y-0">
              {upcomingBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
                  <div>
                    <div className="text-sm font-medium text-white">{b.venue_name}</div>
                    <div className="text-xs text-muted mt-0.5">
                      {new Date(b.event_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} · {b.start_time} · {b.genre}
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[b.status]}`}>
                    €{b.cachet}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI actions */}
          <div className="card">
            <div className="section-title">Herramientas IA rápidas</div>
            <div className="space-y-2">
              {[
                { href: '/negociador', icon: '💰', title: 'Negociador de cachet', sub: 'Calcula tu precio justo para cada venue' },
                { href: '/research', icon: '🔍', title: 'Research de venue', sub: 'Investiga un club antes de contactar' },
                { href: '/marketing', icon: '✦', title: 'Generador de contenido', sub: 'Bio, posts, emails con IA' },
                { href: '/chat', icon: '◎', title: 'Hablar con el asistente IA', sub: 'Tu manager virtual 24/7' },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 p-3 bg-surface2 border border-white/[0.08] rounded-xl hover:border-accent/25 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-sm flex-shrink-0">
                    {action.icon}
                  </div>
                  <div>
                    <div className="text-sm text-white group-hover:text-accent transition-colors">{action.title}</div>
                    <div className="text-xs text-muted mt-0.5">{action.sub}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
