import { useState, useCallback, FormEvent } from "react";
import { forgotPassword } from "../services/authApi";
import { forgotPasswordSchema } from "../schemas/forgotPasswordSchema";

export function useForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);

      const validation = forgotPasswordSchema.safeParse({ email });
      if (!validation.success) {
        const issue = validation.error.issues[0];
        setError(issue ? issue.message : "Invalid email address");
        return;
      }

      setIsSubmitting(true);

      try {
        await forgotPassword(email);
        setIsSubmitted(true);
      } catch (err: any) {
        setError(err.message || "Failed to send reset link. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [email],
  );

  return {
    email,
    setEmail,
    isSubmitting,
    isSubmitted,
    error,
    handleSubmit,
  };
}
