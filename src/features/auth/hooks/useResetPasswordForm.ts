import { useState, useEffect, useCallback, FormEvent } from "react";
import { validateResetToken, resetPassword } from "../services/authApi";
import { resetPasswordSchema } from "../schemas/resetPasswordSchema";

export function useResetPasswordForm(token: string) {
  const [email, setEmail] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!token) {
      setIsValidating(false);
      setIsTokenValid(false);
      setValidationError("Missing or invalid reset token.");
      return;
    }

    async function checkToken() {
      try {
        const res = await validateResetToken(token);
        if (isMounted) {
          if (res.success && res.data?.email) {
            setIsTokenValid(true);
            setEmail(res.data.email);
          } else {
            setIsTokenValid(false);
            setValidationError(res.message || "Invalid or expired reset link. Please request a new one.");
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setIsTokenValid(false);
          setValidationError(err.message || "Failed to validate reset token.");
        }
      } finally {
        if (isMounted) {
          setIsValidating(false);
        }
      }
    }

    checkToken();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setFormError(null);

      const validation = resetPasswordSchema.safeParse({ newPassword, confirmPassword });
      if (!validation.success) {
        const issue = validation.error.issues[0];
        setFormError(issue ? issue.message : "Validation error");
        return;
      }

      setIsSubmitting(true);

      try {
        const res = await resetPassword(token, newPassword);
        if (res.success) {
          setIsSuccess(true);
        } else {
          if (res.errors && res.errors.newPassword) {
            setFormError(res.errors.newPassword.join(", "));
          } else {
            setFormError(res.message || "Failed to reset password.");
          }
        }
      } catch (err: any) {
        setFormError(err.message || "An unexpected error occurred while resetting password.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [token, newPassword, confirmPassword],
  );

  return {
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
  };
}
