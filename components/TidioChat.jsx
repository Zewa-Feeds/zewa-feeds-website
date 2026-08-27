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

    const checkVisibility = () => {
      const heroEl = document.getElementById("hero");
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        // Hide while hero is prominently in view; reveal once user scrolls past hero
        const threshold = Math.max(heroEl.offsetHeight - 200, 200);
        if (window.scrollY > threshold || rect.bottom <= 200) {
          setVisible(true);
          return true;
        }
      } else if (window.scrollY > 200) {
        // Fallback for pages without #hero section
        setVisible(true);
        return true;
      }
      return false;
    };

    if (checkVisibility()) {
      try {
        window.tidioChatApi?.show?.();
        window.tidioChatApi?.display?.(true);
      } catch {
        /* ignore */
      }
      return;
    }

    let observer = null;
    const heroEl = document.getElementById("hero");
    if (typeof IntersectionObserver !== "undefined" && heroEl) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          // When hero leaves the top viewport
          if (!entry.isIntersecting || entry.boundingClientRect.bottom <= 200) {
            setVisible(true);
            try {
              window.tidioChatApi?.show?.();
              window.tidioChatApi?.display?.(true);
            } catch {
              /* ignore */
            }
            if (observer) observer.disconnect();
          }
        },
        { threshold: [0, 0.1, 0.2] }
      );
      observer.observe(heroEl);
    }

    const handleScroll = () => {
      if (checkVisibility()) {
        try {
          window.tidioChatApi?.show?.();
          window.tidioChatApi?.display?.(true);
        } catch {
          /* ignore */
        }
        if (observer) observer.disconnect();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
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
        strategy="lazyOnload"
        onReady={handleTidioReady}
      />
      {/* Global styling overlay ensuring smooth transition and hiding before scroll */}
      <style>{`
        #tidio-chat, #tidio-chat-iframe, div[id^="tidio-chat"] {
          opacity: ${visible ? "1" : "0"} !important;
          pointer-events: ${visible ? "auto" : "none"} !important;
          transform: ${visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.9)"} !important;
          transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
          transform-origin: bottom right !important;
        }
      `}</style>
    </>
  );
}
