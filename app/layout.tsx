import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DJBook Pro — Gestión de bookings para DJs',
  description: 'App profesional para DJs: gestiona tus bookings, negocia cachets justos e investiga venues con IA.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
