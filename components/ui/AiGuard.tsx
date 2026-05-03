'use client'

interface AiGuardProps {
  creditsUsed: number
  creditsLimit: number
  plan: 'free' | 'pro'
  onUpgrade?: () => void
  children: React.ReactNode
}

export default function AiGuard({ creditsUsed, creditsLimit, plan, onUpgrade, children }: AiGuardProps) {
  const isLimited = plan === 'free' && creditsUsed >= creditsLimit

  if (isLimited) {
    return (
      <div className="bg-surface2 border border-accent2/30 rounded-xl p-6 text-center">
        <div className="text-2xl mb-3">✦</div>
        <div className="text-white font-medium mb-2">Has usado tus {creditsLimit} créditos gratuitos</div>
        <div className="text-muted text-sm mb-4">
          Actualiza al plan Pro para acceso ilimitado a todas las herramientas IA
        </div>
        <button className="btn-accent2" onClick={onUpgrade}>
          Actualizar a Pro — €9/mes
        </button>
        <div className="text-xs text-muted mt-3">Cancela cuando quieras</div>
      </div>
    )
  }

  return (
    <div>
      {plan === 'free' && (
        <div className="flex items-center justify-between mb-4 p-3 bg-surface2 rounded-lg border border-white/[0.08]">
          <span className="text-xs text-muted">
            Créditos IA gratuitos: <span className="text-white font-medium">{creditsLimit - creditsUsed} restantes</span>
          </span>
          <button className="text-xs text-accent2 hover:underline" onClick={onUpgrade}>
            Actualizar a Pro →
          </button>
        </div>
      )}
      {children}
    </div>
  )
}
