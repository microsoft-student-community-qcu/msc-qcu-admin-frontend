import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { AuthLayout } from "@/features/auth/components/AuthLayout";

export const Route = createFileRoute("/login")({
  component: LoginRoute,
});

function LoginRoute() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
