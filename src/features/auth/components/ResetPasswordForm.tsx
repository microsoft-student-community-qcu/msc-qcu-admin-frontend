import React from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  EyeRegular,
  EyeOffRegular,
  CheckmarkCircleRegular,
  DismissCircleRegular,
  ArrowClockwiseRegular,
  ArrowLeftRegular,
} from "@fluentui/react-icons";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/qcu-msc-logo.png";
import { useResetPasswordForm } from "../hooks/useResetPasswordForm";

import { useAutoHeight } from "../hooks/useAutoHeight";

interface ResetPasswordFormProps {
  token: string;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token }) => {
  const { contentRef, height } = useAutoHeight();
  const {
    email,
    isValidating,
    isTokenValid,
    validationError,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    formError,
    isSubmitting,
    isSuccess,
    handleSubmit,
  } = useResetPasswordForm(token);

  return (
    <motion.div
      layoutId="auth-card"
      animate={{ height }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="relative z-10 w-full max-w-[440px] bg-background shadow-64 rounded-none flex flex-col justify-between overflow-hidden"
    >
      <div ref={contentRef} className="w-full p-size320 md:p-size480">
        <AnimatePresence mode="wait">
          {isValidating ? (
            <motion.div
              key="validating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.12, ease: "easeIn" } }}
              exit={{ opacity: 0, transition: { duration: 0.12, ease: "easeOut" } }}
              className="py-size320 flex flex-col items-center justify-center gap-size160 text-center"
            >
              <ArrowClockwiseRegular fontSize={32} className="animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Validating reset link...</p>
            </motion.div>
          ) : !isTokenValid ? (
            <motion.div
              key="invalid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.12, ease: "easeIn" } }}
              exit={{ opacity: 0, transition: { duration: 0.12, ease: "easeOut" } }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex items-center gap-size120 mb-size160 text-[#e81123]">
                <DismissCircleRegular fontSize={32} className="shrink-0" />
                <h1 className="text-xl font-semibold tracking-tight text-center">
                  Invalid or expired link
                </h1>
              </div>

              <p className="text-sm text-muted-foreground mb-size240 text-center leading-relaxed">
                {validationError || "This password reset link is invalid, expired, or has already been used."}
              </p>

              <Link to="/forgot-password" className="w-full">
                <Button
                  type="button"
                  className="w-full rounded-none bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 text-sm font-medium cursor-pointer"
                >
                  Request new link
                </Button>
              </Link>
            </motion.div>
          ) : isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.12, ease: "easeIn" } }}
              exit={{ opacity: 0, transition: { duration: 0.12, ease: "easeOut" } }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-size200 flex flex-col items-center gap-size80">
                <img src={logo} alt="QCU MSC" className="h-9 object-contain" />
              </div>

              <h1 className="text-2xl font-semibold text-foreground mb-size160 tracking-tight text-center">
                Password updated
              </h1>

              <p className="text-sm text-muted-foreground mb-size240 text-center leading-relaxed">
                Your password has been reset. Please sign in with your new password.
              </p>

              <Link to="/login" className="w-full">
                <Button
                  type="button"
                  className="w-full rounded-none bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 text-sm font-medium cursor-pointer"
                >
                  Sign in
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

              {email && (
                <div className="mb-size120 text-xs text-foreground font-medium text-center max-w-[320px] truncate">
                  {email}
                </div>
              )}

              <h1 className="text-2xl font-semibold text-foreground mb-size240 tracking-tight text-center">
                Create new password
              </h1>

              <form onSubmit={handleSubmit} className="w-full flex flex-col items-center text-center">
                {/* Floating Outline New Password Box */}
                <div className="w-full relative mb-size160 text-left flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="reset-new-password"
                    name="newPassword"
                    autoComplete="new-password"
                    placeholder=" "
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoFocus
                    required
                    className="peer w-full border border-muted-foreground/60 bg-transparent pl-3 pr-9 pt-4 pb-1 text-sm outline-none rounded-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                  <label
                    htmlFor="reset-new-password"
                    className="absolute left-3 top-1 text-[11px] text-muted-foreground transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-[11px] peer-focus:text-primary pointer-events-none"
                  >
                    New password (min 8 chars)
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

                {/* Floating Outline Confirm Password Box */}
                <div className="w-full relative mb-size160 text-left">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="reset-confirm-password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    placeholder=" "
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="peer w-full border border-muted-foreground/60 bg-transparent px-3 pt-4 pb-1 text-sm outline-none rounded-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                  <label
                    htmlFor="reset-confirm-password"
                    className="absolute left-3 top-1 text-[11px] text-muted-foreground transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-[11px] peer-focus:text-primary pointer-events-none"
                  >
                    Confirm new password
                  </label>
                </div>

                {formError && (
                  <div className="w-full text-xs text-[#e81123] mb-size160 text-left animate-in fade-in duration-200">
                    {formError}
                  </div>
                )}

                {/* Full-width Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-none bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 text-sm font-medium cursor-pointer mb-size200"
                >
                  {isSubmitting ? "Resetting..." : "Reset password"}
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ResetPasswordForm;
