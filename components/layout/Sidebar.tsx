'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '⬡', section: 'PRINCIPAL' },
  { href: '/bookings', label: 'Bookings', icon: '◈' },
  { href: '/calendario', label: 'Calendario', icon: '◷' },
  { href: '/perfil', label: 'Mi perfil', icon: '◉' },
  { href: '/mentoring', label: 'Plan de carrera IA', icon: '🎯', section: 'HERRAMIENTAS IA', badge: 'NUEVO' },
  { href: '/negociador', label: 'Negociador de cachet', icon: '💰', badge: 'NUEVO' },
  { href: '/research', label: 'Research de venues', icon: '🔍', badge: 'NUEVO' },
  { href: '/inspiracion', label: 'Inspiración musical', icon: '🎵', badge: 'NUEVO' },
  { href: '/marketing', label: 'Marketing IA', icon: '◈' },
  { href: '/chat', label: 'Asistente IA', icon: '◎' },
]

interface SidebarProps {
  djName?: string
  plan?: 'free' | 'pro'
}

export default function Sidebar({ djName = 'DJ TuNombre', plan = 'free' }: SidebarProps) {
  const pathname = usePathname()

  return (
    <nav className="w-[220px] min-h-screen bg-surface border-r border-white/[0.08] flex flex-col px-4 py-6 fixed left-0 top-0 bottom-0 overflow-y-auto">
      <div className="font-display text-xl font-extrabold text-accent tracking-tight mb-7 px-2">
        DJ<span className="text-white">Book</span>
      </div>

      {navItems.map((item, i) => (
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

      <div className="mt-auto pt-4 border-t border-white/[0.08]">
        <div className="bg-surface2 border border-white/[0.08] rounded-xl p-3 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent2 to-accent flex items-center justify-center text-[11px] font-bold text-bg flex-shrink-0">
            {djName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-xs font-medium text-white">{djName}</div>
            <div className="text-[11px] text-accent">
              {plan === 'pro' ? '✦ Pro Plan' : '○ Plan Gratuito'}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
