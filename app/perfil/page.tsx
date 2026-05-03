'use client'
import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'

export default function PerfilPage() {
  const [editing, setEditing] = useState(false)
  const [djName, setDjName] = useState('DJ TuNombre')
  const [bio, setBio] = useState('DJ profesional con +8 años de experiencia en la escena electrónica europea. Residente en Madrid, con actuaciones en festivales y clubs de España, Alemania y Portugal.')
  const [city, setCity] = useState('Madrid')
  const [cachetMin, setCachetMin] = useState(300)
  const [cachetMax, setCachetMax] = useState(1200)
  const [instagram, setInstagram] = useState('@djtuNombre')

  return (
    <AppLayout>
      <div>
        <h1 className="page-title">Mi perfil profesional</h1>
        <p className="page-sub">Tu identidad pública como DJ</p>

        {/* Hero */}
        <div className="card mb-5 relative overflow-hidden">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent2 to-accent flex items-center justify-center font-display text-2xl font-extrabold text-bg flex-shrink-0">
              {djName.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              {editing ? (
                <input className="form-input text-xl font-bold mb-2" value={djName} onChange={e => setDjName(e.target.value)} />
              ) : (
                <div className="font-display text-2xl font-extrabold text-white mb-1">{djName}</div>
              )}
              <div className="text-accent text-sm mb-2">Techno · House · Afro House</div>
              {editing ? (
                <textarea className="form-input" value={bio} onChange={e => setBio(e.target.value)} rows={3} />
              ) : (
                <div className="text-muted text-sm leading-relaxed max-w-xl">{bio}</div>
              )}
              <div className="flex gap-2 flex-wrap mt-3">
                {['Techno', 'House', 'Afro House', 'Bodas', 'Festivales'].map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-surface2 border border-white/[0.08] text-muted">{tag}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            {editing ? (
              <>
                <button className="btn-primary" onClick={() => setEditing(false)}>Guardar cambios</button>
                <button className="btn-ghost" onClick={() => setEditing(false)}>Cancelar</button>
              </>
            ) : (
              <>
                <button className="btn-primary" onClick={() => setEditing(true)}>Editar perfil</button>
                <button className="btn-ghost">Ver perfil público</button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="card">
            <div className="form-label">Cachet desde</div>
            {editing ? (
              <input className="form-input" type="number" value={cachetMin} onChange={e => setCachetMin(Number(e.target.value))} />
            ) : (
              <div className="font-display text-3xl font-extrabold text-accent">€{cachetMin}</div>
            )}
            <div className="text-xs text-muted mt-1">Hasta €{cachetMax}/noche</div>
          </div>
          <div className="card">
            <div className="form-label">Disponibilidad</div>
            <div className="font-display text-xl font-bold text-accent mt-1">Vie – Dom</div>
            <div className="text-xs text-muted mt-1">Resto bajo consulta</div>
          </div>
          <div className="card">
            <div className="form-label">Rider técnico</div>
            <div className="text-sm text-white mt-1 space-y-0.5">
              <div>CDJ-3000 × 2</div>
              <div>DJM-900NXS2</div>
              <div>Monitor activo</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-title">Redes sociales</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Instagram', placeholder: '@djtuNombre', value: instagram, onChange: setInstagram },
              { label: 'SoundCloud', placeholder: 'soundcloud.com/tunombre', value: '', onChange: () => {} },
              { label: 'Resident Advisor', placeholder: 'ra.co/tunombre', value: '', onChange: () => {} },
              { label: 'Web', placeholder: 'www.tunombre.com', value: '', onChange: () => {} },
            ].map(field => (
              <div key={field.label}>
                <label className="form-label">{field.label}</label>
                <input
                  className="form-input"
                  placeholder={field.placeholder}
                  defaultValue={field.value}
                  readOnly={!editing}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
