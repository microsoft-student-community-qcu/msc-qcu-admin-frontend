import { useState, useCallback, FormEvent } from "react";
import { changePassword } from "../services/authApi";
import { changePasswordSchema } from "../schemas/changePasswordSchema";
import { toast } from "sonner";

export function useChangePasswordForm(onSuccess?: () => void) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);

      const validation = changePasswordSchema.safeParse({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (!validation.success) {
        const issue = validation.error.issues[0];
        setError(issue ? issue.message : "Validation error");
        return;
      }

      setIsSubmitting(true);

      try {
        const res = await changePassword(currentPassword, newPassword);
        if (res.success) {
          toast.success(res.message || "Password changed successfully.");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          onSuccess?.();
        } else {
          if (res.errors && res.errors.newPassword) {
            setError(res.errors.newPassword.join(", "));
          } else {
            setError(res.message || "Failed to change password.");
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to change password.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentPassword, newPassword, confirmPassword, onSuccess],
  );

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    error,
    isSubmitting,
    handleSubmit,
  };
}
