'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function AiLimitBanner() {
  const [show, setShow] = useState(false)
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    async function check() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('plan, ai_credits_used, ai_credits_limit')
        .eq('id', user.id)
        .single()

      if (!profile || profile.plan === 'pro') return

      const left = profile.ai_credits_limit - profile.ai_credits_used
      if (left <= 3) {
        setRemaining(left)
        setShow(true)
      }
    }
    check()
  }, [])

  if (!show) return null

  return (
    <div className="fixed top-14 md:top-0 left-0 md:left-[220px] right-0 z-30 px-4 py-2 bg-accent/10 border-b border-accent/20 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-accent">⚡</span>
        <span className="text-white">
          You have <span className="text-accent font-semibold">{remaining} AI use{remaining !== 1 ? 's' : ''}</span> left this month.
        </span>
      </div>
      <a href="/pricing" className="text-xs text-accent border border-accent/30 px-3 py-1 rounded-full hover:bg-accent/10 transition-colors whitespace-nowrap">
        Upgrade to Pro →
      </a>
      <button onClick={() => setShow(false)} className="text-muted hover:text-white text-xs flex-shrink-0">✕</button>
    </div>
  )
}
