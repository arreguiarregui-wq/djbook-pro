'use client'
import { useState, useRef, useEffect } from 'react'
import AppLayout from '@/components/layout/AppLayout'

interface Message { role: 'user' | 'assistant'; content: string }

const QUICK_PROMPTS = [
  '¿Cuánto cobrar en un club de 500 personas con 2 años de experiencia?',
  'Cómo negociar si el promotor ofrece menos de lo que pido',
  '¿Qué red flags debo evitar con un nuevo promotor?',
  'Cómo conseguir mi primer booking en un club serio',
  '¿Qué debe incluir un rider técnico básico?',
  'Cómo crecer en redes siendo DJ nuevo',
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! Soy tu asistente de DJBook Pro. Puedo ayudarte con cachets, negociaciones, venues, marketing, contratos y todo lo que necesites para tu carrera. ¿En qué te ayudo hoy?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(text?: string) {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: msg }])
    setLoading(true)

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'chat', data: { message: msg }, history }),
      })
      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.result || 'Error' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error de conexión. Inténtalo de nuevo.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <div>
        <h1 className="page-title">Asistente IA</h1>
        <p className="page-sub">Tu manager virtual disponible 24/7</p>

        <div className="card">
          {/* Messages */}
          <div className="h-[420px] overflow-y-auto flex flex-col gap-3 mb-4 pr-1">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-accent2 text-white rounded-br-sm'
                    : 'bg-surface2 text-white rounded-bl-sm'
                }`}>
                  {msg.role === 'assistant' && (
                    <div className="text-[10px] text-accent font-semibold tracking-wider mb-1">DJBOOK AI</div>
                  )}
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-surface2 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="text-[10px] text-accent font-semibold tracking-wider mb-1">DJBOOK AI</div>
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          <div className="flex gap-2 flex-wrap mb-3">
            {QUICK_PROMPTS.slice(0, 4).map(p => (
              <button key={p} className="btn-ghost text-xs py-1.5 px-3" onClick={() => send(p)} disabled={loading}>
                {p.slice(0, 35)}...
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <input
              className="form-input flex-1"
              placeholder="Pregunta lo que necesites..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              disabled={loading}
            />
            <button className="btn-accent2 px-5" onClick={() => send()} disabled={loading || !input.trim()}>
              Enviar
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
