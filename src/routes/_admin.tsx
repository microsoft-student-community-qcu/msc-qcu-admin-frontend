import * as React from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/shared/admin-layout";

export const Route = createFileRoute("/_admin")({
  component: AdminRoute,
});

function AdminRoute() {
  const [stage, setStage] = React.useState<0 | 1 | 2>(() => {
    return sessionStorage.getItem("justLoggedIn") ? 0 : 2;
  });

  const isFromLogin = React.useRef(stage === 0).current;

  React.useEffect(() => {
    if (isFromLogin) {
      sessionStorage.removeItem("justLoggedIn");

      const expandTimer = setTimeout(() => {
        setStage(1);
      }, 50);

      const contentTimer = setTimeout(() => {
        setStage(2);
      }, 750);

      return () => {
        clearTimeout(expandTimer);
        clearTimeout(contentTimer);
      };
    }
  }, [isFromLogin]);

  // If we didn't just log in, immediately render the layout without the animation wrapper
  if (!isFromLogin) {
    return (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-muted overflow-hidden">
      <AnimatePresence>
        {stage < 2 && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-0"
          >
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80"
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout={isFromLogin}
        initial={{ borderRadius: 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.7 }}
        className={cn(
          "relative z-10 bg-background flex flex-col origin-center",
          stage === 0 ? "w-full max-w-[440px] h-[320px] shadow-64" : "w-screen h-screen max-w-none",
        )}
      >
        <div
          className={cn(
            "flex-1 transition-opacity duration-500",
            stage === 2 ? "opacity-100" : "opacity-0",
          )}
        >
          {stage === 2 && (
            <motion.div
              initial={isFromLogin ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="h-full w-full"
            >
              <AdminLayout>
                <Outlet />
              </AdminLayout>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
