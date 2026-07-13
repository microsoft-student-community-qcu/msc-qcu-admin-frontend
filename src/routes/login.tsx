import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeftRegular } from '@fluentui/react-icons'
import logo from '@/assets/qcu-msc-logo.png'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/login')({
  component: LoginRoute,
})

function LoginRoute() {
  const navigate = useNavigate()
  const [step, setStep] = React.useState<1 | 2>(1)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const cardRef = React.useRef<HTMLDivElement>(null)

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setStep(2)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password) {
      // 1. Trigger the content fade out
      setIsTransitioning(true)
      
      // Save exact height to match in dashboard seamlessly
      if (cardRef.current) {
        sessionStorage.setItem('loginCardHeight', cardRef.current.offsetHeight.toString())
      }
      
      // 2. Wait for fade out, then redirect to dashboard to continue the sequence
      setTimeout(() => {
        sessionStorage.setItem('justLoggedIn', 'true')
        navigate({ to: '/dashboard' })
      }, 300)
    }
  }

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-size160 bg-muted overflow-hidden">
      {/* Stock Photo Background */}
      <img
        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />

      {/* Login Card (Stays static here, content fades out) */}
      <div className="relative z-10 w-full max-w-[440px] h-[360px] bg-background shadow-64 p-size320 md:p-size480 transition-all">
        
        {/* Inner Content Wrapper for fade out */}
        <div className={cn("w-full transition-opacity duration-300", isTransitioning ? "opacity-0" : "opacity-100")}>
          
          {/* Logo */}
          <div className="mb-size200 flex items-center gap-size80">
            <img src={logo} alt="QCU MSC" className="h-8 object-contain shrink-0" />
            <div className="grid flex-1 min-w-0 text-left leading-tight">
              <span className="text-sm font-bold tracking-tight text-foreground">Quezon City University</span>
              <span className="text-[10px] uppercase tracking-normal text-muted-foreground">Microsoft Student Community</span>
            </div>
          </div>

          {step === 1 && (
            <form onSubmit={handleNext} className="animate-in fade-in duration-300">
              <h1 className="text-2xl font-semibold text-foreground mb-size160 tracking-tight">
                Sign in
              </h1>
              
              <div className="mb-size160">
                <input
                  type="email"
                  placeholder="Email, phone, or Skype"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  required
                  className="w-full border-b border-muted-foreground bg-transparent py-1 text-sm outline-none transition-all focus:border-primary focus:shadow-[0_1px_0_0_var(--primary)] placeholder:text-muted-foreground/70"
                />
              </div>

              <div className="h-5 mb-size320" />

              <div className="flex justify-end">
                <Button type="submit" className="rounded-none px-8 min-w-[108px] min-h-9 text-md">
                  Next
                </Button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleLogin} className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h1 className="text-2xl font-semibold text-foreground mb-size160 tracking-tight">
                Enter password
              </h1>
              
              <div className="mb-size160">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  required
                  className="w-full border-b border-muted-foreground bg-transparent py-1 text-sm outline-none transition-all focus:border-primary focus:shadow-[0_1px_0_0_var(--primary)] placeholder:text-muted-foreground/70"
                />
              </div>

              <div className="text-sm mb-size320">
                <div>
                  <a href="#" className="text-primary hover:underline">Forgot password?</a>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 -ml-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center justify-center rounded-full p-2 hover:bg-muted transition-colors"
                    aria-label="Back"
                  >
                    <ArrowLeftRegular fontSize={20} />
                  </button>
                  <span className="text-sm text-foreground">{email}</span>
                </div>
                <Button type="submit" className="rounded-none px-8 min-w-[108px] min-h-9 text-md">
                  Sign in
                </Button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}
