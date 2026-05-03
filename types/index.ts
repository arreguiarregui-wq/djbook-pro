// ================================================
// DJBOOK PRO — Tipos TypeScript
// ================================================

export type Plan = 'free' | 'pro'
export type BookingStatus = 'pendiente' | 'confirmado' | 'completado' | 'cancelado'

export interface Profile {
  id: string
  created_at: string
  dj_name: string | null
  real_name: string | null
  bio: string | null
  city: string | null
  country: string
  avatar_url: string | null
  genres: string[]
  experience_years: number
  cachet_min: number
  cachet_max: number
  availability: string[]
  rider: {
    cdj: string
    mixer: string
    monitor: boolean
  }
  instagram: string | null
  soundcloud: string | null
  resident_advisor: string | null
  website: string | null
  plan: Plan
  ai_credits_used: number
  ai_credits_limit: number
}

export interface Booking {
  id: string
  created_at: string
  user_id: string
  venue_name: string
  venue_city: string | null
  event_date: string
  start_time: string | null
  duration_hours: number
  genre: string | null
  cachet: number
  currency: string
  travel_included: boolean
  accomodation_included: boolean
  status: BookingStatus
  promoter_name: string | null
  promoter_email: string | null
  promoter_phone: string | null
  notes: string | null
  rider_notes: string | null
}

export interface Venue {
  id: string
  created_at: string
  user_id: string
  name: string
  city: string | null
  country: string | null
  genre: string | null
  research_data: VenueResearch | null
  score: number | null
  bookings_count: number
}

export interface VenueResearch {
  nombre: string
  ciudad: string
  tipo: string
  fundado: string
  aforo: string
  score: number
  generos: string[]
  ambiente: string
  reputacion: string
  artistas_notables: string
  mejor_momento: string
  cachet_rango: string
  como_contactar: string
  red_flags: string
  consejo_dj: string
}

export interface DashboardStats {
  bookings_this_month: number
  confirmed_total: number
  pending_total: number
  revenue_this_month: number
  avg_cachet: number
}

export interface CachetCalculation {
  min: number
  max: number
  target: number
  factors: {
    experience: string
    aforo: string
    tipo: string
    ciudad: string
    duracion: string
    extras: string
  }
}

// Plan limits
export const PLAN_LIMITS = {
  free: {
    ai_credits: 10,
    bookings: 20,
    venues: 5,
  },
  pro: {
    ai_credits: Infinity,
    bookings: Infinity,
    venues: Infinity,
  },
} as const
