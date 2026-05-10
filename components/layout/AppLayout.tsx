import Sidebar from '@/components/layout/Sidebar'
import { useAuth } from '@/lib/useAuth'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  useAuth()
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-[220px] flex-1 p-8 min-h-screen">
        {children}
      </main>
    </div>
  )
}
