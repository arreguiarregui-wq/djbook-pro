'use client'
import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import type { VenueResearch } from '@/types'

const QUICK_SEARCHES = [
  { name: 'Fabric', city: 'Londres', genre: 'Techno' },
  { name: 'Berghain', city: 'Berlín', genre: 'Techno' },
  { name: 'Fabrik', city: 'Madrid', genre: 'Techno' },
  { name: 'DC-10', city: 'Ibiza', genre: 'House' },
  { name: 'Tresor', city: 'Berlín', genre: 'Techno' },
  { name: 'Razzmatazz', city: 'Barcelona', genre: 'Mixed' },
]

export default function ResearchPage() {
  const [venueName, setVenueName] = useState('')
  const [venueCity, setVenueCity] = useState('')
  const [venueGenre, setVenueGenre] = useState('Techno')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VenueResearch | null>(null)
  const [contactEmail, setContactEmail] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)

  async function doResearch(name = venueName, city = venueCity, genre = venueGenre) {
    if (!name.trim()) return
    setLoading(true)
    setResult(null)
    setContactEmail('')

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'research', data: { name, city, genre } }),
      })
      const data = await response.json()
      setResult(data.result)
    } catch {
      alert('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  async function generateEmail() {
    if (!result) return
    setEmailLoading(true)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contact_email', data: { venue: result.nombre, city: result.ciudad, genre: venueGenre } }),
      })
      const data = await response.json()
      setContactEmail(data.result)
    } catch {
      alert('Error generando email')
    } finally {
      setEmailLoading(false)
    }
  }

  function quickSearch(item: typeof QUICK_SEARCHES[0]) {
    setVenueName(item.name)
    setVenueCity(item.city)
    setVenueGenre(item.genre)
    doResearch(item.name, item.city, item.genre)
  }

  return (
    <AppLayout>
      <div>
        <h1 className="page-title">Research de venues</h1>
        <p className="page-sub">Investiga un club o promotor antes de contactar · powered by IA</p>

        {/* Search form */}
        <div className="card mb-5">
          <div className="section-title">Buscar venue</div>
          <div className="flex gap-3 items-end flex-wrap">
            <div className="flex-[2] min-w-[180px]">
              <label className="form-label">Nombre del venue / club / festival</label>
              <input
                className="form-input"
                placeholder="Fabric, Tresor, Sonar..."
                value={venueName}
                onChange={e => setVenueName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doResearch()}
              />
            </div>
            <div className="flex-1 min-w-[130px]">
              <label className="form-label">Ciudad / País</label>
              <input
                className="form-input"
                placeholder="Berlín, Alemania"
                value={venueCity}
                onChange={e => setVenueCity(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[130px]">
              <label className="form-label">Género</label>
              <select className="form-input" value={venueGenre} onChange={e => setVenueGenre(e.target.value)}>
                {['Techno', 'House', 'Afro House', 'Drum & Bass', 'Trance', 'Mixed'].map(g => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
            <button
              className="btn-primary"
              onClick={() => doResearch()}
              disabled={loading || !venueName}
            >
              {loading ? '⟳ Investigando...' : '🔍 Investigar'}
            </button>
          </div>

          <div className="mt-4">
            <div className="text-xs text-muted mb-2">Búsquedas rápidas:</div>
            <div className="flex gap-2 flex-wrap">
              {QUICK_SEARCHES.map(item => (
                <button
                  key={item.name}
                  className="btn-ghost text-xs py-1 px-3"
                  onClick={() => quickSearch(item)}
                >
                  {item.name} · {item.city}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="card text-center py-12">
            <div className="flex justify-center gap-1 mb-3">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
            <div className="text-muted text-sm">Investigando {venueName}...</div>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="bg-surface2 border border-white/[0.08] rounded-2xl p-6 mb-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-white">{result.nombre}</h2>
                <div className="text-sm text-muted mt-1">{result.ciudad} · {result.tipo} · Fundado {result.fundado} · ~{result.aforo} personas</div>
              </div>
              <div className="w-14 h-14 rounded-full border-2 border-accent flex flex-col items-center justify-center flex-shrink-0">
                <div className="font-display text-xl font-extrabold text-accent leading-none">{result.score}</div>
                <div className="text-[9px] text-muted">score</div>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap mb-5">
              {result.generos.map(g => (
                <span key={g} className="text-xs px-2.5 py-1 rounded-full bg-white/[0.06] text-muted border border-white/[0.08]">{g}</span>
              ))}
              <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.06] text-muted border border-white/[0.08]">{result.tipo}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                ['Ambiente', result.ambiente],
                ['Artistas notables', result.artistas_notables],
                ['Mejor momento', result.mejor_momento],
                ['Cachet (DJ nuevo)', result.cachet_rango],
              ].map(([k, v]) => (
                <div key={k} className="bg-surface rounded-xl p-3">
                  <div className="text-xs text-muted mb-1">{k}</div>
                  <div className="text-sm text-white">{v}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-accent/5 border border-accent/15 rounded-xl">
                <div className="text-xs text-accent font-semibold tracking-wider mb-1">REPUTACIÓN CON DJs</div>
                <div className="text-sm text-white">{result.reputacion}</div>
              </div>

              {result.red_flags && result.red_flags !== 'Ninguno conocido' && (
                <div className="p-3 bg-red-400/5 border border-red-400/20 rounded-xl">
                  <div className="text-xs text-red-400 font-semibold tracking-wider mb-1">RED FLAGS</div>
                  <div className="text-sm text-white">{result.red_flags}</div>
                </div>
              )}

              <div className="p-3 bg-accent2/5 border border-accent2/15 rounded-xl">
                <div className="text-xs text-accent2/80 font-semibold tracking-wider mb-1" style={{color:'#b39dfa'}}>CÓMO CONTACTAR</div>
                <div className="text-sm text-white">{result.como_contactar}</div>
              </div>

              <div className="p-3 bg-accent/5 border border-accent/15 rounded-xl">
                <div className="text-xs text-accent font-semibold tracking-wider mb-1">CONSEJO PARA TI</div>
                <div className="text-sm text-white">{result.consejo_dj}</div>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                className="btn-primary text-sm"
                onClick={generateEmail}
                disabled={emailLoading}
              >
                {emailLoading ? '⟳ Generando...' : '✉️ Generar email de contacto'}
              </button>
              <button className="btn-ghost text-sm" onClick={() => setResult(null)}>
                ← Nueva búsqueda
              </button>
            </div>

            {/* Contact email */}
            {contactEmail && (
              <div className="mt-4 p-4 bg-surface rounded-xl border border-white/[0.08]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-white">Email de contacto generado</span>
                  <button
                    className="btn-primary text-xs py-1 px-3"
                    onClick={() => navigator.clipboard.writeText(contactEmail)}
                  >
                    Copiar
                  </button>
                </div>
                <div className="generated-content text-xs">{contactEmail}</div>
              </div>
            )}
          </div>
        )}

        {/* Tips (when no result) */}
        {!result && !loading && (
          <div className="card">
            <div className="section-title">¿Qué investigar antes de contactar?</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: 'REPUTACIÓN Y PAGOS', text: 'Busca en foros de DJs si pagan a tiempo, respetan los riders y tratan bien a los artistas.', color: 'accent' },
                { title: 'PROGRAMACIÓN', text: 'Revisa quién ha tocado los últimos 3 meses. ¿Tu estilo encaja con su línea artística?', color: 'accent' },
                { title: 'RED FLAGS', text: 'Promotores que piden tocar gratis "por exposición", que cambian cachets o no tienen contrato.', color: 'red-400', bg: 'red-400' },
                { title: 'ESTRATEGIA DE CONTACTO', text: 'Menciona artistas similares que hayan tocado allí. Demuestra que conoces su programación.', color: 'accent2/80', bg: 'accent2' },
              ].map(item => (
                <div key={item.title} className={`p-3 bg-${item.bg || 'accent'}/5 border border-${item.bg || 'accent'}/15 rounded-xl`}>
                  <div className={`text-xs font-semibold tracking-wider mb-1 text-${item.color}`}>{item.title}</div>
                  <div className="text-sm text-white/80">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
