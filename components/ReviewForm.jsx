"use client";

import { useState } from "react";
import { reviews as reviewsApi } from "@/lib/api";

/**
 * Review submission (§9).
 *
 * The review goes into a moderation queue — it does NOT appear immediately. The
 * success message says so explicitly, because a customer who expects to see their
 * review and doesn't will assume it failed.
 *
 * `verifiedPurchase` is decided server-side from delivered order history; there is
 * deliberately no field for it here.
 */
export default function ReviewForm({ productSlug }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", body: "" });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle"); // idle | submitting | done
  const [message, setMessage] = useState("");

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});

    const local = {};
    if (rating < 1) local.rating = "Pick a star rating.";
    if (!form.email.trim()) local.email = "Required.";
    if (form.body.trim().length < 10) local.body = "Tell us a little more (10+ characters).";
    if (Object.keys(local).length) {
      setErrors(local);
      return;
    }

    setState("submitting");
    try {
      const result = await reviewsApi.submit({
        productSlug,
        rating,
        body: form.body.trim(),
        email: form.email.trim(),
        name: form.name.trim() || undefined,
      });
      setMessage(result.message);
      setState("done");
    } catch (err) {
      // Field errors from the backend map straight onto inputs.
      if (err.fields) setErrors(err.fields);
      else setErrors({ _root: err.message });
      setState("idle");
    }
  };

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-primary/25 bg-primary/6 p-6 text-center">
        <p className="text-[14px] text-white/80 font-[Montserrat]">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-white/8 bg-white/3 p-6 flex flex-col gap-5">
      <h3 className="font-[Playfair_Display] text-[20px] text-white">Write a review</h3>

      {errors._root && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-[12px] text-red-300 font-[Montserrat]">
          {errors._root}
        </p>
      )}

      {/* Rating */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/40 font-[Montserrat]">
          Your rating <span className="text-primary">*</span>
        </label>
        <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHovered(n)}
              className="p-0.5"
              aria-label={`${n} star${n === 1 ? "" : "s"}`}
            >
              <svg viewBox="0 0 20 20" className="w-6 h-6 transition-colors duration-150"
                fill={n <= (hovered || rating) ? "#44e5c2" : "rgba(255,255,255,0.15)"}>
                <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
              </svg>
            </button>
          ))}
        </div>
        {errors.rating && (
          <p className="text-[11px] text-red-400 font-[Montserrat]">{errors.rating}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name" hint="Optional" error={errors.name}>
          <Input value={form.name} onChange={set("name")} placeholder="Ravi K" />
        </Field>
        <Field label="Email" required error={errors.email}>
          <Input type="email" value={form.email} onChange={set("email")} placeholder="ravi@example.com" />
        </Field>
      </div>

      <Field label="Your review" required error={errors.body}>
        <textarea
          value={form.body}
          onChange={set("body")}
          rows={4}
          maxLength={2000}
          placeholder="How did your fish take to it?"
          className="w-full resize-none rounded-xl border border-white/8 bg-[#0e1828] px-4 py-3 text-[14px] text-[#b8c4d4] placeholder-white/15 font-[Montserrat] transition-all duration-200 focus:border-primary/40 focus:bg-[#101e30] focus:outline-none"
        />
      </Field>

      <p className="text-[11px] text-white/25 font-[Montserrat]">
        Reviews are checked before they appear on the site.
      </p>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="self-start rounded-full bg-primary px-7 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#00382d] font-[Montserrat] transition-all duration-200 hover:bg-primary/85 disabled:opacity-50"
      >
        {state === "submitting" ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}

function Field({ label, required, hint, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/40 font-[Montserrat]">
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
        {hint && <span className="ml-2 font-normal normal-case tracking-normal text-white/20">{hint}</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-400 font-[Montserrat]">{error}</p>}
    </div>
  );
}

function Input({ type = "text", ...props }) {
  return (
    <input
      type={type}
      {...props}
      className="w-full rounded-xl border border-white/8 bg-[#0e1828] px-4 py-3 text-[14px] text-[#b8c4d4] placeholder-white/15 font-[Montserrat] transition-all duration-200 focus:border-primary/40 focus:bg-[#101e30] focus:outline-none"
    />
  );
}
