'use client'
import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'

const TOOLS = [
  { id: 'bio', icon: '✦', title: 'Bio profesional', desc: 'Para Resident Advisor, Instagram o tu web', f1: 'Géneros musicales', f2: 'Ciudad / País', f3: 'Años de experiencia, clubs, logros...' },
  { id: 'post', icon: '◈', title: 'Post de Instagram', desc: 'Anuncia tu próxima actuación', f1: 'Género del set', f2: 'Nombre del venue/evento', f3: 'Fecha, hora, co-lineup, ambiente especial...' },
  { id: 'email', icon: '◎', title: 'Email de propuesta', desc: 'Para promotores y clubs', f1: 'Tu género/estilo', f2: 'Club / festival objetivo', f3: 'Tu experiencia y disponibilidad...' },
]

export default function MarketingPage() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [f1, setF1] = useState('')
  const [f2, setF2] = useState('')
  const [f3, setF3] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const tool = TOOLS.find(t => t.id === selectedTool)

  async function generate() {
    if (!selectedTool) return
    setLoading(true)
    setResult('')
    setProgress(0)

    const iv = setInterval(() => setProgress(p => Math.min(p + 12, 85)), 300)

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedTool,
          data: { genre: f1, venue: f2, city: f2, extra: f3 },
        }),
      })
      const data = await response.json()
      clearInterval(iv)
      setProgress(100)
      setResult(data.result || 'Error')
      setTimeout(() => setProgress(0), 800)
    } catch {
      clearInterval(iv)
      setResult('Error de conexión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <div>
        <h1 className="page-title">Marketing con IA</h1>
        <p className="page-sub">Genera contenido profesional en segundos</p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {TOOLS.map(t => (
            <button
              key={t.id}
              onClick={() => { setSelectedTool(t.id); setResult('') }}
              className={`text-left p-4 rounded-2xl border transition-all ${
                selectedTool === t.id
                  ? 'bg-accent/5 border-accent/40'
                  : 'bg-surface border-white/[0.08] hover:border-accent/20'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-accent2/15 flex items-center justify-center text-base mb-3">{t.icon}</div>
              <div className="text-sm font-medium text-white">{t.title}</div>
              <div className="text-xs text-muted mt-1">{t.desc}</div>
            </button>
          ))}
        </div>

        <div className="card">
          {!tool ? (
            <p className="text-muted text-sm">Selecciona una herramienta arriba para empezar.</p>
          ) : (
            <div>
              <div className="section-title">{tool.icon} {tool.title}</div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="form-label">{tool.f1}</label>
                  <input className="form-input" value={f1} onChange={e => setF1(e.target.value)} placeholder={tool.f1} />
                </div>
                <div>
                  <label className="form-label">{tool.f2}</label>
                  <input className="form-input" value={f2} onChange={e => setF2(e.target.value)} placeholder={tool.f2} />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label">{tool.f3}</label>
                <textarea className="form-input" value={f3} onChange={e => setF3(e.target.value)} placeholder={tool.f3} rows={2} />
              </div>
              <button className="btn-primary" onClick={generate} disabled={loading}>
                {loading ? '⟳ Generando...' : '✦ Generar con IA'}
              </button>
            </div>
          )}

          {progress > 0 && (
            <div className="h-0.5 bg-surface2 rounded mt-4 overflow-hidden">
              <div className="h-full bg-accent rounded transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          )}

          {result && (
            <div className="mt-4">
              <div className="generated-content">{result}</div>
              <div className="flex gap-2 mt-3">
                <button className="btn-ghost text-sm py-1.5 px-3" onClick={generate}>↻ Regenerar</button>
                <button className="btn-primary text-sm py-1.5 px-3" onClick={() => navigator.clipboard.writeText(result)}>Copiar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
