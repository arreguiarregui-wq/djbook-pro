import type { CachetCalculation } from '@/types'

interface CachetParams {
  experienceYears: number
  aforo: number
  tipoEvento: 'club' | 'festival' | 'privado' | 'residencia' | 'corporativo'
  ciudad: 'grande' | 'media' | 'pequeña' | 'internacional'
  durationHours: number
  travelIncluded: boolean
}

const TIPO_MULT = {
  club: 1,
  festival: 1.6,
  privado: 1.8,
  residencia: 0.75,
  corporativo: 2.2,
}

const CIUDAD_MULT = {
  grande: 1,
  media: 0.8,
  pequeña: 0.6,
  internacional: 2,
}

const TIPO_LABELS = {
  club: 'Club / sala',
  festival: 'Festival',
  privado: 'Privado / boda',
  residencia: 'Residencia',
  corporativo: 'Corporativo',
}

const CIUDAD_LABELS = {
  grande: 'Gran ciudad',
  media: 'Ciudad media',
  pequeña: 'Ciudad pequeña',
  internacional: 'Internacional',
}

export function calculateCachet(params: CachetParams): CachetCalculation {
  const { experienceYears, aforo, tipoEvento, ciudad, durationHours, travelIncluded } = params

  const base = 150
  const expMult = 1 + experienceYears * 0.12
  const aforoMult = 1 + (aforo / 3000) * 1.8
  const tipoMult = TIPO_MULT[tipoEvento]
  const ciudadMult = CIUDAD_MULT[ciudad]
  const durMult = 0.7 + durationHours * 0.15
  const extrasMult = !travelIncluded ? 1.15 : 1

  const target = Math.round(base * expMult * aforoMult * tipoMult * ciudadMult * durMult * extrasMult)
  const min = Math.round(target * 0.75)
  const max = Math.round(target * 1.35)

  return {
    min,
    max,
    target,
    factors: {
      experience: experienceYears >= 10 ? '+alto' : experienceYears >= 5 ? '+medio' : experienceYears >= 2 ? '+bajo' : 'base',
      aforo: aforo >= 1000 ? '+alto' : aforo >= 500 ? '+medio' : aforo >= 200 ? '+bajo' : 'base',
      tipo: TIPO_LABELS[tipoEvento],
      ciudad: CIUDAD_LABELS[ciudad],
      duracion: durationHours >= 4 ? '+alto' : durationHours >= 2 ? 'normal' : '-bajo',
      extras: !travelIncluded ? '+15% viajes' : 'incluido',
    },
  }
}

export function formatCurrency(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
