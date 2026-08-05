import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Sidebar } from './sidebar'
import { Header } from './header'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
        <Sidebar />
        <SidebarInset className="flex h-full w-full flex-col bg-background">
          <Header />
          <main className="flex-1 overflow-y-auto bg-background p-size320">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
