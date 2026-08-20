"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Play a short film when the pointer rests on a card.
 *
 * The behaviour is deliberately unhurried: the pointer has to STAY for a beat
 * before anything loads. Sweeping across a grid of thirteen cards on the way to
 * something else should cost nothing, and starting a video the moment a cursor
 * clips the corner of a card is both noisy and expensive.
 *
 * Everything below exists because the naive version of this is a `setTimeout`
 * inside a card component, and that version has four bugs: it leaks the timer on
 * unmount, it fires on touch devices where "hover" is really a tap on the way to
 * a tap, it lets every card the pointer crossed start downloading at once, and
 * it swaps a half-loaded <video> in front of a perfectly good photograph.
 */

/** How long the pointer must stay before anything is fetched. */
const HOVER_DELAY_MS = 2000;

/**
 * The card currently playing, if any.
 *
 * Module scope on purpose: this is a property of the PAGE, not of any one card.
 * A shopper dragging the pointer across the grid would otherwise leave a trail
 * of cards all playing at once, each pulling its own file. Starting one stops
 * whichever was playing before, so at most one is ever live.
 */
let currentlyPlaying = null;

export function useHoverVideo({ src, delay = HOVER_DELAY_MS } = {}) {
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  /** True only once the video has frames to show — never merely "requested". */
  const [playing, setPlaying] = useState(false);
  /** A file that failed once is not retried; the card keeps its photograph. */
  const [failed, setFailed] = useState(false);
  /**
   * Does this pointer actually hover?
   *
   * Resolved in an effect rather than during render: the server has no
   * `window`, and guessing would make the first client render disagree with the
   * server's. Starts false, so a touch device that never re-renders simply
   * never arms — which is the correct behaviour there anyway.
   */
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    /*
     * `pointer: fine` as well as `hover: hover`. A tablet with a trackpad
     * attached reports hover but a stylus does not, and phones in desktop-mode
     * emulation report hover while still delivering taps.
     */
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setCanHover(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /** Stop and rewind. Safe to call at any point in the lifecycle. */
  const stop = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = null;
    if (currentlyPlaying === stop) currentlyPlaying = null;

    const el = videoRef.current;
    if (el) {
      el.pause();
      // Rewind so the next hover starts at the beginning rather than resuming
      // wherever the pointer happened to leave.
      try {
        el.currentTime = 0;
      } catch {
        // Safari throws on seeking a video with no loaded metadata. Nothing to
        // rewind in that case.
      }
    }
    setPlaying(false);
  }, []);

  const start = useCallback(() => {
    if (!canHover || !src || failed) return;

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const el = videoRef.current;
      if (!el) return;

      // Whatever was playing yields first, so only one file is ever in flight.
      if (currentlyPlaying && currentlyPlaying !== stop) currentlyPlaying();
      currentlyPlaying = stop;

      /*
       * The source is attached HERE, not in the markup.
       *
       * With `src` on the element the browser may fetch it early regardless of
       * `preload="none"`, and these files are megabytes each. Attaching on the
       * timer means a card the pointer passed over costs exactly zero bytes.
       */
      if (!el.getAttribute("src")) el.setAttribute("src", src);

      const attempt = el.play();
      // Autoplay can be refused (a policy, a low-power mode, a decode failure).
      // A refusal is not an error worth surfacing — the photograph stays.
      if (attempt?.catch) attempt.catch(() => setPlaying(false));
    }, delay);
  }, [canHover, src, failed, delay, stop]);

  // Unmount cleanup. Without this, navigating away mid-hover leaves a timer
  // holding a reference to a card that no longer exists, and — worse — leaves
  // this card registered as the page's active video forever.
  useEffect(() => stop, [stop]);

  return {
    videoRef,
    /** True only when frames are actually on screen. Drives the crossfade. */
    playing,
    canHover,
    onEnter: start,
    onLeave: stop,
    /** Spread onto the <video>. */
    videoProps: {
      ref: videoRef,
      muted: true,
      loop: true,
      playsInline: true,
      preload: "none",
      /*
       * `playing` fires when frames are actually being presented, which is the
       * only honest moment to reveal the element. `canplay` is too early: it
       * means "enough buffered to begin", and revealing then shows a black
       * frame while the first picture decodes.
       */
      onPlaying: () => setPlaying(true),
      onError: () => {
        setFailed(true);
        setPlaying(false);
      },
      onStalled: () => setPlaying(false),
    },
  };
}

export { HOVER_DELAY_MS };
