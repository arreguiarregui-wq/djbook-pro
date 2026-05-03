'use client'
import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import AiGuard from '@/components/ui/AiGuard'
import { calculateCachet, formatCurrency } from '@/lib/cachet'

const TIPO_OPTIONS = [
  { value: 'club', label: 'Club / sala' },
  { value: 'festival', label: 'Festival' },
  { value: 'privado', label: 'Evento privado / boda' },
  { value: 'residencia', label: 'Residencia semanal' },
  { value: 'corporativo', label: 'Evento corporativo' },
] as const

const CIUDAD_OPTIONS = [
  { value: 'grande', label: 'Gran ciudad (Madrid, Barcelona...)' },
  { value: 'media', label: 'Ciudad media (Valencia, Málaga...)' },
  { value: 'pequeña', label: 'Ciudad pequeña / pueblo' },
  { value: 'internacional', label: 'Internacional (Berlín, Ibiza...)' },
] as const

export default function NegociadorPage() {
  const [experienceYears, setExperienceYears] = useState(3)
  const [aforo, setAforo] = useState(300)
  const [tipoEvento, setTipoEvento] = useState<'club' | 'festival' | 'privado' | 'residencia' | 'corporativo'>('club')
  const [ciudad, setCiudad] = useState<'grande' | 'media' | 'pequeña' | 'internacional'>('grande')
  const [durationHours, setDurationHours] = useState(3)
  const [travelIncluded, setTravelIncluded] = useState(true)
  const [strategy, setStrategy] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const result = calculateCachet({ experienceYears, aforo, tipoEvento, ciudad, durationHours, travelIncluded })
  const meterPct = Math.min(100, Math.round((result.target / 2500) * 100))
  const meterColor = meterPct < 30 ? '#ef5350' : meterPct < 60 ? '#ffc107' : '#b8f75b'
  const meterLabel = meterPct < 30 ? 'Precio de entrada — no aceptes menos' : meterPct < 60 ? 'Precio justo para tu nivel' : 'Precio competitivo · puedes pedir más'

  async function generateStrategy() {
    setLoading(true)
    setStrategy('')
    setProgress(0)

    const iv = setInterval(() => setProgress(p => Math.min(p + 12, 85)), 300)

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'negotiation',
          data: {
            experienceYears,
            aforo,
            tipoEvento,
            ciudad,
            durationHours,
            travelIncluded,
            target: result.target,
            min: result.min,
          },
        }),
      })
      const data = await response.json()
      clearInterval(iv)
      setProgress(100)
      setStrategy(data.result || 'Error generando estrategia')
      setTimeout(() => setProgress(0), 800)
    } catch {
      clearInterval(iv)
      setStrategy('Error de conexión. Revisa tu configuración.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <div>
        <h1 className="page-title">Negociador de cachet justo</h1>
        <p className="page-sub">Calcula tu precio real y aprende a negociar como un profesional</p>

        <div className="grid grid-cols-2 gap-6">
          {/* LEFT: Config */}
          <div className="card space-y-5">
            <div className="section-title">Configura tu situación</div>

            <div>
              <label className="form-label">Años de experiencia como DJ</label>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="range" min={0} max={15} step={1} value={experienceYears}
                  onChange={e => setExperienceYears(Number(e.target.value))}
                  className="flex-1 accent-accent"
                />
                <span className="text-sm font-medium text-white w-16 text-right">
                  {experienceYears} {experienceYears === 1 ? 'año' : 'años'}
                </span>
              </div>
            </div>

            <div>
              <label className="form-label">Aforo del venue</label>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="range" min={50} max={3000} step={50} value={aforo}
                  onChange={e => setAforo(Number(e.target.value))}
                  className="flex-1 accent-accent"
                />
                <span className="text-sm font-medium text-white w-24 text-right">
                  {aforo.toLocaleString()} pers.
                </span>
              </div>
            </div>

            <div>
              <label className="form-label">Tipo de evento</label>
              <select
                className="form-input mt-1"
                value={tipoEvento}
                onChange={e => setTipoEvento(e.target.value as typeof tipoEvento)}
              >
                {TIPO_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div>
              <label className="form-label">Ciudad / mercado</label>
              <select
                className="form-input mt-1"
                value={ciudad}
                onChange={e => setCiudad(e.target.value as typeof ciudad)}
              >
                {CIUDAD_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div>
              <label className="form-label">Duración del set (horas)</label>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="range" min={1} max={8} step={0.5} value={durationHours}
                  onChange={e => setDurationHours(Number(e.target.value))}
                  className="flex-1 accent-accent"
                />
                <span className="text-sm font-medium text-white w-16 text-right">{durationHours}h</span>
              </div>
            </div>

            <div>
              <label className="form-label">¿Incluye transporte/alojamiento?</label>
              <select
                className="form-input mt-1"
                value={travelIncluded ? 'si' : 'no'}
                onChange={e => setTravelIncluded(e.target.value === 'si')}
              >
                <option value="si">Sí, está incluido</option>
                <option value="no">No, voy por mi cuenta (+15%)</option>
              </select>
            </div>
          </div>

          {/* RIGHT: Result */}
          <div className="space-y-4">
            <div className="card text-center">
              <div className="section-title mb-4">Tu cachet recomendado</div>
              <div className="text-xs text-muted mb-2">rango justo</div>
              <div className="font-display text-5xl font-extrabold text-accent">{formatCurrency(result.min)}</div>
              <div className="text-muted text-xl my-1">—</div>
              <div className="font-display text-5xl font-extrabold text-accent">{formatCurrency(result.max)}</div>
              <div className="text-xs text-muted mt-3">
                precio objetivo{' '}
                <span className="text-accent font-bold text-sm">{formatCurrency(result.target)}</span>
              </div>

              <div className="mt-4 h-2 bg-surface2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${meterPct}%`, background: meterColor }}
                />
              </div>
              <div className="text-xs text-muted mt-2">{meterLabel}</div>
            </div>

            <div className="card">
              <div className="section-title">Factores de precio</div>
              {[
                ['Experiencia', result.factors.experience],
                ['Aforo del venue', result.factors.aforo],
                ['Tipo de evento', result.factors.tipo],
                ['Mercado / ciudad', result.factors.ciudad],
                ['Duración del set', result.factors.duracion],
                ['Viajes', result.factors.extras],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-white/[0.06] last:border-0 text-sm">
                  <span className="text-muted">{label}</span>
                  <span className={
                    value.includes('+') ? 'text-accent font-medium' :
                    value.includes('-') ? 'text-red-400 font-medium' :
                    'text-muted'
                  }>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strategy section */}
        <div className="card mt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="section-title mb-0">Estrategia de negociación con IA</span>
            <AiGuard creditsUsed={0} creditsLimit={10} plan="free">
              <button
                className="btn-primary"
                onClick={generateStrategy}
                disabled={loading}
              >
                {loading ? '⟳ Generando...' : '✦ Generar estrategia'}
              </button>
            </AiGuard>
          </div>

          {progress > 0 && (
            <div className="h-0.5 bg-surface2 rounded mb-4 overflow-hidden">
              <div className="h-full bg-accent rounded transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          )}

          {strategy ? (
            <div>
              <div className="generated-content">{strategy}</div>
              <div className="flex gap-2 mt-3">
                <button className="btn-ghost text-sm py-1.5 px-3" onClick={generateStrategy}>↻ Regenerar</button>
                <button className="btn-primary text-sm py-1.5 px-3" onClick={() => navigator.clipboard.writeText(strategy)}>Copiar</button>
              </div>
            </div>
          ) : (
            <p className="text-muted text-sm">
              Pulsa "Generar estrategia" para obtener consejos personalizados de negociación basados en tu perfil y el tipo de evento.
            </p>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
