"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AuthShell from "@/components/account/AuthShell";
import { account as accountApi } from "@/lib/api";
import { COMPANY } from "@/lib/company";

/**
 * Landing page for the unsubscribe link in every marketing email.
 *
 * Unsubscribes on arrival: one click, no sign-in and no "are you sure". The
 * token in the link is signed by the API, so it can only unsubscribe the
 * address it was sent to. Order and delivery emails are unaffected.
 */
function UnsubscribeContent() {
  const token = useSearchParams().get("t");
  const [state, setState] = useState(token ? { status: "working" } : { status: "invalid" });

  useEffect(() => {
    if (!token) return;
    let live = true;
    accountApi
      .unsubscribe(token)
      .then((res) => live && setState({ status: "done", email: res?.email }))
      .catch(() => live && setState({ status: "invalid" }));
    return () => {
      live = false;
    };
  }, [token]);

  if (state.status === "working") {
    return (
      <AuthShell title="Unsubscribing…" subtitle="One moment.">
        <div className="py-10" />
      </AuthShell>
    );
  }

  if (state.status === "done") {
    return (
      <AuthShell title="You're unsubscribed" subtitle="You won't receive founder's letters or offers from us any more.">
        <div className="space-y-3 py-4 font-[Montserrat] text-[13.5px] leading-relaxed text-white/70">
          {state.email && (
            <p>
              <span className="text-white">{state.email}</span> has been removed from our marketing emails.
            </p>
          )}
          <p className="text-white/50">
            Emails about your orders, deliveries and Zewa Seeds will still reach you. To hear from us
            again, tick &ldquo;Send me the founder&apos;s letters&rdquo; next time you check out.
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="This link didn't work" subtitle="We couldn't confirm which address to unsubscribe.">
      <p className="py-4 font-[Montserrat] text-[13.5px] leading-relaxed text-white/70">
        Write to{" "}
        <a href={`mailto:${COMPANY.email}?subject=Unsubscribe`} className="text-primary hover:underline">
          {COMPANY.email}
        </a>{" "}
        with the subject &ldquo;Unsubscribe&rdquo; and we will remove you by hand.
      </p>
    </AuthShell>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#06080f]" />}>
      <UnsubscribeContent />
    </Suspense>
  );
}
