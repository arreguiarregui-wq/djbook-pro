'use client'
import { useEffect } from 'react'
import { createClient } from './supabase-browser'

export function useAuth() {
  useEffect(() => {
    async function check() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
      }
    }
    check()
  }, [])
}
