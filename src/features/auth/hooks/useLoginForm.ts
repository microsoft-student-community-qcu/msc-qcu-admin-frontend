import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { login } from "../services/authApi";
import { mockAccounts } from "@/mocks/accounts";
import { loginSchema } from "../schemas/loginSchema";
import { SignInResponse, UserProfile, UserRole } from "../types";

export function useLoginForm(cardRef: React.RefObject<HTMLDivElement | null>) {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate only email field on the first step
    const emailResult = loginSchema.shape.email.safeParse(email.trim());
    if (!emailResult.success) {
      setError(emailResult.error.issues[0].message);
      return;
    }
    
    setStep(2);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email and password inputs via Zod schema
    const result = loginSchema.safeParse({ email: email.trim(), password });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setIsSubmitting(true);
    try {
      const json: SignInResponse = await login(email.trim(), password);

      if (json.user) {
        const role = json.user.role || "ADMIN_HR";
        const name = json.user.name || `${json.user.firstName || ""} ${json.user.lastName || ""}`.trim() || "Admin";
        const account: UserProfile = {
          email: json.user.email,
          name: name,
          role: role as UserRole, // Cast to UserRole enum type
          avatarFallback: name.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2),
        };

        setIsTransitioning(true);

        if (cardRef.current) {
          sessionStorage.setItem("loginCardHeight", cardRef.current.offsetHeight.toString());
        }

        sessionStorage.setItem("currentUser", JSON.stringify(account));
        const token = json.session?.token || json.token;
        if (token) {
          sessionStorage.setItem("accessToken", token);
        }
        sessionStorage.setItem("justLoggedIn", "true");

        setTimeout(() => {
          navigate({ to: "/dashboard" });
        }, 300);
      }
    } catch (err: any) {
      console.warn("Backend auth connection failed. Falling back to mock accounts.", err);
      const account = mockAccounts[email.trim().toLowerCase()];
      if (account && password === "password123") {
        setIsTransitioning(true);

        if (cardRef.current) {
          sessionStorage.setItem("loginCardHeight", cardRef.current.offsetHeight.toString());
        }

        sessionStorage.setItem("currentUser", JSON.stringify(account));
        sessionStorage.setItem("justLoggedIn", "true");

        setTimeout(() => {
          navigate({ to: "/dashboard" });
        }, 300);
      } else {
        setError(err.message || "Invalid email or password.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setError(null);
  };

  return {
    step,
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError,
    isTransitioning,
    isSubmitting,
    handleNext,
    handleLogin,
    handleBack,
  };
}
