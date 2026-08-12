import PolicyPage, { PolicySection } from "@/components/PolicyPage";
import { COMPANY } from "@/lib/company";

export const metadata = {
  title: "Terms of Use",
  description:
    "The terms on which Zewa Feeds sells products through zewafeeds.com, including orders, pricing and liability.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms of Use"
      updated="9 August 2026"
      intro={`These terms govern your use of zewafeeds.com and any purchase you make from ${COMPANY.legalName}. By placing an order you accept them.`}
    >
      <PolicySection heading="Orders">
        <p>
          An order is an offer to buy. It is accepted when we confirm dispatch —
          not when payment is taken. If we cannot fulfil an order we will cancel it
          and refund you in full.
        </p>
        <p>
          We may decline or cancel an order where an item is out of stock, a price
          or description was published in error, or we suspect fraud.
        </p>
      </PolicySection>

      <PolicySection heading="Pricing">
        <p>
          Prices are in Indian Rupees and include GST unless stated otherwise.
          Where a struck-through price is shown, it is the printed maximum retail
          price for that pack.
        </p>
        <p>
          Delivery charges, where they apply, are shown at checkout before you pay.
        </p>
      </PolicySection>

      <PolicySection heading="Product information">
        <p>
          We describe our products as accurately as we can. Nutritional figures are
          based on laboratory analysis and are typical values; natural ingredients
          vary slightly between batches.
        </p>
        <p>
          Product photography is illustrative. Pack design may change.
        </p>
      </PolicySection>

      <PolicySection heading="Use of the products">
        <p>
          Our feeds are formulated for ornamental and aquaculture fish. Follow the
          feeding guidance on the pack. We are not liable for loss arising from
          overfeeding, unsuitable water conditions, or use outside the stated
          purpose.
        </p>
      </PolicySection>

      <PolicySection heading="Liability">
        <p>
          Nothing here limits liability that cannot be limited by law. Subject to
          that, our liability for any order is limited to the amount you paid for
          it.
        </p>
      </PolicySection>

      <PolicySection heading="Governing law">
        <p>
          These terms are governed by the laws of India. Disputes are subject to
          the courts of Thrissur, Kerala.
        </p>
      </PolicySection>

      <PolicySection heading="Contact">
        <p>
          Questions about these terms:{" "}
          <a href={`mailto:${COMPANY.email}`} className="text-primary hover:underline">
            {COMPANY.email}
          </a>
          .
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
