import * as React from "react";

interface UseIntersectionObserverProps {
  target: React.RefObject<Element | null>;
  onIntersect: () => void;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export function useIntersectionObserver({
  target,
  onIntersect,
  threshold = 0.1,
  rootMargin = "100px", // Trigger slightly before reaching the end for smoother loading
  enabled = true,
}: UseIntersectionObserverProps) {
  React.useEffect(() => {
    if (!enabled) return;

    const element = target.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect();
          }
        });
      },
      {
        rootMargin,
        threshold,
      },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [target, enabled, rootMargin, threshold, onIntersect]);
}
