'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'

type Profile = 'beginner' | 'intermediate' | 'pro' | null

interface PlanPhase {
  titulo: string
  objetivo: string
  acciones: string[]
}

interface MentoringPlan {
  fase1: PlanPhase
  fase2: PlanPhase
  fase3: PlanPhase
  consejo_especial: string
  error_comun: string
}

const PROFILES = [
  {
    id: 'beginner' as Profile,
    icon: '🎧',
    title: 'Estoy empezando',
    desc: 'Produzco o pincho pero todavía no tengo bookings pagados. Quiero conseguir mis primeros gigs profesionales.',
    badge: 'Beginner',
    color: 'bg-purple-50 dark:bg-purple-950',
    badgeColor: 'bg-[#EEEDFE] text-[#534AB7]',
  },
  {
    id: 'intermediate' as Profile,
    icon: '🎛',
    title: 'Ya hago algún gig',
    desc: 'Toco de vez en cuando pero quiero profesionalizarme y vivir de la música a tiempo completo.',
    badge: 'Intermedio',
    color: 'bg-teal-50 dark:bg-teal-950',
    badgeColor: 'bg-[#E1F5EE] text-[#0F6E56]',
  },
  {
    id: 'pro' as Profile,
    icon: '🏆',
    title: 'Soy DJ profesional',
    desc: 'Ya me dedico a esto full time. Necesito gestionar mis bookings, mejorar mi marketing y escalar mi carrera.',
    badge: 'Profesional',
    color: 'bg-amber-50 dark:bg-amber-950',
    badgeColor: 'bg-[#FAEEDA] text-[#854F0B]',
  },
]

const GENRES = ['Techno', 'House', 'Afro House', 'Tech House', 'Drum & Bass', 'Disco', 'Minimal', 'Melodic Techno', 'Trance', 'Ambient']

const GOALS = [
  { value: 'primer_gig', label: 'Conseguir mi primer gig pagado' },
  { value: 'regularidad', label: 'Tocar con más regularidad' },
  { value: 'full_time', label: 'Dejar mi trabajo y vivir de la música' },
  { value: 'mejores_venues', label: 'Subir a venues más grandes' },
  { value: 'internacional', label: 'Expandirme internacionalmente' },
  { value: 'comeback', label: 'Volver a la escena tras un parón' },
  { value: 'gestionar', label: 'Gestionar mejor mis bookings actuales' },
]

const PHASE_COLORS = ['#534AB7', '#0F6E56', '#854F0B']

function buildPrompt(profile: string, name: string, city: string, years: string, genres: string[], goal: string) {
  const g = genres.length > 0 ? genres.join(', ') : 'no especificados'
  const base = `Devuelve SOLO JSON sin markdown:\n{"fase1":{"titulo":"...","objetivo":"...","acciones":["...","...","..."]},"fase2":{"titulo":"...","objetivo":"...","acciones":["...","...","..."]},"fase3":{"titulo":"...","objetivo":"...","acciones":["...","...","..."]},"consejo_especial":"...","error_comun":"..."}`

  if (profile === 'beginner') {
    return `Eres mentor experto en música electrónica. DJ ${name} de ${city}, ${years} años de experiencia, géneros: ${g}. Principiante buscando primeros gigs. Objetivo: ${goal}. Crea plan en 3 fases (1 mes, 3 meses, 6 meses) con acciones concretas, consejo especial y error común. ${base}`
  }
  if (profile === 'intermediate') {
    return `Eres mentor experto en música electrónica. DJ ${name} de ${city}, ${years} años, géneros: ${g}. Hace algunos gigs, quiere profesionalizarse full time. Objetivo: ${goal}. Plan en 3 fases para transición profesional. ${base}`
  }
  return `Eres manager experto en música electrónica. DJ ${name} de ${city}, ${years} años, géneros: ${g}. DJ profesional full time. Objetivo: ${goal}. Plan de optimización y escala en 3 fases. ${base}`
}

export default function MentoringPage() {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<Profile>(null)
  const [djName, setDjName] = useState('')
  const [city, setCity] = useState('')
  const [years, setYears] = useState('1-3')
  const [genres, setGenres] = useState<string[]>([])
  const [goal, setGoal] = useState('')
  const [plan, setPlan] = useState<MentoringPlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const progress = step === 1 ? 33 : step === 2 ? 66 : 100

  function toggleGenre(g: string) {
    setGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])
  }

  async function generatePlan() {
    setLoading(true)
    setError('')
    setPlan(null)
    try {
      const prompt = buildPrompt(profile!, djName || 'DJ', city || 'tu ciudad', years, genres, goal)
      const r = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'mentoring', data: { prompt } }),
      })
      const d = await r.json()
      const text = (d.result || '{}').replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(text)
      setPlan(parsed)
    } catch {
      setError('Error generando el plan. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  function handleNext() {
    setStep(3)
    generatePlan()
  }

  return (
    <AppLayout>
      <div className="max-w-2xl">
        {/* Progress bar */}
        <div className="h-1 bg-surface2 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, background: '#534AB7' }}
          />
        </div>

        {/* STEP 1 — Perfil */}
        {step === 1 && (
          <div>
            <h1 className="page-title">Bienvenido a DJBook Pro</h1>
            <p className="page-sub">Cuéntanos en qué punto de tu carrera estás para personalizar tu experiencia.</p>

            <div className="space-y-3">
              {PROFILES.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setProfile(p.id); setStep(2) }}
                  className={`w-full text-left card flex items-start gap-4 hover:border-white/20 transition-all ${profile === p.id ? 'border-accent2/50' : ''}`}
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${p.color}`}>
                    {p.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white mb-1">{p.title}</div>
                    <div className="text-xs text-muted leading-relaxed">{p.desc}</div>
                    <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full mt-2 font-medium ${p.badgeColor}`}>
                      {p.badge}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 — Detalles */}
        {step === 2 && (
          <div>
            <h1 className="page-title">Cuéntanos más sobre ti</h1>
            <p className="page-sub">Así podremos personalizar tu plan de carrera.</p>

            <div className="space-y-4">
              <div>
                <label className="form-label">Nombre artístico</label>
                <input className="form-input" placeholder="DJ TuNombre" value={djName} onChange={e => setDjName(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Ciudad donde vives</label>
                  <input className="form-input" placeholder="Berlín, Madrid..." value={city} onChange={e => setCity(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Años pinchando</label>
                  <select className="form-input" value={years} onChange={e => setYears(e.target.value)}>
                    <option value="menos1">Menos de 1 año</option>
                    <option value="1-3">1 a 3 años</option>
                    <option value="3-5">3 a 5 años</option>
                    <option value="5-10">5 a 10 años</option>
                    <option value="10+">Más de 10 años</option>
                    <option value="30+">Más de 30 años</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Géneros principales</label>
                <div className="flex gap-2 flex-wrap mt-1">
                  {GENRES.map(g => (
                    <button
                      key={g}
                      onClick={() => toggleGenre(g)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        genres.includes(g)
                          ? 'bg-[#EEEDFE] border-[#AFA9EC] text-[#534AB7]'
                          : 'bg-transparent border-white/[0.08] text-muted hover:bg-surface2'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">¿Cuál es tu objetivo principal ahora mismo?</label>
                <select className="form-input" value={goal} onChange={e => setGoal(e.target.value)}>
                  <option value="">Selecciona...</option>
                  {GOALS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="btn-ghost" onClick={() => setStep(1)}>← Atrás</button>
              <button className="btn-primary" onClick={handleNext}>
                Ver mi plan personalizado →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Plan */}
        {step === 3 && (
          <div>
            <h1 className="page-title">Tu plan personalizado</h1>
            <p className="page-sub">Basado en tu perfil, aquí tienes tu hoja de ruta.</p>

            {/* Summary */}
            <div className="card mb-5 space-y-2">
              {[
                ['Perfil', PROFILES.find(p => p.id === profile)?.title || ''],
                ['Nombre', djName || 'DJ'],
                ['Ciudad', city || '—'],
                ['Experiencia', `${years} años`],
                ['Géneros', genres.length > 0 ? genres.join(', ') : '—'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm border-b border-white/[0.06] pb-2 last:border-0 last:pb-0">
                  <span className="text-muted">{k}</span>
                  <span className="text-white font-medium">{v}</span>
                </div>
              ))}
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex items-center gap-3 p-4 bg-surface2 rounded-xl text-sm text-muted mb-4">
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent2 animate-bounce" style={{ animationDelay: `${i*0.2}s` }} />
                  ))}
                </div>
                Generando tu plan con IA...
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-xl text-sm text-red-400 mb-4">
                {error}
                <button className="ml-3 underline" onClick={generatePlan}>Reintentar</button>
              </div>
            )}

            {/* Plan */}
            {plan && (
              <div>
                <div className="space-y-0 mb-5">
                  {[plan.fase1, plan.fase2, plan.fase3].map((fase, i) => (
                    <div key={i} className="border-l-2 pl-4 mb-5" style={{ borderColor: PHASE_COLORS[i] }}>
                      <div className="text-[11px] font-medium tracking-wider mb-1" style={{ color: PHASE_COLORS[i] }}>
                        {fase.titulo.toUpperCase()}
                      </div>
                      <div className="text-sm font-medium text-white mb-2">{fase.objetivo}</div>
                      <div className="space-y-1.5">
                        {fase.acciones.map((a, j) => (
                          <div key={j} className="flex items-start gap-2 text-sm text-muted">
                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: PHASE_COLORS[i] }} />
                            {a}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-surface2 rounded-xl border border-white/[0.08] mb-3">
                  <div className="text-[11px] font-medium tracking-wider text-accent2/80 mb-2">CONSEJO ESPECIAL PARA TI</div>
                  <div className="text-sm text-white leading-relaxed">{plan.consejo_especial}</div>
                </div>

                <div className="p-4 rounded-xl border-l-2 mb-5" style={{ background: '#FCEBEB10', borderColor: '#E24B4A' }}>
                  <div className="text-[11px] font-medium tracking-wider text-red-400 mb-2">ERROR MÁS COMÚN A EVITAR</div>
                  <div className="text-sm text-white leading-relaxed">{plan.error_comun}</div>
                </div>

                <div className="flex gap-3">
                  <button className="btn-ghost text-sm" onClick={() => setStep(2)}>← Editar perfil</button>
                  <button className="btn-primary text-sm" onClick={generatePlan}>↻ Regenerar plan</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
