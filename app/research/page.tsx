'use client'
import { useState, useMemo } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { VENUES_DB, CITIES, VENUE_STATS, type VenueDB } from '@/lib/venues-db'

const GENRES = ['Techno', 'House', 'Drum & Bass', 'Experimental', 'Disco', 'Mixed']
const TYPES = [
  { value: '', label: 'Todos' },
  { value: 'club', label: 'Clubs' },
  { value: 'bar', label: 'Bares' },
  { value: 'festival', label: 'Festivales' },
]
const ENTRADA_TIPOS = [
  { value: '', label: 'Cualquier precio' },
  { value: 'free', label: 'Gratis' },
  { value: 'low', label: 'Económico' },
  { value: 'mid', label: 'Medio' },
  { value: 'high', label: 'Premium' },
]

const ENTRADA_COLORS: Record<string, string> = {
  free: 'bg-green-500/10 text-green-400',
  low: 'bg-blue-500/10 text-blue-400',
  mid: 'bg-amber-500/10 text-amber-400',
  high: 'bg-red-500/10 text-red-400',
}

const TYPE_COLORS: Record<string, string> = {
  club: '#7c5ff5',
  bar: '#1d9e75',
  festival: '#e8a020',
}

export default function ResearchPage() {
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [genreFilter, setGenreFilter] = useState('')
  const [entradaFilter, setEntradaFilter] = useState('')
  const [selected, setSelected] = useState<VenueDB | null>(null)
  const [contactEmail, setContactEmail] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)

  const filtered = useMemo(() => {
    return VENUES_DB.filter(v => {
      const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.area.toLowerCase().includes(search.toLowerCase())
      const matchCity = !cityFilter || v.city === cityFilter
      const matchType = !typeFilter || v.type === typeFilter
      const matchGenre = !genreFilter || v.genres.some(g => g.includes(genreFilter))
      const matchEntrada = !entradaFilter || v.entrada_tipo === entradaFilter
      return matchSearch && matchCity && matchType && matchGenre && matchEntrada
    })
  }, [search, cityFilter, typeFilter, genreFilter, entradaFilter])

  async function generateEmail(venue: VenueDB) {
    setEmailLoading(true)
    setContactEmail('')
    try {
      const r = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact_email',
          data: { venue: venue.name, city: venue.city, genre: venue.genres[0] },
        }),
      })
      const data = await r.json()
      setContactEmail(data.result)
    } catch {
      setContactEmail('Error generando email.')
    } finally {
      setEmailLoading(false)
    }
  }

  return (
    <AppLayout>
      <div>
        <h1 className="page-title">Research de venues</h1>
        <p className="page-sub">Base de datos de {VENUE_STATS.total} venues en {VENUE_STATS.cities} ciudades europeas</p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { n: VENUE_STATS.total, label: 'Venues totales' },
            { n: VENUE_STATS.clubs, label: 'Clubs' },
            { n: VENUE_STATS.bars, label: 'Bares' },
            { n: VENUE_STATS.festivals, label: 'Festivales' },
          ].map(s => (
            <div key={s.label} className="card text-center py-3">
              <div className="stat-value text-2xl">{s.n}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="card mb-5">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="form-label">Buscar venue</label>
              <input className="form-input" placeholder="Nombre, barrio..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Ciudad</label>
              <select className="form-input" value={cityFilter} onChange={e => setCityFilter(e.target.value)}>
                <option value="">Todas las ciudades</option>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="form-label">Tipo</label>
              <select className="form-input" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Género</label>
              <select className="form-input" value={genreFilter} onChange={e => setGenreFilter(e.target.value)}>
                <option value="">Todos los géneros</option>
                {GENRES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Precio entrada</label>
              <select className="form-input" value={entradaFilter} onChange={e => setEntradaFilter(e.target.value)}>
                {ENTRADA_TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-3 text-xs text-muted">{filtered.length} venues encontrados</div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="card mb-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-display text-xl font-bold">{selected.name}</h2>
                <div className="text-sm text-muted mt-1">{selected.area}, {selected.city} · {selected.type === 'club' ? 'Club' : selected.type === 'bar' ? 'Bar' : 'Festival'} · ~{selected.aforo} personas · Est. {selected.fundado}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-accent flex flex-col items-center justify-center">
                  <div className="font-display text-lg font-bold text-accent leading-none">{selected.score}</div>
                  <div className="text-[9px] text-muted">score</div>
                </div>
                <button onClick={() => { setSelected(null); setContactEmail('') }} className="text-muted hover:text-white text-xl">✕</button>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap mb-4">
              {selected.genres.map(g => (
                <span key={g} className="text-xs px-2.5 py-1 rounded-full bg-surface2 border border-white/[0.08] text-muted">{g}</span>
              ))}
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ENTRADA_COLORS[selected.entrada_tipo]}`}>
                Entrada: {selected.entrada_precio}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                ['Ambiente', selected.ambiente],
                ['Artistas notables', selected.artistas],
                ['Precio entrada público', `${selected.entrada_precio} — ${selected.entrada_nota}`],
                ['Cachet DJ nuevo', selected.cachet],
                ['Mejor momento', selected.mejor],
                ['Cómo contactar', selected.contacto],
              ].map(([k, v]) => (
                <div key={k} className="bg-surface2 rounded-xl p-3">
                  <div className="text-xs text-muted mb-1">{k}</div>
                  <div className="text-sm text-white">{v}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-accent/5 border border-accent/15 rounded-xl">
                <div className="text-xs text-accent font-semibold tracking-wider mb-1">REPUTACIÓN CON DJs</div>
                <div className="text-sm text-white">{selected.reputacion}</div>
              </div>
              {selected.red_flag && (
                <div className="p-3 bg-red-400/5 border border-red-400/20 rounded-xl">
                  <div className="text-xs text-red-400 font-semibold tracking-wider mb-1">RED FLAGS</div>
                  <div className="text-sm text-white">{selected.red_flag}</div>
                </div>
              )}
              <div className="p-3 bg-accent2/5 border border-accent2/15 rounded-xl">
                <div className="text-xs font-semibold tracking-wider mb-1" style={{color:'#b39dfa'}}>CONSEJO PARA TI</div>
                <div className="text-sm text-white">{selected.consejo}</div>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button className="btn-primary text-sm" onClick={() => generateEmail(selected)} disabled={emailLoading}>
                {emailLoading ? '⟳ Generando...' : '✉️ Generar email de contacto'}
              </button>
              <button className="btn-ghost text-sm" onClick={() => { setSelected(null); setContactEmail('') }}>← Volver</button>
            </div>

            {contactEmail && (
              <div className="mt-4 p-4 bg-surface2 rounded-xl border border-white/[0.08]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Email generado</span>
                  <button className="btn-primary text-xs py-1 px-3" onClick={() => navigator.clipboard.writeText(contactEmail)}>Copiar</button>
                </div>
                <div className="text-xs text-white whitespace-pre-wrap leading-relaxed bg-surface p-3 rounded-lg">{contactEmail}</div>
              </div>
            )}
          </div>
        )}

        {/* Venues grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {filtered.map(venue => (
       <button
  key={venue.id}
  onClick={() => { setSelected(venue); setContactEmail(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
  className={`text-left card hover:border-white/20 transition-all ${selected?.id === venue.id ? 'border-accent2/40' : ''}`}
>
  {/* Móvil: layout horizontal */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: TYPE_COLORS[venue.type] }} />
      <div className="min-w-0">
        <div className="text-sm font-semibold text-white truncate">{venue.name}</div>
        <div className="text-xs text-muted">{venue.area}, {venue.city}</div>
      </div>
    </div>
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-2 ${venue.score >= 9 ? 'bg-accent/10 text-accent' : venue.score >= 8 ? 'bg-amber-500/10 text-amber-400' : 'bg-white/5 text-muted'}`}>
      {venue.score}★
    </span>
  </div>

  {/* Desktop: info extra */}
  <div className="hidden md:block mt-2">
    <div className="flex gap-1.5 flex-wrap mb-2">
      {venue.genres.slice(0, 2).map(g => (
        <span key={g} className="text-[10px] px-2 py-0.5 rounded-full bg-surface2 border border-white/[0.08] text-muted">{g}</span>
      ))}
    </div>
    <div className="flex items-center justify-between text-xs pt-2 border-t border-white/[0.06]">
      <span className="text-muted">DJ: <span className="text-white font-medium">{venue.cachet}</span></span>
      <span className={`px-2 py-0.5 rounded-full font-medium ${ENTRADA_COLORS[venue.entrada_tipo]}`}>
        {venue.entrada_precio}
      </span>
    </div>
  </div>
</button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted text-sm">
            No hay venues con estos filtros.
          </div>
        )}
      </div>
    </AppLayout>
  )
}
