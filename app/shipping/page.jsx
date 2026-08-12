import PolicyPage, { PolicySection } from "@/components/PolicyPage";
import { COMPANY } from "@/lib/company";

export const metadata = {
  title: "Shipping Policy",
  description:
    "Delivery timelines and dispatch information for Zewa Feeds orders across India.",
  alternates: { canonical: "/shipping" },
};

/*
 * NO CHARGES SECTION HERE, deliberately.
 *
 * It previously published fixed rates (free above ₹999, ₹60 below). Those are
 * not settled, and a policy page that contradicts what checkout actually
 * charges is worse than one that stays quiet: checkout shows the real figure
 * before payment, which is what the E-Commerce Rules require.
 *
 * Timelines below do match CMS → Settings → Shipping. If those change there,
 * update this page too.
 */
export default function ShippingPage() {
  return (
    <PolicyPage
      title="Shipping Policy"
      updated="9 August 2026"
      intro="How and when we dispatch orders, and what to do if something goes wrong in transit."
    >
      <PolicySection heading="Where we deliver">
        <p>
          We deliver across India. We do not currently ship internationally.
        </p>
        <p>
          A small number of PIN codes are not serviceable by our courier partners.
          If yours is one of them, checkout will tell you before you pay.
        </p>
      </PolicySection>

      <PolicySection heading="Dispatch and delivery time">
        <p>
          Orders are dispatched within 1–2 business days of payment confirmation.
          Delivery typically takes 3–5 business days across India, longer for
          remote PIN codes.
        </p>
        <p>
          Orders placed on a Sunday or public holiday are processed the next
          business day.
        </p>
      </PolicySection>

      <PolicySection heading="Tracking">
        <p>
          You will receive a tracking link by email once your order ships. You can
          also check status at any time on our{" "}
          <a href="/orders/track" className="text-primary hover:underline">
            order tracking page
          </a>{" "}
          using your order number and email address.
        </p>
      </PolicySection>

      <PolicySection heading="Damaged or missing deliveries">
        <p>
          If your parcel arrives damaged, photograph it before opening and contact
          us within 48 hours at{" "}
          <a href={`mailto:${COMPANY.email}`} className="text-primary hover:underline">
            {COMPANY.email}
          </a>
          . If tracking shows delivered but you have not received it, tell us
          within 3 days and we will raise it with the courier.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
