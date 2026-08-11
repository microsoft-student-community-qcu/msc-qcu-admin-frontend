import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import { AuthLayout } from "@/features/auth/components/AuthLayout";

interface ResetPasswordSearch {
  token?: string;
}

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>): ResetPasswordSearch => ({
    token: typeof search.token === "string" ? search.token : "",
  }),
  component: ResetPasswordRoute,
});

function ResetPasswordRoute() {
  const { token } = Route.useSearch();

  return (
    <AuthLayout>
      <ResetPasswordForm token={token || ""} />
    </AuthLayout>
  );
}
