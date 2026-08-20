/**
 * jsdom gaps the media code depends on.
 *
 * Neither of these is a workaround for a bug in the code under test: jsdom
 * genuinely has no media pipeline and no media-query engine, so a component that
 * asks either question gets `undefined` and throws. Stubbing them here keeps the
 * stubs out of the tests, where they would obscure what is being asserted.
 */
import { vi } from "vitest";

/**
 * Pointer capability, defaulting to a mouse.
 *
 * Tests that care about touch override `matchMedia` themselves. Defaulting to
 * "hover works" means a test that forgets to set it exercises the real path
 * rather than silently taking the do-nothing branch and passing for the wrong
 * reason.
 */
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: true,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}

/**
 * `play()` and `pause()` are unimplemented in jsdom and throw "Not implemented".
 *
 * `play()` resolves, matching a browser that accepted the request. Tests that
 * need a refusal replace it with a rejecting stub.
 */
if (!HTMLMediaElement.prototype.play?.mock) {
  HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
  HTMLMediaElement.prototype.pause = vi.fn();
}
