'use client'

// TEMP: login gate disabled — the Supabase login flow is broken and was
// locking everyone out. Bypassing it so the app is usable while we fix
// auth properly. No accounts/schema were touched, /login still exists,
// this can be reverted by restoring the block below.
//
// import { useEffect } from 'react'
// import { createClient } from './supabase-browser'
//
export function useAuth() {
  // useEffect(() => {
  //   async function check() {
  //     const supabase = createClient()
  //     const { data: { user } } = await supabase.auth.getUser()
  //     if (!user) {
  //       window.location.href = '/login'
  //     }
  //   }
  //   check()
  // }, [])
}
