import React, { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeftRegular, EyeRegular, EyeOffRegular } from "@fluentui/react-icons";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/qcu-msc-logo.png";
import { cn } from "@/lib/utils";
import { useLoginForm } from "../hooks/useLoginForm";
import { useAutoHeight } from "../hooks/useAutoHeight";

export const LoginForm: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { contentRef, height } = useAutoHeight();
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

  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <motion.div
      ref={cardRef}
      layoutId="auth-card"
      animate={{ height }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="relative z-10 w-full max-w-[440px] bg-background shadow-64 rounded-none flex flex-col justify-between overflow-hidden"
    >
      {/* Inner Content Wrapper */}
      <div
        ref={contentRef}
        className={cn(
          "w-full p-size320 md:p-size480 transition-opacity duration-300",
          isTransitioning ? "opacity-0" : "opacity-100",
        )}
      >
        <form onSubmit={step === 1 ? handleNext : handleLogin} className="w-full">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.12, ease: "easeIn" } }}
                exit={{ opacity: 0, transition: { duration: 0.12, ease: "easeOut" } }}
                className="flex flex-col items-center text-center"
              >
                {/* Centered Logo */}
                <div className="mb-size200 flex flex-col items-center gap-size80">
                  <img src={logo} alt="QCU MSC" className="h-9 object-contain" />
                  <div className="text-center leading-tight">
                    <span className="text-sm font-bold tracking-tight text-foreground block">
                      Quezon City University
                    </span>
                    <span className="text-[10px] uppercase tracking-normal text-muted-foreground block">
                      Microsoft Student Community
                    </span>
                  </div>
                </div>

                <h1 className="text-2xl font-semibold text-foreground mb-1 tracking-tight text-center">
                  Sign in
                </h1>
                <p className="text-sm text-muted-foreground mb-size240 text-center">
                  Use your QCU MSC account.
                </p>

                {/* Floating Outline Input Box */}
                <div className="w-full relative mb-size240 text-left">
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    autoComplete="username"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus={step === 1}
                    required={step === 1}
                    className="peer w-full border border-muted-foreground/60 bg-transparent px-3 pt-4 pb-1 text-sm outline-none rounded-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                  <label
                    htmlFor="login-email"
                    className="absolute left-3 top-1 text-[11px] text-muted-foreground transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-[11px] peer-focus:text-primary pointer-events-none"
                  >
                    Email or phone number
                  </label>
                </div>

                {error && step === 1 && (
                  <div className="w-full text-xs text-[#e81123] mb-size160 text-left animate-in fade-in duration-200">
                    {error}
                  </div>
                )}

                {/* Full-width Button */}
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!email) return;
                    handleNext(e as any);
                  }}
                  className="w-full rounded-none bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 text-sm font-medium cursor-pointer"
                >
                  Next
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.12, ease: "easeIn" } }}
                exit={{ opacity: 0, transition: { duration: 0.12, ease: "easeOut" } }}
                className="flex flex-col items-center text-center"
              >
                {/* Header Row: Back button top-left, Logo + Branding centered */}
                <div className="w-full relative flex items-center justify-center mb-size160">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center text-foreground hover:text-primary transition-colors cursor-pointer p-1"
                    aria-label="Back to email input"
                  >
                    <ArrowLeftRegular fontSize={20} />
                  </button>
                  <div className="flex items-center gap-size80">
                    <img src={logo} alt="QCU MSC" className="h-8 object-contain shrink-0" />
                    <div className="text-left leading-tight">
                      <span className="text-sm font-bold tracking-tight text-foreground block">
                        Quezon City University
                      </span>
                      <span className="text-[10px] uppercase tracking-normal text-muted-foreground block">
                        Microsoft Student Community
                      </span>
                    </div>
                  </div>
                </div>

                {/* Centered Email Display */}
                <div className="mb-size120 text-xs text-foreground font-medium text-center max-w-[320px] truncate">
                  {email}
                </div>

                <h1 className="text-2xl font-semibold text-foreground mb-size240 tracking-tight text-center">
                  Enter your password
                </h1>

                {/* Floating Outline Password Box */}
                <div className="w-full relative mb-size160 text-left flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="login-password"
                    name="password"
                    autoComplete="current-password"
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus={step === 2}
                    required={step === 2}
                    className="peer w-full border border-muted-foreground/60 bg-transparent pl-3 pr-9 pt-4 pb-1 text-sm outline-none rounded-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                  <label
                    htmlFor="login-password"
                    className="absolute left-3 top-1 text-[11px] text-muted-foreground transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-[11px] peer-focus:text-primary pointer-events-none"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffRegular fontSize={20} /> : <EyeRegular fontSize={20} />}
                  </button>
                </div>

                {error && step === 2 && (
                  <div className="w-full text-xs text-[#e81123] mb-size120 text-left animate-in fade-in duration-200">
                    {error}
                  </div>
                )}

                {/* Full-width Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-none bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 text-sm font-medium cursor-pointer mb-size200"
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-primary hover:underline cursor-pointer inline-block text-center"
                >
                  Forgot my password
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </motion.div>
  );
};

export default LoginForm;
