"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { reviews as reviewsApi, ApiError } from "@/lib/api";

/**
 * Landing page for the star links in the Seeds-earned email.
 *
 * The rating is recorded HERE, from the browser, rather than by the link itself:
 * mail security scanners fetch every link in a message, so a link that wrote on
 * GET would cast five ratings per email. Scanners do not run this page's script.
 *
 * The star the customer tapped is saved as soon as the page loads; the note is
 * optional and can be added or changed afterwards.
 */
function ReviewContent() {
  const params = useSearchParams();
  const token = params.get("t") || "";
  const tapped = Number(params.get("r"));

  const [view, setView] = useState(null);
  const [status, setStatus] = useState(token ? "loading" : "invalid");
  const [error, setError] = useState(token ? "" : "This rating link is missing or incomplete.");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const started = useRef(false);

  const fail = (err) => {
    if (err instanceof ApiError && err.code === "TOKEN_EXPIRED") {
      setError("This rating link has expired. You can still leave a review on the product page.");
    } else if (err instanceof ApiError && err.status === 409) {
      setError(err.message);
    } else if (err instanceof ApiError && (err.status === 401 || err.status === 404)) {
      setError("This rating link isn't valid any more.");
    } else {
      setError("We couldn't save your rating just now. Please try again in a moment.");
    }
    setStatus("error");
  };

  // Load, recording the tapped star straight away when there is one.
  useEffect(() => {
    if (!token || started.current) return;
    started.current = true;
    (async () => {
      try {
        const data =
          tapped >= 1 && tapped <= 5
            ? await reviewsApi.rateFromEmail({ token, rating: tapped })
            : await reviewsApi.emailLink(token);
        setView(data);
        setRating(data.rating ?? 0);
        setNote(data.body ?? "");
        setStatus("ready");
      } catch (err) {
        fail(err);
      }
    })();
  }, [token, tapped]);

  const save = useCallback(
    async (nextRating, body) => {
      setSaving(true);
      setError("");
      try {
        const data = await reviewsApi.rateFromEmail({ token, rating: nextRating, body });
        setView(data);
        setRating(data.rating ?? nextRating);
        return true;
      } catch (err) {
        if (err instanceof ApiError && (err.status === 400 || err.status === 422)) {
          setError(err.message);
          return false;
        }
        fail(err);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [token],
  );

  const pickStar = (n) => {
    if (saving || n === rating) return;
    setRating(n);
    setNoteSaved(false);
    void save(n);
  };

  const submitNote = async (e) => {
    e.preventDefault();
    if (rating < 1) return;
    if (await save(rating, note.trim())) setNoteSaved(true);
  };

  if (status === "loading") {
    return <p className="py-24 text-center text-[14px] text-white/50 font-[Montserrat]">Saving your rating…</p>;
  }

  if (status === "invalid" || status === "error") {
    return (
      <div className="mx-auto max-w-[520px] py-20 text-center">
        <h1 className="mb-4 font-[Playfair_Display] text-[28px] text-white">Rate your order</h1>
        <p className="mb-8 text-[14px] leading-relaxed text-white/55 font-[Montserrat]">{error}</p>
        <a
          href={view?.productSlug ? `/products/${view.productSlug}` : "/products"}
          className="inline-block rounded-full border border-primary/40 px-7 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-primary font-[Montserrat] transition-colors hover:bg-primary/10"
        >
          Browse products
        </a>
      </div>
    );
  }

  const shown = hovered || rating;

  return (
    <div className="mx-auto max-w-[560px] py-12 sm:py-16">
      <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-6 sm:p-9">
        <div className="mb-7 flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/8 bg-white/5">
            {view.imageUrl && (
              <Image src={view.imageUrl} alt={view.productName} fill sizes="64px" className="object-cover" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35 font-[Montserrat]">
              Order {view.orderNo}
            </p>
            <p className="truncate text-[16px] font-semibold text-white font-[Montserrat]">{view.productName}</p>
          </div>
        </div>

        <h1 className="mb-2 font-[Playfair_Display] text-[26px] leading-tight text-white sm:text-[30px]">
          {rating > 0 ? `Thank you, ${view.firstName}!` : `How did it go, ${view.firstName}?`}
        </h1>
        <p className="mb-6 text-[14px] text-white/55 font-[Montserrat]">
          {rating > 0
            ? "Your rating is saved. Tap a different star to change it."
            : "Tap a star to rate it."}
        </p>

        <div className="mb-8 flex gap-1.5" onMouseLeave={() => setHovered(0)} role="radiogroup" aria-label="Your rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} star${n === 1 ? "" : "s"}`}
              onClick={() => pickStar(n)}
              onMouseEnter={() => setHovered(n)}
              disabled={saving}
              className="p-0.5 disabled:cursor-wait"
            >
              <svg viewBox="0 0 20 20" className="h-10 w-10 transition-colors duration-150"
                fill={n <= shown ? "#f5b942" : "rgba(255,255,255,0.14)"}>
                <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
              </svg>
            </button>
          ))}
        </div>

        <form onSubmit={submitNote} className="flex flex-col gap-3">
          <label htmlFor="review-note" className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/40 font-[Montserrat]">
            Tell us more <span className="font-normal normal-case tracking-normal text-white/25">Optional</span>
          </label>
          <textarea
            id="review-note"
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setNoteSaved(false);
            }}
            rows={4}
            maxLength={2000}
            placeholder="How did your fish take to it?"
            className="w-full resize-none rounded-xl border border-white/8 bg-[#0e1828] px-4 py-3 text-[14px] text-[#b8c4d4] placeholder-white/20 font-[Montserrat] transition-all duration-200 focus:border-primary/40 focus:bg-[#101e30] focus:outline-none"
          />
          {error && <p className="text-[12px] text-red-300 font-[Montserrat]">{error}</p>}
          {noteSaved && (
            <p className="text-[12px] text-primary font-[Montserrat]">
              Thanks — your note is saved and will appear once it has been checked.
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={saving || rating < 1 || !note.trim()}
              className="rounded-full bg-primary px-7 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#00382d] font-[Montserrat] transition-all duration-200 hover:bg-primary/85 disabled:opacity-40"
            >
              {saving ? "Saving…" : "Send note"}
            </button>
            <a
              href={`/products/${view.productSlug}`}
              className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45 font-[Montserrat] transition-colors hover:text-white/80"
            >
              View product →
            </a>
          </div>
        </form>

        <p className="mt-7 text-[11px] text-white/25 font-[Montserrat]">
          Reviews are checked before they appear on the site.
        </p>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#05070d] px-5 pt-24 text-[#dde2f6] sm:px-8">
        <Suspense fallback={null}>
          <ReviewContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
