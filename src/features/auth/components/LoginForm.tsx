import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftRegular } from "@fluentui/react-icons";
import logo from "@/assets/qcu-msc-logo.png";
import { cn } from "@/lib/utils";
import { useLoginForm } from "../hooks/useLoginForm";

export const LoginForm: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const {
    step,
    email,
    setEmail,
    password,
    setPassword,
    error,
    isTransitioning,
    isSubmitting,
    handleNext,
    handleLogin,
    handleBack,
  } = useLoginForm(cardRef);

  return (
    <div
      ref={cardRef}
      className="relative z-10 w-full max-w-[440px] h-[320px] bg-background shadow-64 p-size320 md:p-size480 transition-all flex flex-col justify-between"
    >
      {/* Inner Content Wrapper for fade out */}
      <div
        className={cn(
          "w-full transition-opacity duration-300",
          isTransitioning ? "opacity-0" : "opacity-100",
        )}
      >
        {/* Logo */}
        <div className="mb-size200 flex items-center gap-size80">
          <img src={logo} alt="QCU MSC" className="h-8 object-contain shrink-0" />
          <div className="grid flex-1 min-w-0 text-left leading-tight">
            <span className="text-sm font-bold tracking-tight text-foreground">
              Quezon City University
            </span>
            <span className="text-[10px] uppercase tracking-normal text-muted-foreground">
              Microsoft Student Community
            </span>
          </div>
        </div>

        {step === 1 && (
          <form onSubmit={handleNext} className="animate-in fade-in duration-300">
            <h1 className="text-2xl font-semibold text-foreground mb-size160 tracking-tight text-left">
              Sign in
            </h1>

            <div className="mb-size80">
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

            <div className="h-5 text-sm mb-size160 text-left shrink-0">
              {error ? (
                <span className="text-[#e81123] animate-in fade-in duration-200">{error}</span>
              ) : (
                <span className="opacity-0 select-none">&nbsp;</span>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="rounded-none px-8 min-w-[108px] min-h-9 text-md cursor-pointer"
              >
                Next
              </Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleLogin} className="animate-in fade-in duration-300">
            <h1 className="text-2xl font-semibold text-foreground mb-size160 tracking-tight text-left">
              Enter password
            </h1>

            <div className="mb-size80">
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

            <div className="h-5 text-sm mb-size160 text-left shrink-0">
              {error ? (
                <span className="text-[#e81123] animate-in fade-in duration-200">{error}</span>
              ) : (
                <span className="opacity-0 select-none">&nbsp;</span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 -ml-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center justify-center rounded-full p-2 hover:bg-muted transition-colors cursor-pointer"
                  aria-label="Back"
                >
                  <ArrowLeftRegular fontSize={20} />
                </button>
                <span className="text-sm text-foreground">{email}</span>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-none px-8 min-w-[108px] min-h-9 text-md cursor-pointer"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
