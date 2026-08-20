/**
 * Hover-video behaviour.
 *
 * All of this is timing and cleanup, which is exactly the kind of thing that
 * looks correct in review and is wrong at runtime. The rules pinned here are the
 * ones a naive `setTimeout` in a card component gets wrong.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, cleanup } from "@testing-library/react";
import { useHoverVideo, HOVER_DELAY_MS } from "./useHoverVideo";

const SRC = "https://res.cloudinary.com/x/film.mp4";

/** A minimal card: one video, and the enter/leave handlers under test. */
function Card({ src = SRC, label = "card" }) {
  const hover = useHoverVideo({ src });
  return (
    <div data-testid={label} onMouseEnter={hover.onEnter} onMouseLeave={hover.onLeave}>
      <span data-testid={`${label}-playing`}>{String(hover.playing)}</span>
      <span data-testid={`${label}-canhover`}>{String(hover.canHover)}</span>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video {...hover.videoProps} data-testid={`${label}-video`} />
    </div>
  );
}

/*
 * mouseover / mouseout, not mouseenter / mouseleave.
 *
 * React synthesises onMouseEnter and onMouseLeave from the bubbling pair; a raw
 * `mouseenter` is not something it listens for, and dispatching both fires the
 * handler twice, which quietly changed what these tests were measuring.
 */
const enter = (label = "card") => act(() => {
  screen.getByTestId(label).dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
});
const leave = (label = "card") => act(() => {
  screen.getByTestId(label).dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
});
const advance = (ms) => act(() => { vi.advanceTimersByTime(ms); });
const src = (label = "card") => screen.getByTestId(`${label}-video`).getAttribute("src");

/** A pointer that hovers, or one that does not. */
const pointer = (hovers) => {
  window.matchMedia = (query) => ({
    matches: hovers, media: query, onchange: null,
    addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
  });
};

beforeEach(() => {
  vi.useFakeTimers();
  /*
   * Restored per test, not just stubbed once.
   *
   * `window.matchMedia` is a plain assignment, so vi.restoreAllMocks() does not
   * put it back — the touch-device test below was leaking a non-hovering pointer
   * into every test that ran after it, which silently turned the
   * one-video-at-a-time assertion into a test of nothing.
   */
  pointer(true);
  HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
  HTMLMediaElement.prototype.pause = vi.fn();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("hover delay", () => {
  it("is two seconds", () => {
    expect(HOVER_DELAY_MS).toBe(2000);
  });

  it("loads nothing before the delay elapses", () => {
    render(<Card />);
    enter();
    advance(HOVER_DELAY_MS - 1);
    // No src attached means not a single byte requested.
    expect(src()).toBeNull();
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });

  it("plays once the pointer has stayed", () => {
    render(<Card />);
    enter();
    advance(HOVER_DELAY_MS);
    expect(src()).toBe(SRC);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
  });

  it("cancels when the pointer leaves first", () => {
    render(<Card />);
    enter();
    advance(HOVER_DELAY_MS - 200);
    leave();
    advance(5000);
    expect(src()).toBeNull();
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });

  it("does not stack timers when the pointer re-enters", () => {
    render(<Card />);
    enter();
    advance(500);
    enter();
    advance(HOVER_DELAY_MS);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
  });
});

describe("what the shopper sees", () => {
  it("keeps the photograph until frames are genuinely on screen", () => {
    render(<Card />);
    enter();
    advance(HOVER_DELAY_MS);
    // play() was called, but nothing has been presented yet.
    expect(screen.getByTestId("card-playing").textContent).toBe("false");

    act(() => {
      screen.getByTestId("card-video").dispatchEvent(new Event("playing"));
    });
    expect(screen.getByTestId("card-playing").textContent).toBe("true");
  });

  it("falls back to the photograph when the file fails", () => {
    render(<Card />);
    enter();
    advance(HOVER_DELAY_MS);
    act(() => {
      screen.getByTestId("card-video").dispatchEvent(new Event("playing"));
      screen.getByTestId("card-video").dispatchEvent(new Event("error"));
    });
    expect(screen.getByTestId("card-playing").textContent).toBe("false");
  });

  it("does not retry a file that already failed", () => {
    render(<Card />);
    enter();
    advance(HOVER_DELAY_MS);
    act(() => { screen.getByTestId("card-video").dispatchEvent(new Event("error")); });
    leave();

    HTMLMediaElement.prototype.play.mockClear();
    enter();
    advance(HOVER_DELAY_MS);
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });

  it("falls back when the browser refuses autoplay", async () => {
    HTMLMediaElement.prototype.play = vi.fn(() => Promise.reject(new Error("NotAllowedError")));
    render(<Card />);
    enter();
    advance(HOVER_DELAY_MS);
    await act(async () => {});
    expect(screen.getByTestId("card-playing").textContent).toBe("false");
  });

  it("rewinds on leave, so the next hover starts at the beginning", () => {
    render(<Card />);
    enter();
    advance(HOVER_DELAY_MS);
    const el = screen.getByTestId("card-video");
    act(() => { el.dispatchEvent(new Event("playing")); });
    leave();
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    expect(el.currentTime).toBe(0);
  });
});

describe("touch devices", () => {
  it("never arm the hover film", () => {
    pointer(false);

    render(<Card />);
    expect(screen.getByTestId("card-canhover").textContent).toBe("false");
    enter();
    advance(10_000);
    expect(src()).toBeNull();
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });
});

describe("across the grid", () => {
  it("only one card plays at a time", () => {
    render(
      <>
        <Card label="a" src="https://res.cloudinary.com/x/a.mp4" />
        <Card label="b" src="https://res.cloudinary.com/x/b.mp4" />
      </>,
    );

    enter("a");
    advance(HOVER_DELAY_MS);
    act(() => { screen.getByTestId("a-video").dispatchEvent(new Event("playing")); });
    expect(screen.getByTestId("a-playing").textContent).toBe("true");

    // Without leaving A — a pointer moving straight from one card to the next.
    enter("b");
    advance(HOVER_DELAY_MS);
    expect(screen.getByTestId("a-playing").textContent).toBe("false");
  });

  it("a pointer sweeping the grid downloads nothing", () => {
    render(
      <>
        <Card label="a" src="https://res.cloudinary.com/x/a.mp4" />
        <Card label="b" src="https://res.cloudinary.com/x/b.mp4" />
        <Card label="c" src="https://res.cloudinary.com/x/c.mp4" />
      </>,
    );

    for (const label of ["a", "b", "c"]) {
      enter(label);
      advance(150);
      leave(label);
    }
    advance(10_000);

    for (const label of ["a", "b", "c"]) expect(src(label)).toBeNull();
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });
});

describe("cleanup", () => {
  it("clears a pending timer when the card unmounts", () => {
    const { unmount } = render(<Card />);
    enter();
    advance(HOVER_DELAY_MS - 100);
    unmount();
    advance(10_000);
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });

  it("does not hold the page hostage after unmounting mid-play", () => {
    const { unmount } = render(<Card label="a" src="https://res.cloudinary.com/x/a.mp4" />);
    enter("a");
    advance(HOVER_DELAY_MS);
    act(() => { screen.getByTestId("a-video").dispatchEvent(new Event("playing")); });
    unmount();

    // A second card must still be able to claim the page's single video slot.
    render(<Card label="b" src="https://res.cloudinary.com/x/b.mp4" />);
    enter("b");
    advance(HOVER_DELAY_MS);
    act(() => { screen.getByTestId("b-video").dispatchEvent(new Event("playing")); });
    expect(screen.getByTestId("b-playing").textContent).toBe("true");
  });
});

describe("no film", () => {
  it("does nothing at all", () => {
    render(<Card src={null} />);
    enter();
    advance(10_000);
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });
});
