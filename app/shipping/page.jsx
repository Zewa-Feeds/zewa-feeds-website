import PolicyPage, { PolicySection } from "@/components/PolicyPage";
import { COMPANY } from "@/lib/company";

export const metadata = {
  title: "Shipping Policy",
  description:
    "Delivery timelines, shipping charges and dispatch information for Zewa Feeds orders across India.",
  alternates: { canonical: "/shipping" },
};

/*
 * Figures match the live store settings (CMS → Settings → Shipping):
 * free above ₹999, ₹60 below, 3–5 business days. If those change in the CMS,
 * this page must be updated to match — a published policy that contradicts
 * what checkout charges is worse than no policy.
 */
export default function ShippingPage() {
  return (
    <PolicyPage
      title="Shipping Policy"
      updated="9 August 2026"
      intro="How and when we dispatch orders, what delivery costs, and what to do if something goes wrong in transit."
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

      <PolicySection heading="Charges">
        <p>
          <strong className="text-white/75">Free delivery</strong> on orders of
          ₹999 and above.
        </p>
        <p>
          <strong className="text-white/75">₹60 flat</strong> on orders below ₹999.
        </p>
        <p>The exact charge is shown at checkout before payment.</p>
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
          within 7 days and we will raise it with the courier.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
