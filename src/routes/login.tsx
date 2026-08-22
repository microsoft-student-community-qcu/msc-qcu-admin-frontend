import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const Route = createFileRoute("/login")({
  component: LoginRoute,
});

function LoginRoute() {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-size160 bg-muted overflow-hidden">
      {/* Stock Photo Background */}
      <img
        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />

      {/* Login Form Card Component */}
      <LoginForm />
    </div>
  );
}
