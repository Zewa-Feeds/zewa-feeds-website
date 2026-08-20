"use client";

import { useEffect, useState, useRef, useCallback } from "react";

export function useScrollTimeline(itemCount = 6) {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate relative scroll progress (0 to 1) through the container
    const totalHeight = rect.height - windowHeight;
    if (totalHeight <= 0) return;

    const currentScroll = Math.max(0, -rect.top);
    const progress = Math.min(1, Math.max(0, currentScroll / totalHeight));

    setScrollProgress(progress);

    // Calculate active milestone index
    const calculatedIndex = Math.min(
      itemCount - 1,
      Math.floor(progress * itemCount)
    );
    setActiveIndex(calculatedIndex);
  }, [itemCount]);

  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX / innerWidth - 0.5) * 20, // -10px to +10px
      y: (clientY / innerHeight - 0.5) * 20,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleScroll, handleMouseMove]);

  return {
    containerRef,
    scrollProgress,
    activeIndex,
    setActiveIndex,
    mousePos,
  };
}
