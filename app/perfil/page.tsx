'use client'
import { useState, useEffect, useRef } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { createClient } from '@/lib/supabase-browser'

const supabase = createClient()

export default function PerfilPage() {
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const [userId, setUserId] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [djName, setDjName] = useState('')
  const [bio, setBio] = useState('')
  const [city, setCity] = useState('')
  const [instagram, setInstagram] = useState('')
  const [soundcloud, setSoundcloud] = useState('')

  useEffect(() => { loadProfile() }, [])

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }
    setUserId(user.id)

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data) {
      setDjName(data.nombre_artistico || data.dj_name || '')
      setBio(data.bio || '')
      setCity(data.ciudad || data.city || '')
      setInstagram(data.instagram || '')
      setSoundcloud(data.soundcloud || '')
      setAvatarUrl(data.avatar_url || '')
    } else {
      const nombre = user.user_metadata?.nombre_artistico || user.email?.split('@')[0] || 'DJ'
      setDjName(nombre)
      await supabase.from('profiles').insert({ id: user.id, nombre_artistico: nombre })
    }
    setLoading(false)
  }

  async function uploadAvatar(file: File) {
    if (!userId) return
    setUploading(true)
    setMsg('')

    const ext = file.name.split('.').pop()
    const path = `${userId}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setMsg('Error uploading: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(path)

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId)

    if (updateError) {
      setMsg('Error saving avatar: ' + updateError.message)
    } else {
      setAvatarUrl(publicUrl + '?t=' + Date.now())
      setMsg('Avatar updated!')
    }
    setUploading(false)
  }

  async function saveProfile() {
    setSaving(true)
    setMsg('')
    if (!userId) { setSaving(false); setMsg('Error: no session'); return }

    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      nombre_artistico: djName,
      dj_name: djName,
      bio,
      ciudad: city,
      city,
      instagram,
      soundcloud,
    })

    if (error) {
      setMsg('Error saving: ' + error.message)
    } else {
      setMsg('Saved successfully')
      setEditing(false)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted text-sm">Loading profile...</div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div>
        <h1 className="page-title">My professional profile</h1>
        <p className="page-sub">Your public identity as a DJ</p>

        {msg && (
          <div className={`mb-4 p-3 rounded-xl text-sm ${msg.includes('Error') ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
            {msg}
          </div>
        )}

        <div className="card mb-5">
          <div className="flex items-start gap-5">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="w-20 h-20 rounded-full overflow-hidden cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-accent2 to-accent flex items-center justify-center font-display text-2xl font-extrabold text-bg">
                    {(djName || 'DJ').slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {uploading ? '...' : '📷'}
                  </span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) uploadAvatar(file)
                }}
              />
            </div>

            <div className="flex-1">
              {editing ? (
                <input className="form-input text-xl font-bold mb-2" value={djName} onChange={e => setDjName(e.target.value)} placeholder="Your artist name" />
              ) : (
                <div className="font-display text-2xl font-extrabold text-white mb-1">{djName || 'Your artist name'}</div>
              )}
              {editing ? (
                <textarea className="form-input mt-2" value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Write your professional bio..." />
              ) : (
                <div className="text-muted text-sm leading-relaxed max-w-xl mt-1">{bio || 'Add your professional bio...'}</div>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            {editing ? (
              <>
                <button className="btn-primary" onClick={saveProfile} disabled={saving}>
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
                <button className="btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
              </>
            ) : (
              <button className="btn-ghost" onClick={() => setEditing(true)}>Edit profile</button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="card">
            <div className="text-xs text-muted mb-3 font-medium uppercase tracking-wider">Information</div>
            <div className="space-y-3">
              <div>
                <label className="form-label">City</label>
                {editing ? (
                  <input className="form-input" value={city} onChange={e => setCity(e.target.value)} placeholder="Berlin, London..." />
                ) : (
                  <div className="text-sm text-white">{city || '—'}</div>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="text-xs text-muted mb-3 font-medium uppercase tracking-wider">Social media</div>
            <div className="space-y-3">
              <div>
                <label className="form-label">Instagram</label>
                {editing ? (
                  <input className="form-input" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="@yourname" />
                ) : (
                  <div className="text-sm text-white">{instagram || '—'}</div>
                )}
              </div>
              <div>
                <label className="form-label">SoundCloud</label>
                {editing ? (
                  <input className="form-input" value={soundcloud} onChange={e => setSoundcloud(e.target.value)} placeholder="soundcloud.com/yourname" />
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
