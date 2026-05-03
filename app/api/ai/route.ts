import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PROMPTS = {
  negotiation: (d: any) => `Eres un manager experto en la industria de la música electrónica europea.
Un DJ con ${d.experienceYears} años de experiencia quiere tocar en un ${d.tipoEvento} en ${d.ciudad} (aforo: ${d.aforo} personas, ${d.durationHours}h de set).
Su cachet objetivo es €${d.target} (rango: €${d.min}–€${Math.round(d.target * 1.35)}).

Dame una estrategia de negociación práctica en 5 puntos:
1. Cómo presentar su precio con confianza
2. Qué argumentos usar para justificarlo
3. Cómo responder si ofrecen menos
4. Cuál es el mínimo aceptable y cuándo decir no
5. Consejo especial para DJs con ${d.experienceYears < 3 ? 'poca' : 'media'} experiencia

Sé directo, sin rodeos, como un manager que conoce la industria. En español.`,

  research: (d: any) => `Eres un experto en la escena de música electrónica mundial.
Analiza el venue "${d.name}" en ${d.city || 'ubicación desconocida'}, especializado en ${d.genre}.

Responde SOLO con este JSON exacto (sin markdown, sin texto extra):
{
  "nombre": "nombre oficial",
  "ciudad": "ciudad, país",
  "tipo": "club/festival/sala",
  "fundado": "año o 'desconocido'",
  "aforo": "número aprox",
  "score": número 1-10,
  "generos": ["genero1", "genero2"],
  "ambiente": "descripción del ambiente y clientela (1 frase)",
  "reputacion": "cómo trata a los DJs, si paga bien (2 frases)",
  "artistas_notables": "2-3 artistas conocidos que han tocado",
  "mejor_momento": "cuándo tocan los mejores artistas",
  "cachet_rango": "rango estimado para DJs nuevos en euros",
  "como_contactar": "recomendación práctica para contactar",
  "red_flags": "posibles problemas o 'Ninguno conocido'",
  "consejo_dj": "consejo específico para un DJ que quiera tocar allí"
}`,

  contact_email: (d: any) => `Escribe un email profesional y auténtico de un DJ que quiere tocar en "${d.venue}" (${d.city}).
El DJ es de ${d.genre}, con experiencia moderada y busca su primer booking allí.
El email debe:
- Tener un subject line irresistible
- Mencionar que conoce la programación del venue
- Mostrar personalidad artística propia
- Ser conciso (máx 150 palabras en el cuerpo)
- Tener call to action claro

Formato:
SUBJECT: [asunto]

[cuerpo del email]

En español.`,

  bio: (d: any) => `Escribe una bio profesional de DJ de ${d.genre} basado en ${d.city}. ${d.extra || ''}.
Tercera persona, 150-200 palabras, perfecta para Resident Advisor o web profesional.
Responde solo con la bio, sin títulos ni explicaciones.`,

  post: (d: any) => `Crea un post de Instagram para DJ de ${d.genre} en "${d.venue}". ${d.extra || ''}.
Con emojis estratégicos y hashtags relevantes (#techno #djlife etc). Tono hype pero auténtico.
Responde solo con el texto del post.`,

  email: (d: any) => `Email de propuesta de DJ de ${d.genre} para ${d.venue}. ${d.extra || ''}.
Subject line + cuerpo profesional con personalidad. Máx 200 palabras. En español.`,

  chat: (d: any) => d.message,
}

const SYSTEM_PROMPTS: Record<string, string> = {
  chat: `Eres el asistente IA de DJBook Pro, app de gestión para DJs profesionales.
Eres como un manager experimentado en la escena electrónica europea.
Ayudas con: cachets justos, negociación con promotores, red flags de venues, cómo conseguir bookings, contratos, rider técnico, desarrollo de carrera, marketing.
Eres directo, práctico, con conocimiento real de la industria. Responde en español. Respuestas concisas y accionables.`,
}

export async function POST(req: NextRequest) {
  try {
    const { type, data, history } = await req.json()

    if (!PROMPTS[type as keyof typeof PROMPTS]) {
      return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
    }

    const promptFn = PROMPTS[type as keyof typeof PROMPTS]
    const content = typeof promptFn === 'function' ? promptFn(data) : ''

    const messages = type === 'chat' && history
      ? [...history, { role: 'user' as const, content: data.message }]
      : [{ role: 'user' as const, content }]

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: SYSTEM_PROMPTS[type] || undefined,
      messages,
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    // Parse JSON for research
    if (type === 'research') {
      try {
        const parsed = JSON.parse(text)
        return NextResponse.json({ result: parsed })
      } catch {
        return NextResponse.json({
          result: {
            nombre: data.name, ciudad: data.city, tipo: 'Venue', fundado: '?',
            aforo: '?', score: 7, generos: [data.genre], ambiente: text.slice(0, 200),
            reputacion: 'Sin datos específicos disponibles',
            artistas_notables: 'Sin datos', mejor_momento: 'Sin datos',
            cachet_rango: 'Consultar directamente', como_contactar: 'Busca en Instagram o Resident Advisor',
            red_flags: 'Investiga antes de confirmar',
            consejo_dj: 'Busca reseñas en foros y contacta con DJs que hayan tocado allí',
          }
        })
      }
    }

    return NextResponse.json({ result: text })
  } catch (error) {
    console.error('AI API error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
