import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EyeRegular, EyeOffRegular } from "@fluentui/react-icons";
import { useChangePasswordForm } from "../hooks/useChangePasswordForm";

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  onOpenChange,
}) => {
  const {
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
  } = useChangePasswordForm(() => onOpenChange(false));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Update your account password. You will remain signed in on this device, but other active sessions will be terminated.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-size160 pt-size80">
          <div className="flex flex-col gap-size40">
            <label className="text-xs font-medium text-foreground">Current Password</label>
            <div className="relative flex items-center">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full border border-input bg-transparent px-3 py-1.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary rounded-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((v) => !v)}
                className="absolute right-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showCurrentPassword ? "Hide password" : "Show password"}
              >
                {showCurrentPassword ? <EyeOffRegular fontSize={20} /> : <EyeRegular fontSize={20} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-size40">
            <label className="text-xs font-medium text-foreground">New Password</label>
            <div className="relative flex items-center">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full border border-input bg-transparent px-3 py-1.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary rounded-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((v) => !v)}
                className="absolute right-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <EyeOffRegular fontSize={20} /> : <EyeRegular fontSize={20} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-size40">
            <label className="text-xs font-medium text-foreground">Confirm New Password</label>
            <input
              type={showNewPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-input bg-transparent px-3 py-1.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary rounded-none"
            />
          </div>

          {error && (
            <div className="text-xs text-[#e81123] animate-in fade-in duration-200">{error}</div>
          )}

          <DialogFooter className="pt-size80">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-none cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-none min-w-[100px] cursor-pointer"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
