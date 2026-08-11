import React from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeftRegular } from "@fluentui/react-icons";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/qcu-msc-logo.png";
import { useForgotPasswordForm } from "../hooks/useForgotPasswordForm";
import { useAutoHeight } from "../hooks/useAutoHeight";

export const ForgotPasswordForm: React.FC = () => {
  const { contentRef, height } = useAutoHeight();
  const { email, setEmail, isSubmitting, isSubmitted, error, handleSubmit } =
    useForgotPasswordForm();

  return (
    <motion.div
      layoutId="auth-card"
      animate={{ height }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="relative z-10 w-full max-w-[440px] bg-background shadow-64 rounded-none flex flex-col justify-between overflow-hidden"
    >
      <div ref={contentRef} className="w-full p-size320 md:p-size480">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="submitted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.12, ease: "easeIn" } }}
              exit={{ opacity: 0, transition: { duration: 0.12, ease: "easeOut" } }}
              className="flex flex-col items-center text-center"
            >
              {/* Centered Logo */}
              <div className="mb-size200 flex flex-col items-center gap-size80">
                <img src={logo} alt="QCU MSC" className="h-9 object-contain" />
              </div>

              <h1 className="text-2xl font-semibold text-foreground mb-size160 tracking-tight text-center">
                Check your email
              </h1>

              <p className="text-sm text-muted-foreground mb-size240 text-center leading-relaxed">
                If an account with <strong className="text-foreground">{email}</strong> exists, a password reset link has been sent.
              </p>

              <Link to="/login" className="w-full">
                <Button
                  type="button"
                  className="w-full rounded-none bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 text-sm font-medium cursor-pointer"
                >
                  Return to sign in
                </Button>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.12, ease: "easeIn" } }}
              exit={{ opacity: 0, transition: { duration: 0.12, ease: "easeOut" } }}
              className="flex flex-col items-center text-center"
            >
              {/* Header Row: Back button top-left, Logo + Branding centered */}
              <div className="w-full relative flex items-center justify-center mb-size160">
                <Link
                  to="/login"
                  className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center text-foreground hover:text-primary transition-colors cursor-pointer p-1"
                  aria-label="Back to sign in"
                >
                  <ArrowLeftRegular fontSize={20} />
                </Link>
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

              <h1 className="text-2xl font-semibold text-foreground mb-1 tracking-tight text-center">
                Reset password
              </h1>
              <p className="text-sm text-muted-foreground mb-size240 text-center">
                Enter your email address to receive a reset link.
              </p>

              <form onSubmit={handleSubmit} className="w-full flex flex-col items-center text-center">
                {/* Floating Outline Input Box */}
                <div className="w-full relative mb-size160 text-left">
                  <input
                    type="email"
                    id="forgot-email"
                    name="email"
                    autoComplete="email"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    required
                    className="peer w-full border border-muted-foreground/60 bg-transparent px-3 pt-4 pb-1 text-sm outline-none rounded-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                  <label
                    htmlFor="forgot-email"
                    className="absolute left-3 top-1 text-[11px] text-muted-foreground transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-[11px] peer-focus:text-primary pointer-events-none"
                  >
                    Email address
                  </label>
                </div>

                {error && (
                  <div className="w-full text-xs text-[#e81123] mb-size160 text-left animate-in fade-in duration-200">
                    {error}
                  </div>
                )}

                {/* Full-width Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-none bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 text-sm font-medium cursor-pointer mb-size200"
                >
                  {isSubmitting ? "Sending..." : "Send link"}
                </Button>

                <Link
                  to="/login"
                  className="text-xs font-semibold text-primary hover:underline cursor-pointer inline-block text-center"
                >
                  Back to sign in
                </Link>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordForm;
