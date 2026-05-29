'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { clsx } from 'clsx'
import { useState, useEffect } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', section: 'MAIN' },
  { href: '/bookings', label: 'Bookings' },
  { href: '/perfil', label: 'My Profile' },
  { href: '/mentoring', label: 'Career Plan AI', section: 'AI TOOLS', badge: 'NEW' },
  { href: '/negociador', label: 'Fee Negotiator', badge: 'NEW' },
  { href: '/research', label: 'Venue Research', badge: 'NEW' },
  { href: '/inspiracion', label: 'Music Inspiration', badge: 'NEW' },
  { href: '/marketing', label: 'Marketing AI' },
  { href: '/networking', label: 'DJ Network', badge: 'NEW' },
  { href: '/chat', label: 'AI Assistant' },
]

const bottomNavItems = [
  { href: '/dashboard', label: 'Home' },
  { href: '/research', label: 'Venues' },
  { href: '/inspiracion', label: 'Inspiration' },
  { href: '/networking', label: 'Network' },
]

interface SidebarProps {
  djName?: string
  plan?: 'free' | 'pro'
}

export default function Sidebar({ djName = 'DJ YourName', plan = 'free' }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
const [userPlan, setUserPlan] = useState(plan)
const [userName, setUserName] = useState(djName)

  useEffect(() => {
    async function loadAvatar() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url, plan, dj_name, nombre_artistico')
        .eq('id', user.id)
        .single()
      if (data?.avatar_url) setAvatarUrl(data.avatar_url)
if (data?.plan) setUserPlan(data.plan)
if (data?.dj_name || data?.nombre_artistico) setUserName(data.dj_name || data.nombre_artistico)
    }
    loadAvatar()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <nav className="hidden md:flex w-[220px] min-h-screen bg-surface border-r border-white/[0.08] flex-col px-4 py-6 fixed left-0 top-0 bottom-0 overflow-y-auto z-40">
        <div className="font-display text-xl font-extrabold text-accent tracking-tight mb-7 px-2">
          <span className="text-white">Beat</span>Broker
        </div>

        {navItems.map((item) => (
          <div key={item.href}>
            {item.section && (
              <div className="text-[10px] text-muted tracking-widest px-3 mt-4 mb-1.5">
                {item.section}
              </div>
            )}
            <Link
              href={item.href}
              className={clsx(
                'flex items-center px-3 py-2.5 rounded-lg text-sm transition-all mb-0.5 w-full',
                pathname === item.href
                  ? 'bg-accent/10 text-accent'
                  : 'text-muted hover:bg-surface2 hover:text-white'
              )}
            >
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          </div>
        ))}

        <div className="mt-auto pt-4 border-t border-white/[0.08] space-y-2">
          <div className="bg-surface2 border border-white/[0.08] rounded-xl p-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
  {avatarUrl ? (
    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
  ) : (
    <div className="w-full h-full bg-gradient-to-br from-accent2 to-accent flex items-center justify-center text-[11px] font-bold text-bg">
      {djName.slice(0, 2).toUpperCase()}
    </div>
  )}
</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white">{djName}</div>
              <div className="text-[11px] text-accent">
                {plan === 'pro' ? '✦ Pro Plan' : '○ Free Plan'}
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="text-[11px] text-muted hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/[0.05]"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE TOP BAR ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-surface border-b border-white/[0.08] flex items-center justify-between px-4 h-14">
        <div className="font-display text-lg font-extrabold tracking-tight">
          <span className="text-white">Beat</span><span className="text-accent">Broker</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white p-2 rounded-lg hover:bg-white/[0.08]"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* ── MOBILE DRAWER ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <nav className="relative w-[260px] bg-surface h-full flex flex-col px-4 py-6 overflow-y-auto">
            <div className="font-display text-xl font-extrabold tracking-tight mb-7 px-2">
              <span className="text-white">Beat</span><span className="text-accent">Broker</span>
            </div>

            {navItems.map((item) => (
              <div key={item.href}>
                {item.section && (
                  <div className="text-[10px] text-muted tracking-widest px-3 mt-4 mb-1.5">
                    {item.section}
                  </div>
                )}
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    'flex items-center px-3 py-3 rounded-lg text-sm transition-all mb-0.5 w-full',
                    pathname === item.href
                      ? 'bg-accent/10 text-accent'
                      : 'text-muted hover:bg-surface2 hover:text-white'
                  )}
                >
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </div>
            ))}

            <div className="mt-auto pt-4 border-t border-white/[0.08]">
              <div className="bg-surface2 border border-white/[0.08] rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
  {avatarUrl ? (
    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
  ) : (
    <div className="w-full h-full bg-gradient-to-br from-accent2 to-accent flex items-center justify-center text-[11px] font-bold text-bg">
      {djName.slice(0, 2).toUpperCase()}
    </div>
  )}
</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white">{djName}</div>
                  <div className="text-[11px] text-accent">
                    {plan === 'pro' ? '✦ Pro Plan' : '○ Free Plan'}
                  </div>
                </div>
                <button onClick={handleSignOut} className="text-[11px] text-muted hover:text-white px-2 py-1 rounded-lg">
                  Sign out
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* ── MOBILE BOTTOM NAV ── */}
<nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-white/[0.08] flex items-center justify-around px-2 h-16">
  {bottomNavItems.map((item) => {
    const active = pathname === item.href
    const glow = active ? 'drop-shadow(0 0 6px #fb7185) drop-shadow(0 0 12px rgba(251,113,133,0.5))' : 'none'
    const color = active ? '#fb7185' : 'rgba(255,255,255,0.35)'

    return (
      <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 px-3 py-2">
        {item.label === 'Home' && (
          <div style={{ fontFamily: 'serif', fontWeight: 900, fontSize: 13, letterSpacing: '-0.04em', lineHeight: 1, filter: glow, color: '#fb7185', opacity: active ? 1 : 0.4 }}>
            BeatBroker
          </div>
        )}
        {item.label === 'Venues' && (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ filter: glow }}>
            <rect x="3" y="8" width="18" height="13" rx="1" stroke={color} strokeWidth="1.5"/>
            <path d="M7 21 L7 14 Q7 13 8 13 L11 13 Q12 13 12 14 L12 21" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
            <rect x="14" y="13" width="4" height="4" rx="0.5" stroke={color} strokeWidth="1.5"/>
            <path d="M8 8 L12 3 L16 8" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        )}
        {item.label === 'Inspiration' && (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ filter: glow }}>
            <path d="M9 17 L9 7 L19 5 L19 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="7" cy="17" r="2.5" stroke={color} strokeWidth="1.5"/>
            <circle cx="17" cy="15" r="2.5" stroke={color} strokeWidth="1.5"/>
          </svg>
        )}
        {item.label === 'Network' && (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ filter: glow }}>
            <path d="M4 4 Q4 3 5 3 L19 3 Q20 3 20 4 L20 15 Q20 16 19 16 L8 16 L4 20 L4 4 Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M8 8 L16 8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M8 11.5 L13 11.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
        <span style={{ fontSize: 10, color: active ? '#fb7185' : 'rgba(255,255,255,0.35)', filter: active ? 'drop-shadow(0 0 4px #fb7185)' : 'none' }}>
          {item.label}
        </span>
      </Link>
    )
  })}
</nav>
    </>
  )
}
