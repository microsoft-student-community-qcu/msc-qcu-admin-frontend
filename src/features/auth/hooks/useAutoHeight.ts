import { useState, useRef, useLayoutEffect } from "react";

export function useAutoHeight<T extends HTMLElement = HTMLDivElement>() {
  const contentRef = useRef<T>(null);
  const [height, setHeight] = useState<number | "auto">("auto");

  useLayoutEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const borderBoxHeight = entry.borderBoxSize?.[0]?.blockSize;
        const contentHeight = borderBoxHeight ?? entry.contentRect.height;
        if (contentHeight > 0) {
          setHeight(contentHeight);
        }
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { contentRef, height };
}
