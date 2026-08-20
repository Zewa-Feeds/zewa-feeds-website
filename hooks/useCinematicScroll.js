"use client";

import { useEffect, useState, useRef, useCallback } from "react";

export function useCinematicScroll(totalChapters = 6) {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [chapterProgress, setChapterProgress] = useState(0);
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 });

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const rafIdRef = useRef(null);

  const updateScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const windowH = window.innerHeight;
    const scrollableH = rect.height - windowH;

    if (scrollableH <= 0) return;

    const currentScroll = Math.max(0, -rect.top);
    const target = Math.min(1, Math.max(0, currentScroll / scrollableH));
    targetProgressRef.current = target;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loop = () => {
      if (!isMounted) return;

      // Smooth lerp: current + (target - current) * factor
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * 0.15; // Smooth spring interpolation
        const p = currentProgressRef.current;
        setScrollProgress(p);

        // Calculate active chapter index (0 to totalChapters - 1)
        const rawChapter = p * (totalChapters - 1);
        const idx = Math.min(totalChapters - 1, Math.floor(rawChapter));
        const intra = rawChapter - idx;

        setCurrentChapter(idx);
        setChapterProgress(intra);
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    const handleScroll = () => {
      updateScroll();
    };

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMouseParallax({
        x: (clientX / innerWidth - 0.5) * 24, // -12px to +12px
        y: (clientY / innerHeight - 0.5) * 24,
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    updateScroll();

    return () => {
      isMounted = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [totalChapters, updateScroll]);

  const jumpToChapter = (index) => {
    const el = containerRef.current;
    if (!el) return;
    const windowH = window.innerHeight;
    const scrollableH = el.getBoundingClientRect().height - windowH;
    const targetScroll = (index / (totalChapters - 1)) * scrollableH;
    const targetTop = el.offsetTop + targetScroll;

    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });
  };

  return {
    containerRef,
    scrollProgress,
    currentChapter,
    chapterProgress,
    mouseParallax,
    jumpToChapter,
  };
}
