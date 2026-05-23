'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'

const ADMIN_EMAIL = 'arreguiarregui@gmail.com'

interface Profile {
  id: string
  dj_name: string
  city: string
  plan: string
  ai_credits_used: number
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

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user || user.email !== ADMIN_EMAIL) {
        router.push('/dashboard')
        return
      }

      setAuthorized(true)

      // Stats
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      const { count: proUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('plan', 'pro')

      const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })

      const { count: totalAI } = await supabase
        .from('ai_generations')
        .select('*', { count: 'exact', head: true })

      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const { count: newThisWeek } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString())

      setStats({
        total_users: totalUsers || 0,
        pro_users: proUsers || 0,
        total_bookings: totalBookings || 0,
        new_this_week: newThisWeek || 0,
        total_ai_generations: totalAI || 0,
      })

      // Latest users
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, dj_name, city, plan, ai_credits_used, created_at')
        .order('created_at', { ascending: false })
        .limit(20)

      setUsers(profiles || [])
      setLoading(false)
    }

    load()
  }, [router])

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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="page-title"><span className="text-accent">Beat</span>Broker Admin</h1>
            <p className="page-sub">Panel de control · Solo visible para ti</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { label: 'Total usuarios', value: stats?.total_users },
            { label: 'Nuevos esta semana', value: stats?.new_this_week },
            { label: 'Usuarios Pro', value: stats?.pro_users, accent2: true },
            { label: 'Bookings creados', value: stats?.total_bookings },
            { label: 'Usos de IA', value: stats?.total_ai_generations },
          ].map((s) => (
            <div key={s.label} className="card">
              <div className={`stat-value ${s.accent2 ? 'text-accent2' : ''}`}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Users table */}
        <div className="card">
          <div className="section-title mb-4">Últimos registros</div>
          <div className="space-y-0">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent flex-shrink-0">
                    {(u.dj_name || 'DJ').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{u.dj_name || 'Sin nombre'}</div>
                    <div className="text-xs text-muted">{u.city || 'Sin ciudad'} · {u.ai_credits_used} usos IA</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.plan === 'pro' ? 'text-accent2 bg-accent2/10' : 'text-muted bg-white/5'}`}>
                    {u.plan}
                  </span>
                  <span className="text-xs text-muted">
                    {new Date(u.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
