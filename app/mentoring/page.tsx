'use client'
import { useState } from 'react'
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
    title: 'Just getting started',
    desc: 'I produce or DJ but I have no paid bookings yet. I want to land my first professional gigs.',
    badge: 'Beginner',
    color: 'bg-purple-50 dark:bg-purple-950',
    badgeColor: 'bg-[#EEEDFE] text-[#534AB7]',
  },
  {
    id: 'intermediate' as Profile,
    icon: '🎛',
    title: 'I play some gigs',
    desc: 'I play occasionally but I want to go full-time and make a living from music.',
    badge: 'Intermediate',
    color: 'bg-teal-50 dark:bg-teal-950',
    badgeColor: 'bg-[#E1F5EE] text-[#0F6E56]',
  },
  {
    id: 'pro' as Profile,
    icon: '🏆',
    title: 'I am a professional DJ',
    desc: 'I already do this full time. I need to manage my bookings, improve my marketing and scale my career.',
    badge: 'Professional',
    color: 'bg-amber-50 dark:bg-amber-950',
    badgeColor: 'bg-[#FAEEDA] text-[#854F0B]',
  },
]

const GENRES = ['Techno', 'House', 'Afro House', 'Tech House', 'Drum & Bass', 'Disco', 'Minimal', 'Melodic Techno', 'Trance', 'Ambient']

const GOALS = [
  { value: 'primer_gig', label: 'Land my first paid gig' },
  { value: 'regularidad', label: 'Play more regularly' },
  { value: 'full_time', label: 'Quit my job and live from music' },
  { value: 'mejores_venues', label: 'Move up to bigger venues' },
  { value: 'internacional', label: 'Expand internationally' },
  { value: 'comeback', label: 'Return to the scene after a break' },
  { value: 'gestionar', label: 'Better manage my current bookings' },
]

const PHASE_COLORS = ['#534AB7', '#0F6E56', '#854F0B']

function buildPrompt(profile: string, name: string, city: string, years: string, genres: string[], goal: string) {
  const g = genres.length > 0 ? genres.join(', ') : 'not specified'
  const base = `Return ONLY JSON without markdown:\n{"fase1":{"titulo":"...","objetivo":"...","acciones":["...","...","..."]},"fase2":{"titulo":"...","objetivo":"...","acciones":["...","...","..."]},"fase3":{"titulo":"...","objetivo":"...","acciones":["...","...","..."]},"consejo_especial":"...","error_comun":"..."}`

  if (profile === 'beginner') {
    return `You are an expert mentor in electronic music. DJ ${name} from ${city}, ${years} years of experience, genres: ${g}. Beginner looking for first gigs. Goal: ${goal}. Create a 3-phase plan (1 month, 3 months, 6 months) with concrete actions, special advice and common mistake. Respond in English. ${base}`
  }
  if (profile === 'intermediate') {
    return `You are an expert mentor in electronic music. DJ ${name} from ${city}, ${years} years, genres: ${g}. Plays some gigs, wants to go full time. Goal: ${goal}. 3-phase plan for professional transition. Respond in English. ${base}`
  }
  return `You are an expert manager in electronic music. DJ ${name} from ${city}, ${years} years, genres: ${g}. Full time professional DJ. Goal: ${goal}. Optimization and scaling plan in 3 phases. Respond in English. ${base}`
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
      const prompt = buildPrompt(profile!, djName || 'DJ', city || 'your city', years, genres, goal)
      const r = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'mentoring', data: { prompt } }),
      })
      const d = await r.json()
      const text = (d.result || '{}').replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(text)
      const safePlan = {
        fase1: parsed.fase1 || { titulo: 'Month 1', objetivo: 'Build foundations', acciones: ['Action 1', 'Action 2', 'Action 3'] },
        fase2: parsed.fase2 || { titulo: 'Month 2-3', objetivo: 'Grow', acciones: ['Action 1', 'Action 2', 'Action 3'] },
        fase3: parsed.fase3 || { titulo: 'Month 4-6', objetivo: 'Consolidate', acciones: ['Action 1', 'Action 2', 'Action 3'] },
        consejo_especial: parsed.consejo_especial || '',
        error_comun: parsed.error_comun || '',
      }
      setPlan(safePlan)
    } catch {
      setError('Error generating plan. Please try again.')
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
        <div className="h-1 bg-surface2 rounded-full mb-8 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: '#534AB7' }} />
        </div>

        {step === 1 && (
          <div>
            <h1 className="page-title">Welcome to BeatBroker</h1>
            <p className="page-sub">Tell us where you are in your career so we can personalise your experience.</p>
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

        {step === 2 && (
          <div>
            <h1 className="page-title">Tell us more about you</h1>
            <p className="page-sub">This helps us personalise your career plan.</p>
            <div className="space-y-4">
              <div>
                <label className="form-label">Artist name</label>
                <input className="form-input" placeholder="DJ YourName" value={djName} onChange={e => setDjName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">City you live in</label>
                  <input className="form-input" placeholder="Berlin, London..." value={city} onChange={e => setCity(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Years DJing</label>
                  <select className="form-input" value={years} onChange={e => setYears(e.target.value)}>
                    <option value="menos1">Less than 1 year</option>
                    <option value="1-3">1 to 3 years</option>
                    <option value="3-5">3 to 5 years</option>
                    <option value="5-10">5 to 10 years</option>
                    <option value="10+">More than 10 years</option>
                    <option value="30+">More than 30 years</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Main genres</label>
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
                <label className="form-label">What is your main goal right now?</label>
                <select className="form-input" value={goal} onChange={e => setGoal(e.target.value)}>
                  <option value="">Select...</option>
                  {GOALS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
              <button className="btn-primary" onClick={handleNext}>
                See my personalised plan →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="page-title">Your personalised plan</h1>
            <p className="page-sub">Based on your profile, here is your roadmap.</p>

            <div className="card mb-5 space-y-2">
              {[
                ['Profile', PROFILES.find(p => p.id === profile)?.title || ''],
                ['Name', djName || 'DJ'],
                ['City', city || '—'],
                ['Experience', `${years} years`],
                ['Genres', genres.length > 0 ? genres.join(', ') : '—'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm border-b border-white/[0.06] pb-2 last:border-0 last:pb-0">
                  <span className="text-muted">{k}</span>
                  <span className="text-white font-medium">{v}</span>
                </div>
              ))}
            </div>

            {loading && (
              <div className="flex items-center gap-3 p-4 bg-surface2 rounded-xl text-sm text-muted mb-4">
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent2 animate-bounce" style={{ animationDelay: `${i*0.2}s` }} />
                  ))}
                </div>
                Generating your plan with AI...
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-xl text-sm text-red-400 mb-4">
                {error}
                <button className="ml-3 underline" onClick={generatePlan}>Retry</button>
              </div>
            )}

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
                  <div className="text-[11px] font-medium tracking-wider text-accent2/80 mb-2">SPECIAL TIP FOR YOU</div>
                  <div className="text-sm text-white leading-relaxed">{plan.consejo_especial}</div>
                </div>

                <div className="p-4 rounded-xl border-l-2 mb-5" style={{ background: '#FCEBEB10', borderColor: '#E24B4A' }}>
                  <div className="text-[11px] font-medium tracking-wider text-red-400 mb-2">MOST COMMON MISTAKE TO AVOID</div>
                  <div className="text-sm text-white leading-relaxed">{plan.error_comun}</div>
                </div>

                <div className="flex gap-3">
                  <button className="btn-ghost text-sm" onClick={() => setStep(2)}>← Edit profile</button>
                  <button className="btn-primary text-sm" onClick={generatePlan}>↻ Regenerate plan</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
