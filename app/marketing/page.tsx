'use client'
import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'

const TOOLS = [
  { id: 'bio', icon: '✦', title: 'Professional Bio', desc: 'For Resident Advisor, Instagram or your website', f1: 'Musical genres', f2: 'City / Country', f3: 'Years of experience, clubs, achievements...' },
  { id: 'post', icon: '◈', title: 'Instagram Post', desc: 'Announce your next gig', f1: 'Set genre', f2: 'Venue / event name', f3: 'Date, time, co-lineup, special atmosphere...' },
  { id: 'email', icon: '◎', title: 'Booking Proposal Email', desc: 'For promoters and clubs', f1: 'Your genre / style', f2: 'Target club / festival', f3: 'Your experience and availability...' },
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
      setResult('Connection error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <div>
        <h1 className="page-title">AI Marketing</h1>
        <p className="page-sub">Generate professional content in seconds</p>

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
            <p className="text-muted text-sm">Select a tool above to get started.</p>
          ) : (
            <div>
              <div className="text-sm font-medium text-white mb-4">{tool.title}</div>
              <div className="space-y-3 mb-4">
                <div>
                  <label className="form-label">{tool.f1}</label>
                  <input className="form-input" value={f1} onChange={e => setF1(e.target.value)} placeholder={tool.f1} />
                </div>
                <div>
                  <label className="form-label">{tool.f2}</label>
                  <input className="form-input" value={f2} onChange={e => setF2(e.target.value)} placeholder={tool.f2} />
                </div>
                <div>
                  <label className="form-label">Additional details</label>
                  <textarea className="form-input" value={f3} onChange={e => setF3(e.target.value)} placeholder={tool.f3} rows={3} />
                </div>
              </div>

              {progress > 0 && (
                <div className="h-1 bg-surface2 rounded-full mb-4 overflow-hidden">
                  <div className="h-full bg-accent2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              )}

              <button className="btn-primary w-full mb-4" onClick={generate} disabled={loading || !f1}>
                {loading ? 'Generating...' : 'Generate with AI →'}
              </button>

              {result && (
                <div className="bg-surface2 rounded-xl p-4 text-sm text-white whitespace-pre-wrap leading-relaxed">
                  {result}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
