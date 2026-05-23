'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'

const ADMIN_EMAIL = 'arreguiarregui@gmail.com'

interface Profile {
  id: string
  dj_name: string
  real_name: string
  city: string
  country: string
  plan: string
  ai_credits_used: number
  created_at: string
  genres: string[]
  experience_years: number
  cachet_min: number
  cachet_max: number
  instagram: string
  soundcloud: string
  bio: string
}

interface Booking {
  id: string
  venue_name: string
  venue_city: string
  event_date: string
  cachet: number
  status: string
  genre: string
}

interface AIGen {
  id: string
  type: string
  created_at: string
}

interface Stats {
  total_users: number
  pro_users: number
  total_bookings: number
  new_this_week: number
  total_ai_generations: number
}

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<Profile[]>([])
  const [selected, setSelected] = useState<Profile | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [aiGens, setAiGens] = useState<AIGen[]>([])
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [tab, setTab] = useState<'bookings' | 'ai'>('bookings')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user || user.email !== ADMIN_EMAIL) {
        router.push('/dashboard')
        return
      }

      setAuthorized(true)

      const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      const { count: proUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('plan', 'pro')
      const { count: totalBookings } = await supabase.from('bookings').select('*', { count: 'exact', head: true })
      const { count: totalAI } = await supabase.from('ai_generations').select('*', { count: 'exact', head: true })
      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7)
      const { count: newThisWeek } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo.toISOString())

      setStats({ total_users: totalUsers || 0, pro_users: proUsers || 0, total_bookings: totalBookings || 0, new_this_week: newThisWeek || 0, total_ai_generations: totalAI || 0 })

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, dj_name, real_name, city, country, plan, ai_credits_used, created_at, genres, experience_years, cachet_min, cachet_max, instagram, soundcloud, bio')
        .order('created_at', { ascending: false })

      setUsers(profiles || [])
      setLoading(false)
    }

    load()
  }, [router])

  async function inspectUser(profile: Profile) {
    setSelected(profile)
    setLoadingProfile(true)
    setTab('bookings')
    const supabase = createClient()

    const { data: bk } = await supabase
      .from('bookings')
      .select('id, venue_name, venue_city, event_date, cachet, status, genre')
      .eq('user_id', profile.id)
      .order('event_date', { ascending: false })

    const { data: ai } = await supabase
      .from('ai_generations')
      .select('id, type, created_at')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(20)

    setBookings(bk || [])
    setAiGens(ai || [])
    setLoadingProfile(false)
  }

  if (loading) return (
    <AppLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted text-sm">Loading...</div>
      </div>
    </AppLayout>
  )

  if (!authorized) return null

  return (
    <AppLayout>
      <div>
        <h1 className="page-title"><span className="text-accent">Beat</span>Broker Admin</h1>
        <p className="page-sub">Panel de control · Solo visible para ti</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { label: 'Total usuarios', value: stats?.total_users },
            { label: 'Nuevos esta semana', value: stats?.new_this_week },
            { label: 'Usuarios Pro', value: stats?.pro_users, accent: true },
            { label: 'Bookings creados', value: stats?.total_bookings },
            { label: 'Usos de IA', value: stats?.total_ai_generations },
          ].map((s) => (
            <div key={s.label} className="card">
              <div className={`stat-value ${s.accent ? 'text-accent2' : ''}`}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* User list */}
          <div className="card">
            <div className="section-title mb-4">Todos los DJs ({users.length})</div>
            <div className="space-y-0 max-h-[600px] overflow-y-auto">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => inspectUser(u)}
                  className={`w-full flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0 hover:bg-white/[0.03] transition-colors text-left px-1 rounded-lg ${selected?.id === u.id ? 'bg-accent/5 border-accent/20' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent flex-shrink-0">
                      {(u.dj_name || 'DJ').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{u.dj_name || 'Sin nombre'}</div>
                      <div className="text-xs text-muted">{u.city || 'Sin ciudad'} · {u.ai_credits_used} usos IA</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.plan === 'pro' ? 'text-accent2 bg-accent2/10' : 'text-muted bg-white/5'}`}>
                      {u.plan}
                    </span>
                    <span className="text-xs text-muted">→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Inspector panel */}
          <div className="card">
            {!selected ? (
              <div className="flex items-center justify-center h-40 text-muted text-sm">
                Selecciona un DJ para inspeccionar
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/[0.08]">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-sm font-bold text-accent flex-shrink-0">
                    {(selected.dj_name || 'DJ').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{selected.dj_name || 'Sin nombre'}</div>
                    <div className="text-xs text-muted">{selected.city}, {selected.country} · {selected.experience_years} años exp.</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selected.plan === 'pro' ? 'text-accent2 bg-accent2/10' : 'text-muted bg-white/5'}`}>
                    {selected.plan}
                  </span>
                </div>

                {selected.bio && (
                  <p className="text-xs text-muted mb-3 leading-relaxed">{selected.bio}</p>
                )}

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-surface2 rounded-lg p-2.5">
                    <div className="text-xs text-muted">Caché</div>
                    <div className="text-sm font-medium text-white">€{selected.cachet_min}–€{selected.cachet_max}</div>
                  </div>
                  <div className="bg-surface2 rounded-lg p-2.5">
                    <div className="text-xs text-muted">Usos IA</div>
                    <div className="text-sm font-medium text-white">{selected.ai_credits_used}</div>
                  </div>
                </div>

                {selected.genres?.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mb-4">
                    {selected.genres.map(g => (
                      <span key={g} className="text-xs bg-surface2 border border-white/[0.08] px-2 py-0.5 rounded-full text-muted">{g}</span>
                    ))}
                  </div>
                )}

                {/* Tabs */}
                <div className="flex gap-1 bg-white/[0.05] rounded-lg p-1 mb-3">
                  <button onClick={() => setTab('bookings')} className={`flex-1 text-xs py-1.5 rounded-md transition-all ${tab === 'bookings' ? 'bg-white/10 text-white' : 'text-muted'}`}>
                    Bookings ({bookings.length})
                  </button>
                  <button onClick={() => setTab('ai')} className={`flex-1 text-xs py-1.5 rounded-md transition-all ${tab === 'ai' ? 'bg-white/10 text-white' : 'text-muted'}`}>
                    Usos IA ({aiGens.length})
                  </button>
                </div>

                {loadingProfile ? (
                  <div className="text-xs text-muted text-center py-4">Cargando...</div>
                ) : tab === 'bookings' ? (
                  <div className="space-y-0 max-h-[250px] overflow-y-auto">
                    {bookings.length === 0 ? (
                      <div className="text-xs text-muted text-center py-4">Sin bookings todavía</div>
                    ) : bookings.map(b => (
                      <div key={b.id} className="flex items-center justify-between py-2.5 border-b border-white/[0.06] last:border-0">
                        <div>
                          <div className="text-xs font-medium text-white">{b.venue_name}</div>
                          <div className="text-xs text-muted">{b.event_date} · {b.genre}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-accent">€{b.cachet}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${b.status === 'confirmado' ? 'text-accent bg-accent/10' : 'text-yellow-400 bg-yellow-400/10'}`}>{b.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-0 max-h-[250px] overflow-y-auto">
                    {aiGens.length === 0 ? (
                      <div className="text-xs text-muted text-center py-4">Sin usos de IA todavía</div>
                    ) : aiGens.map(a => (
                      <div key={a.id} className="flex items-center justify-between py-2.5 border-b border-white/[0.06] last:border-0">
                        <span className="text-xs bg-surface2 px-2 py-0.5 rounded-full text-muted">{a.type}</span>
                        <span className="text-xs text-muted">{new Date(a.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </AppLayout>
  )
}
