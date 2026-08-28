"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

export const TIDIO_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_TIDIO_PUBLIC_KEY || "bskymfizgyuqcwn3wpsiffd7i4zrhwrn";

export default function TidioChat() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update Tidio widget visibility based on scroll position and pathname
  useEffect(() => {
    if (!mounted) return;

    if (pathname === "/checkout") {
      setVisible(false);
      try {
        window.tidioChatApi?.hide?.();
        window.tidioChatApi?.display?.(false);
      } catch {
        /* ignore */
      }
      return;
    }

    const updateVisibility = () => {
      const heroEl = document.getElementById("hero");
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        // Hide while hero is in view; reveal once user scrolls past hero
        const threshold = Math.max(heroEl.offsetHeight - 200, 200);
        const isPastHero = window.scrollY > threshold || rect.bottom <= 200;
        setVisible(isPastHero);
        try {
          if (isPastHero) {
            window.tidioChatApi?.show?.();
            window.tidioChatApi?.display?.(true);
          } else {
            window.tidioChatApi?.hide?.();
            window.tidioChatApi?.display?.(false);
          }
        } catch {}
      } else {
        // On pages without #hero (e.g. /products, /about, /cart), chat is available
        setVisible(true);
        try {
          window.tidioChatApi?.show?.();
          window.tidioChatApi?.display?.(true);
        } catch {}
      }
    };

    updateVisibility();

    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateVisibility);
    };
  }, [mounted, pathname]);

  // Hook into Tidio's ready event to apply initial visibility state
  const handleTidioReady = () => {
    try {
      if (visible) {
        window.tidioChatApi?.show?.();
        window.tidioChatApi?.display?.(true);
      } else {
        window.tidioChatApi?.hide?.();
        window.tidioChatApi?.display?.(false);
      }
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    const onTidioReady = () => handleTidioReady();
    document.addEventListener("tidioChatReady", onTidioReady);
    if (typeof window !== "undefined" && window.tidioChatApi) {
      try {
        if (visible) {
          window.tidioChatApi?.show?.();
          window.tidioChatApi?.display?.(true);
        } else {
          window.tidioChatApi?.hide?.();
          window.tidioChatApi?.display?.(false);
        }
      } catch {
        /* ignore */
      }
    }
    return () => {
      document.removeEventListener("tidioChatReady", onTidioReady);
    };
  }, [visible]);

  if (pathname === "/checkout") return null;

  return (
    <>
      <Script
        id="tidio-chat-script"
        src={`//code.tidio.co/${TIDIO_PUBLIC_KEY}.js`}
        strategy="afterInteractive"
        onReady={handleTidioReady}
      />
      {/* Safely hide Tidio container only when on hero section to prevent blocking screen clicks */}
      {!visible && (
        <style>{`
          #tidio-chat, #tidio-chat-iframe {
            display: none !important;
            pointer-events: none !important;
          }
        `}</style>
      )}
    </>
  );
}
