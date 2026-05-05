'use client'
import { useState, useEffect } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { createClient } from '@/lib/supabase-browser'

export default function PerfilPage() {
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const [djName, setDjName] = useState('')
  const [bio, setBio] = useState('')
  const [city, setCity] = useState('')
  const [instagram, setInstagram] = useState('')
  const [soundcloud, setSoundcloud] = useState('')
  const [cachetMin, setCachetMin] = useState(300)
  const [cachetMax, setCachetMax] = useState(1200)

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setUserId(user.id)

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data) {
      setDjName(data.nombre_artistico || '')
      setBio(data.bio || '')
      setCity(data.ciudad || '')
      setInstagram(data.instagram || '')
      setSoundcloud(data.soundcloud || '')
    } else {
      // Create profile if doesn't exist
      const nombre = user.user_metadata?.nombre_artistico || user.email?.split('@')[0] || 'DJ'
      setDjName(nombre)
      await supabase.from('profiles').insert({
        id: user.id,
        nombre_artistico: nombre,
      })
    }
    setLoading(false)
  }

  async function saveProfile() {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }
    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      nombre_artistico: djName,
      bio,
      ciudad: city,
      instagram,
      soundcloud,
    })
    if (error) { console.error('Error saving:', error) } else { console.log('Saved!') }
    setSaving(false)
    setEditing(false)
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted text-sm">Cargando perfil...</div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div>
        <h1 className="page-title">Mi perfil profesional</h1>
        <p className="page-sub">Tu identidad publica como DJ</p>

        <div className="card mb-5">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent2 to-accent flex items-center justify-center font-display text-2xl font-extrabold text-bg flex-shrink-0">
              {(djName || 'DJ').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              {editing ? (
                <input className="form-input text-xl font-bold mb-2" value={djName} onChange={e => setDjName(e.target.value)} placeholder="Tu nombre artistico" />
              ) : (
                <div className="font-display text-2xl font-extrabold text-white mb-1">{djName || 'Tu nombre artistico'}</div>
              )}
              {editing ? (
                <textarea className="form-input mt-2" value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Escribe tu bio profesional..." />
              ) : (
                <div className="text-muted text-sm leading-relaxed max-w-xl mt-1">{bio || 'Añade tu bio profesional...'}</div>
              )}
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            {editing ? (
              <>
                <button className="btn-primary" onClick={saveProfile} disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button className="btn-ghost" onClick={() => setEditing(false)}>Cancelar</button>
              </>
            ) : (
              <button className="btn-ghost" onClick={() => setEditing(true)}>Editar perfil</button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="card">
            <div className="text-xs text-muted mb-3 font-medium uppercase tracking-wider">Informacion</div>
            <div className="space-y-3">
              <div>
                <label className="form-label">Ciudad</label>
                {editing ? (
                  <input className="form-input" value={city} onChange={e => setCity(e.target.value)} placeholder="Berlin, Madrid..." />
                ) : (
                  <div className="text-sm text-white">{city || '—'}</div>
                )}
              </div>
              <div>
                <label className="form-label">Cachet minimo</label>
                {editing ? (
                  <input type="number" className="form-input" value={cachetMin} onChange={e => setCachetMin(Number(e.target.value))} />
                ) : (
                  <div className="text-sm text-white">€{cachetMin}</div>
                )}
              </div>
              <div>
                <label className="form-label">Cachet maximo</label>
                {editing ? (
                  <input type="number" className="form-input" value={cachetMax} onChange={e => setCachetMax(Number(e.target.value))} />
                ) : (
                  <div className="text-sm text-white">€{cachetMax}</div>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="text-xs text-muted mb-3 font-medium uppercase tracking-wider">Redes sociales</div>
            <div className="space-y-3">
              <div>
                <label className="form-label">Instagram</label>
                {editing ? (
                  <input className="form-input" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="@tunombre" />
                ) : (
                  <div className="text-sm text-white">{instagram || '—'}</div>
                )}
              </div>
              <div>
                <label className="form-label">SoundCloud</label>
                {editing ? (
                  <input className="form-input" value={soundcloud} onChange={e => setSoundcloud(e.target.value)} placeholder="soundcloud.com/tunombre" />
                ) : (
                  <div className="text-sm text-white">{soundcloud || '—'}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
