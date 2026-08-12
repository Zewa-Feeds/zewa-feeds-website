import PolicyPage, { PolicySection } from "@/components/PolicyPage";
import { COMPANY } from "@/lib/company";

export const metadata = {
  title: "Returns & Refunds",
  description:
    "When you can return a Zewa Feeds order, how to raise a claim, and how refunds are processed.",
  alternates: { canonical: "/returns" },
};

/*
 * Food products are consumable, so this is deliberately narrower than a general
 * goods returns policy: damaged, incorrect and defective items only. The
 * E-Commerce Rules require the policy to be published and unambiguous, not that
 * it offer open-ended change-of-mind returns on perishables.
 */
export default function ReturnsPage() {
  return (
    <PolicyPage
      title="Returns & Refunds"
      updated="9 August 2026"
      intro="Fish feed is a consumable product, so returns are limited to items that arrive damaged, incorrect or defective. This page explains how to claim and what to expect."
    >
      <PolicySection heading="What we accept">
        <p>
          <strong className="text-white/75">Damaged in transit.</strong> Packaging
          torn, crushed or wet on arrival.
        </p>
        <p>
          <strong className="text-white/75">Wrong item sent.</strong> You received
          a different product or pack size to the one ordered.
        </p>
        <p>
          <strong className="text-white/75">Defective product.</strong> Contents
          spoiled, contaminated or outside their best-before date on arrival.
        </p>
      </PolicySection>

      <PolicySection heading="What we cannot accept">
        <p>
          Opened packs, unless the contents were defective. Change of mind once a
          consumable food product has been dispatched. Claims raised more than 7
          days after delivery.
        </p>
      </PolicySection>

      <PolicySection heading="How to raise a claim">
        <p>
          Email{" "}
          <a href={`mailto:${COMPANY.email}`} className="text-primary hover:underline">
            {COMPANY.email}
          </a>{" "}
          within <strong className="text-white/75">7 days of delivery</strong> with
          your order number and photographs of the item and its packaging.
        </p>
        <p>
          Photographs matter: for transit damage they are usually all we need to
          approve a claim without asking you to return anything.
        </p>
      </PolicySection>

      <PolicySection heading="Refunds and replacements">
        <p>
          Approved claims are resolved by replacement or refund, whichever you
          prefer. Refunds are issued to the original payment method within{" "}
          <strong className="text-white/75">5–7 business days</strong> of approval.
          Your bank may take a further few days to show it.
        </p>
        <p>
          Where an order is cancelled before dispatch, the full amount including
          any delivery charge is refunded.
        </p>
      </PolicySection>

      <PolicySection heading="Cancellations">
        <p>
          Orders can be cancelled free of charge any time before dispatch. Contact
          us as soon as possible — once a parcel is with the courier we cannot
          recall it.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
