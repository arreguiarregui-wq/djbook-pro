'use client'
import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'

const GENRES = [
  { id: 'all', label: 'Todos' },
  { id: 'house', label: 'House' },
  { id: 'afro', label: 'Afro House' },
  { id: 'techno', label: 'Techno' },
  { id: 'melodic', label: 'Melodic' },
  { id: 'deep', label: 'Deep House' },
  { id: 'dnb', label: 'D&B / Jungle' },
  { id: 'ambient', label: 'Ambient' },
  { id: 'trance', label: 'Trance' },
  { id: 'disco', label: 'Disco / Funk' },
]

const CHARTS = [
  { g: 'house', p: 'Beatport', n: 'Top 100 House', d: 'El chart de house más seguido del mundo.', t: ['House', 'Tech House'], url: 'https://www.beatport.com/genre/house/5/top-100', upd: 'Semanal' },
  { g: 'house', p: 'Traxsource', n: 'Top 100 House', d: 'Más underground que Beatport. Referencia para DJs profesionales.', t: ['House', 'Soulful'], url: 'https://www.traxsource.com/genre/2/house', upd: 'Diario' },
  { g: 'afro', p: 'Beatport', n: 'Top 100 Afro House', d: 'El chart definitivo de afro house.', t: ['Afro House', 'Tribal'], url: 'https://www.beatport.com/genre/afro-house/89/top-100', upd: 'Semanal' },
  { g: 'afro', p: 'Traxsource', n: 'Top 100 Afro House', d: 'Exclusivos que no encontrarás en Beatport.', t: ['Afro House', 'Afrobeats'], url: 'https://www.traxsource.com/genre/38/afro-house', upd: 'Diario' },
  { g: 'techno', p: 'Beatport', n: 'Top 100 Techno Peak Time', d: 'El techno más energético para el horario estelar.', t: ['Techno', 'Industrial'], url: 'https://www.beatport.com/genre/techno/6/top-100', upd: 'Semanal' },
  { g: 'techno', p: 'Beatport', n: 'Top 100 Techno Raw/Deep', d: 'Techno oscuro y experimental. La cara underground.', t: ['Techno', 'Raw', 'Dark'], url: 'https://www.beatport.com/genre/techno-raw-deep-hypnotic/92/top-100', upd: 'Semanal' },
  { g: 'melodic', p: 'Beatport', n: 'Top 100 Melodic House & Techno', d: 'El género en mayor auge en Europa ahora mismo.', t: ['Melodic Techno', 'Melodic House'], url: 'https://www.beatport.com/genre/melodic-house-techno/90/top-100', upd: 'Semanal' },
  { g: 'melodic', p: 'Traxsource', n: 'Top 100 Melodic House', d: 'Selección refinada de melodic house para DJs.', t: ['Melodic', 'Organic'], url: 'https://www.traxsource.com/genre/96/melodic-house-techno', upd: 'Diario' },
  { g: 'deep', p: 'Beatport', n: 'Top 100 Deep House', d: 'Deep house, garage y sonidos orgánicos.', t: ['Deep House', 'Garage'], url: 'https://www.beatport.com/genre/deep-house/12/top-100', upd: 'Semanal' },
  { g: 'deep', p: 'Traxsource', n: 'Top 100 Deep House', d: 'Deep house de raíz con influencias de Chicago.', t: ['Deep', 'Chicago'], url: 'https://www.traxsource.com/genre/13/deep-house', upd: 'Diario' },
  { g: 'dnb', p: 'Beatport', n: 'Top 100 Drum & Bass', d: 'Liquid, neurofunk y jungle. El chart completo.', t: ['D&B', 'Liquid', 'Jungle'], url: 'https://www.beatport.com/genre/drum-bass/1/top-100', upd: 'Semanal' },
  { g: 'dnb', p: 'Juno', n: 'Drum & Bass / Jungle', d: 'La mejor selección de D&B en vinilo y digital.', t: ['D&B', 'Jungle', 'Vinyl'], url: 'https://www.juno.co.uk/drum-bass/', upd: 'Continuo' },
  { g: 'ambient', p: 'Beatport', n: 'Top 100 Electronica / Downtempo', d: 'Ambient, IDM y electrónica experimental.', t: ['Ambient', 'IDM'], url: 'https://www.beatport.com/genre/electronica/3/top-100', upd: 'Semanal' },
  { g: 'ambient', p: 'Bandcamp', n: 'Ambient destacados', d: 'Los mejores lanzamientos ambient en sellos independientes.', t: ['Ambient', 'Experimental'], url: 'https://bandcamp.com/tag/ambient', upd: 'Continuo' },
  { g: 'trance', p: 'Beatport', n: 'Top 100 Trance', d: 'Progressive, psytrance y uplifting. Todo el espectro.', t: ['Trance', 'Progressive'], url: 'https://www.beatport.com/genre/trance/7/top-100', upd: 'Semanal' },
  { g: 'trance', p: 'Beatport', n: 'Top 100 Progressive House', d: 'Progressive house con raíces en el trance.', t: ['Progressive', 'Melodic'], url: 'https://www.beatport.com/genre/progressive-house/15/top-100', upd: 'Semanal' },
  { g: 'disco', p: 'Beatport', n: 'Top 100 Disco / Funk', d: 'Disco, funk y nu-disco. Ideal para warm-ups.', t: ['Disco', 'Funk', 'Nu-Disco'], url: 'https://www.beatport.com/genre/disco-funk/5/top-100', upd: 'Semanal' },
  { g: 'disco', p: 'Juno', n: 'Disco & Funk', d: 'La mayor selección de disco y funk en vinilo.', t: ['Disco', 'Vinyl'], url: 'https://www.juno.co.uk/disco/', upd: 'Continuo' },
]

const DJS = [
  { n: 'Dixon', g: 'house', l: 'Deep House', ra: 'https://ra.co/dj/dixon/charts', bp: 'https://www.beatport.com/artist/dixon/13028', sc: 'https://soundcloud.com/dixon' },
  { n: 'Ame', g: 'house', l: 'House', ra: 'https://ra.co/dj/ame/charts', bp: 'https://www.beatport.com/artist/ame/13029', sc: 'https://soundcloud.com/ame-music' },
  { n: 'Kerri Chandler', g: 'house', l: 'Deep / Garage', ra: 'https://ra.co/dj/kerrichandler/charts', bp: 'https://www.beatport.com/artist/kerri-chandler/1971', sc: 'https://soundcloud.com/kerri-chandler' },
  { n: 'Black Coffee', g: 'afro', l: 'Afro House', ra: 'https://ra.co/dj/blackcoffee/charts', bp: 'https://www.beatport.com/artist/black-coffee/276278', sc: 'https://soundcloud.com/realblackcoffee' },
  { n: 'Bedouin', g: 'afro', l: 'Afro House', ra: 'https://ra.co/dj/bedouin/charts', bp: 'https://www.beatport.com/artist/bedouin/463973', sc: 'https://soundcloud.com/bedouin' },
  { n: 'Themba', g: 'afro', l: 'Afro House', ra: 'https://ra.co/dj/themba/charts', bp: 'https://www.beatport.com/artist/themba/631824', sc: 'https://soundcloud.com/thembadj' },
  { n: 'Ben Klock', g: 'techno', l: 'Techno', ra: 'https://ra.co/dj/benklock/charts', bp: 'https://www.beatport.com/artist/ben-klock/13076', sc: 'https://soundcloud.com/ben-klock' },
  { n: 'Richie Hawtin', g: 'techno', l: 'Minimal Techno', ra: 'https://ra.co/dj/richiehawtin/charts', bp: 'https://www.beatport.com/artist/richie-hawtin/13031', sc: 'https://soundcloud.com/richiehawtin' },
  { n: 'Tale Of Us', g: 'melodic', l: 'Melodic Techno', ra: 'https://ra.co/dj/taleofus/charts', bp: 'https://www.beatport.com/artist/tale-of-us/203018', sc: 'https://soundcloud.com/taleofus' },
  { n: 'Solomun', g: 'melodic', l: 'Melodic House', ra: 'https://ra.co/dj/solomun/charts', bp: 'https://www.beatport.com/artist/solomun/13027', sc: 'https://soundcloud.com/solomun' },
  { n: 'Hunee', g: 'disco', l: 'Disco / House', ra: 'https://ra.co/dj/hunee/charts', bp: 'https://www.beatport.com/artist/hunee/276001', sc: 'https://soundcloud.com/hunee' },
  { n: 'Goldie', g: 'dnb', l: 'Drum & Bass', ra: 'https://ra.co/dj/goldie/charts', bp: 'https://www.beatport.com/artist/goldie/13091', sc: 'https://soundcloud.com/goldie' },
  { n: 'LTJ Bukem', g: 'dnb', l: 'Liquid D&B', ra: 'https://ra.co/dj/ltjbukem/charts', bp: 'https://www.beatport.com/artist/ltj-bukem/13092', sc: 'https://soundcloud.com/ltj-bukem' },
  { n: 'Aphex Twin', g: 'ambient', l: 'Ambient / IDM', ra: 'https://ra.co/dj/aphextwin', bp: 'https://www.beatport.com/artist/aphex-twin/6073', sc: 'https://soundcloud.com/aphextwin' },
  { n: 'Above Beyond', g: 'trance', l: 'Trance / Progressive', ra: 'https://ra.co/dj/aboveandbeyond/charts', bp: 'https://www.beatport.com/artist/above-beyond/13030', sc: 'https://soundcloud.com/aboveandbeyond' },
]

const QUICK_PROMPTS = [
  'Top 10 tracks de afro house que todo DJ debería conocer',
  'Mejores tracks de melodic techno para set nocturno en Berlín',
  'Sellos de drum and bass underground activos en 2025',
  'DJs de ambient que inspiran a los mejores DJs de club',
  'Diferencia entre trance progresivo y trance comercial',
  'Qué sonidos de house están dominando en Europa ahora',
]

export default function InspirationPage() {
  const [activeTab, setActiveTab] = useState<'charts' | 'djs' | 'ia'>('charts')
  const [chartFilter, setChartFilter] = useState('all')
  const [djFilter, setDjFilter] = useState('all')
  const [aiQuery, setAiQuery] = useState('')
  const [aiResult, setAiResult] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const filteredCharts = chartFilter === 'all' ? CHARTS : CHARTS.filter(c => c.g === chartFilter)
  const filteredDJs = djFilter === 'all' ? DJS : DJS.filter(d => d.g === djFilter)

  async function askAI(query?: string) {
    const q = query || aiQuery
    if (!q.trim()) return
    if (query) setAiQuery(query)
    setActiveTab('ia')
    setAiLoading(true)
    setAiResult('')
    try {
      const r = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'chat', data: { message: q }, history: [] }),
      })
      const d = await r.json()
      setAiResult(d.result || 'Error')
    } catch {
      setAiResult('Error de conexión.')
    } finally {
      setAiLoading(false)
    }
  }

  const filterBtnClass = (active: boolean) =>
    `text-xs px-3 py-1.5 rounded-full border transition-all ${
      active ? 'bg-[#EEEDFE] border-[#AFA9EC] text-[#534AB7]' : 'border-white/[0.08] text-muted hover:bg-surface2'
    }`

  return (
    <AppLayout>
      <div>
        <h1 className="page-title">Inspiración musical</h1>
        <p className="page-sub">Charts en tiempo real, DJs referentes y búsqueda con IA — 9 géneros</p>

        <div className="flex gap-1 border-b border-white/[0.08] mb-5">
          {[{ id: 'charts', label: 'Charts' }, { id: 'djs', label: 'DJs referentes' }, { id: 'ia', label: 'Descubrir con IA' }].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-sm px-4 py-2.5 border-b-2 transition-colors ${activeTab === tab.id ? 'border-accent2 text-white font-medium' : 'border-transparent text-muted hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'charts' && (
          <div>
            <div className="flex gap-2 flex-wrap mb-4">
              {GENRES.map(g => <button key={g.id} onClick={() => setChartFilter(g.id)} className={filterBtnClass(chartFilter === g.id)}>{g.label}</button>)}
            </div>
            <div className="space-y-3">
              {filteredCharts.map((c, i) => (
                <div key={i} className="card flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#EEEDFE] flex items-center justify-center text-xs font-medium text-[#534AB7] flex-shrink-0">
                    {c.p.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white flex items-center gap-2">
                      {c.n}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">{c.upd}</span>
                    </div>
                    <div className="text-xs text-muted mt-0.5 mb-1">{c.p} — {c.d}</div>
                    <div className="flex gap-1.5 flex-wrap">
                      {c.t.map(tag => <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-surface2 text-muted border border-white/[0.08]">{tag}</span>)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg border border-white/[0.08] text-white hover:bg-surface2 transition-colors text-center">
                      Ver chart →
                    </a>
                    <button className="text-xs px-3 py-1.5 rounded-lg bg-[#EEEDFE] border border-[#AFA9EC] text-[#534AB7]" onClick={() => askAI(`Analiza las tendencias actuales de ${c.t[0]} en ${c.p}. Que sonidos dominan ahora mismo?`)}>
                      IA ↗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'djs' && (
          <div>
            <div className="flex gap-2 flex-wrap mb-4">
              {GENRES.map(g => <button key={g.id} onClick={() => setDjFilter(g.id)} className={filterBtnClass(djFilter === g.id)}>{g.label}</button>)}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {filteredDJs.map((dj, i) => (
                <div key={i} className="card">
                  <div className="w-10 h-10 rounded-full bg-[#EEEDFE] flex items-center justify-center text-xs font-medium text-[#534AB7] mb-3">
                    {dj.n.slice(0, 2)}
                  </div>
                  <div className="text-sm font-medium text-white mb-0.5">{dj.n}</div>
                  <div className="text-xs text-muted mb-3">{dj.l}</div>
                  <div className="flex gap-1.5 flex-wrap">
                    <a href={dj.ra} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-1 rounded-lg border border-white/[0.08] text-muted hover:bg-surface2">Charts RA</a>
                    <a href={dj.bp} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-1 rounded-lg border border-white/[0.08] text-muted hover:bg-surface2">Beatport</a>
                    <a href={dj.sc} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-1 rounded-lg border border-white/[0.08] text-muted hover:bg-surface2">SoundCloud</a>
                    <button className="text-[10px] px-2 py-1 rounded-lg bg-[#EEEDFE] border border-[#AFA9EC] text-[#534AB7]" onClick={() => askAI(`Que puedo aprender del estilo de ${dj.n} para mejorar como DJ de ${dj.l}?`)}>
                      IA ↗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ia' && (
          <div>
            <div className="card mb-4">
              <div className="text-sm font-medium text-white mb-3">Pregunta sobre música</div>
              <div className="flex gap-3">
                <input className="form-input flex-1" placeholder="Que tracks de afro house suenan en Berlin ahora?" value={aiQuery} onChange={e => setAiQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && askAI()} />
                <button className="btn-primary" onClick={() => askAI()} disabled={aiLoading || !aiQuery.trim()}>
                  {aiLoading ? '...' : 'Buscar'}
                </button>
              </div>
              <div className="flex gap-2 flex-wrap mt-3">
                {QUICK_PROMPTS.map(p => (
                  <button key={p} className="text-xs px-3 py-1.5 rounded-full border border-white/[0.08] text-muted hover:bg-surface2 transition-colors" onClick={() => askAI(p)}>
                    {p.slice(0, 38)}...
                  </button>
                ))}
              </div>
            </div>
            {aiLoading && (
              <div className="flex items-center gap-2 p-4 bg-surface2 rounded-xl text-sm text-muted">
                <div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent2 animate-bounce" style={{animationDelay:`${i*0.2}s`}}/>)}</div>
                Buscando con IA...
              </div>
            )}
            {aiResult && !aiLoading && (
              <div className="card">
                <div className="text-sm text-white whitespace-pre-wrap leading-relaxed">{aiResult}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
