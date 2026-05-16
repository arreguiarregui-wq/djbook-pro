'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { clsx } from 'clsx'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '⬡', section: 'MAIN' },
  { href: '/bookings', label: 'Bookings', icon: '◈' },
  { href: '/perfil', label: 'My Profile', icon: '◉' },
  { href: '/mentoring', label: 'Career Plan AI', icon: '🎯', section: 'AI TOOLS', badge: 'NEW' },
  { href: '/negociador', label: 'Fee Negotiator', icon: '💰', badge: 'NEW' },
  { href: '/research', label: 'Venue Research', icon: '🔍', badge: 'NEW' },
  { href: '/inspiracion', label: 'Music Inspiration', icon: '🎵', badge: 'NEW' },
  { href: '/marketing', label: 'Marketing AI', icon: '◈' },
  { href: '/networking', label: 'DJ Network', icon: '◈', badge: 'NEW' },
  { href: '/chat', label: 'AI Assistant', icon: '◎' },
]

const bottomNavItems = [
  { href: '/dashboard', label: 'Home', icon: '⬡' },
  { href: '/bookings', label: 'Bookings', icon: '◈' },
  { href: '/research', label: 'Venues', icon: '🔍' },
  { href: '/chat', label: 'AI', icon: '◎' },
  { href: '/perfil', label: 'Profile', icon: '◉' },
]

interface SidebarProps {
  djName?: string
  plan?: 'free' | 'pro'
}

export default function Sidebar({ djName = 'DJ YourName', plan = 'free' }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

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
                'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all mb-0.5 w-full',
                pathname === item.href
                  ? 'bg-accent/10 text-accent'
                  : 'text-muted hover:bg-surface2 hover:text-white'
              )}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent2 to-accent flex items-center justify-center text-[11px] font-bold text-bg flex-shrink-0">
              {djName.slice(0, 2).toUpperCase()}
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

      {/* ── MOBILE DRAWER (menú completo) ── */}
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
                    'flex items-center gap-2.5 px-3 py-3 rounded-lg text-sm transition-all mb-0.5 w-full',
                    pathname === item.href
                      ? 'bg-accent/10 text-accent'
                      : 'text-muted hover:bg-surface2 hover:text-white'
                  )}
                >
                  <span className="text-base w-5 text-center">{item.icon}</span>
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
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent2 to-accent flex items-center justify-center text-[11px] font-bold text-bg flex-shrink-0">
                  {djName.slice(0, 2).toUpperCase()}
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
        {bottomNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all',
              pathname === item.href ? 'text-accent' : 'text-muted'
            )}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px]">{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  )
}
