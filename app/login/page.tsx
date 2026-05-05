'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit() {
    if (!email || !password) return
    setLoading(true)
    setError('')
    setSuccess('')
    const supabase = createClient()
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('Email o contrasena incorrectos.')
        setLoading(false)
      } else {
        window.location.href = '/dashboard'
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nombre_artistico: nombre },
          emailRedirectTo: window.location.origin + '/auth/callback',
        },
      })
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Revisa tu email para confirmar.')
      }
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-2xl font-medium text-white mb-1">DJBook Pro</div>
          <div className="text-sm text-muted">Tu manager de bookings con IA</div>
        </div>
        <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex gap-1 bg-white/[0.05] rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); setSuccess('') }}
              className={`flex-1 text-sm py-2 rounded-lg transition-all ${mode === 'login' ? 'bg-white/10 text-white font-medium' : 'text-muted'}`}
            >
              Entrar
            </button>
            <button
              onClick={() => { setMode('registro'); setError(''); setSuccess('') }}
              className={`flex-1 text-sm py-2 rounded-lg transition-all ${mode === 'registro' ? 'bg-white/10 text-white font-medium' : 'text-muted'}`}
            >
              Registrarse
            </button>
          </div>
          <div className="space-y-3">
            {mode === 'registro' && (
              <div>
                <label className="text-xs text-muted mb-1.5 block">Nombre artistico</label>
                <input
                  className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-white/20"
                  placeholder="DJ TuNombre"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                />
              </div>
            )}
            <div>
              <label className="text-xs text-muted mb-1.5 block">Email</label>
              <input
                type="email"
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-white/20"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            <div>
              <label className="text-xs text-muted mb-1.5 block">Contrasena</label>
              <input
                type="password"
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-white/20"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-xs text-green-400">
              {success}
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading || !email || !password}
            className="w-full mt-5 py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? '...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </div>
      </div>
    </div>
  )
}
