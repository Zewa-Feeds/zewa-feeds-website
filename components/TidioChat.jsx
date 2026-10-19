"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

export const TIDIO_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_TIDIO_PUBLIC_KEY || "bskymfizgyuqcwn3wpsiffd7i4zrhwrn";

/**
 * The launcher's colour. Tidio's own default is black, which disappears on the
 * site's near-black background; this is the site's primary teal, the colour of
 * every other call to action. Set through Tidio's API because the widget lives
 * in an iframe that page CSS cannot reach.
 */
export const TIDIO_BRAND_COLOR = "#44e5c2";

function applyBrandColor() {
  try {
    window.tidioChatApi?.setColorPalette?.(TIDIO_BRAND_COLOR);
  } catch {
    /* ignore — an older widget without the API keeps its dashboard colour */
  }
}

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
        // Hide while at top of hero; reveal once user scrolls down
        const isPastHero = window.scrollY > 150 || rect.bottom <= 250;
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
    applyBrandColor();
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
    applyBrandColor();
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
        src={`https://code.tidio.co/${TIDIO_PUBLIC_KEY}.js`}
        strategy="afterInteractive"
        onReady={handleTidioReady}
      />
      {/*
        Hide Tidio while the hero is on screen — but ONLY once mounted.

        Rendered on the server, this <style> lands directly in <body>. When the
        home page hits a hydration mismatch, React 19 re-renders on the client
        and leaves unrecognised <body> children alone (it tolerates nodes that
        extensions inject there) — so the server's copy was orphaned, and kept
        Tidio hidden on the home page forever, however far the visitor
        scrolled. Rendering it client-side only means there is no server copy to
        orphan.
      */}
      {mounted && !visible && (
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
