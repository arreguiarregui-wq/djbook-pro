'use client'

import Sidebar from '@/components/layout/Sidebar'
import HoloBlob from '@/components/ui/HoloBlob'
import AiLimitBanner from '@/components/ui/AiLimitBanner'
import { useAuth } from '@/lib/useAuth'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  useAuth()

  return (
    <div className="flex min-h-screen">
      <HoloBlob />
      <Sidebar />
      <AiLimitBanner />
      <main className="md:ml-[220px] flex-1 p-4 md:p-8 min-h-screen pt-14 md:pt-8 pb-20 md:pb-8">
        {children}
      </main>
    </div>
  )
}
