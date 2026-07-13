import * as React from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useLocation } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-react'

export function Header() {
  const location = useLocation()
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark'
    }
    return false
  })

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
      setIsDark(true)
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark')
      setIsDark(false)
    } else {
      // Default to document check
      setIsDark(document.documentElement.classList.contains('dark'))
    }
  }, [])

  const toggleTheme = () => {
    const nextDark = !isDark
    setIsDark(nextDark)
    if (nextDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }
  
  const getPageTitle = (pathname: string) => {
    if (pathname.startsWith('/dashboard')) return 'Dashboard'
    if (pathname.startsWith('/applications')) return 'Applicants'
    if (pathname.startsWith('/events')) return 'Events'
    if (pathname.startsWith('/design-system')) return 'Design System'
    return 'Administration'
  }

  const title = getPageTitle(location.pathname)

  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-size240">
      <div className="flex items-center gap-size160">
        <SidebarTrigger className="-ml-size80" />
        <div className="hidden sm:block text-lg font-semibold text-foreground">
          {title}
        </div>
      </div>
      <div className="flex items-center gap-size120">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>
    </header>
  )
}
