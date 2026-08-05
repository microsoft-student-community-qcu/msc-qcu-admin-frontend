import { createRootRoute, Outlet, redirect, Link, useRouter } from "@tanstack/react-router";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import * as Sentry from "@sentry/react";

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          An unexpected error occurred. You can try again or head back to the dashboard.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go to login
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/") {
      throw redirect({ to: "/login" });
    }
  },
  component: RootComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  return (
    <TooltipProvider>
      <Outlet />
      <Toaster />
    </TooltipProvider>
  );
}
