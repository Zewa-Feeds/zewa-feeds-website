import PolicyPage, { PolicySection } from "@/components/PolicyPage";
import { COMPANY, COMPANY_ADDRESS_LINE } from "@/lib/company";

export const metadata = {
  title: "Contact & Grievance Officer",
  description:
    "How to reach Zewa Feeds about an order, and how to escalate a complaint to our Grievance Officer.",
  alternates: { canonical: "/contact" },
};

/*
 * Rule 4(5) of the Consumer Protection (E-Commerce) Rules 2020 requires an
 * e-commerce entity to appoint a Grievance Officer and publish their name and
 * contact, acknowledge complaints within 48 hours, and resolve within a month.
 * The name is a placeholder until the appointment is confirmed.
 */
export default function ContactPage() {
  return (
    <PolicyPage
      title="Contact & Grievance Officer"
      updated="9 August 2026"
      intro="For anything about an order, delivery or product, start with consumer care. If we have not resolved it to your satisfaction, escalate to our Grievance Officer."
    >
      <PolicySection heading="Consumer care">
        <p>
          <strong className="text-white/75">Email: </strong>
          <a href={`mailto:${COMPANY.email}`} className="text-primary hover:underline">
            {COMPANY.email}
          </a>
        </p>
        <p>
          <strong className="text-white/75">Phone: </strong>
          <a href={COMPANY.phoneHref} className="text-primary hover:underline">
            {COMPANY.phone}
          </a>
        </p>
        <p>Monday to Saturday, 10:00 to 18:00 IST.</p>
        <p>
          Have your order number ready — it is in your confirmation email and on
          the{" "}
          <a href="/orders/track" className="text-primary hover:underline">
            tracking page
          </a>
          .
        </p>
      </PolicySection>

      <PolicySection heading="Grievance Officer">
        <p>
          Appointed under the Consumer Protection (E-Commerce) Rules 2020. If
          consumer care has not resolved your complaint, escalate it here.
        </p>
        <p>
          <strong className="text-white/75">Email: </strong>
          <a
            href={`mailto:${COMPANY.grievanceOfficer.email}`}
            className="text-primary hover:underline"
          >
            {COMPANY.grievanceOfficer.email}
          </a>
        </p>
        <p>
          <strong className="text-white/75">Postal: </strong>
          Grievance Officer, {COMPANY.legalName}, {COMPANY_ADDRESS_LINE}
        </p>
        <p>
          We acknowledge complaints within{" "}
          <strong className="text-white/75">{COMPANY.grievanceOfficer.responseWindow}</strong>{" "}
          and aim to resolve them within{" "}
          <strong className="text-white/75">{COMPANY.grievanceOfficer.resolutionWindow}</strong>.
        </p>
      </PolicySection>

      <PolicySection heading="Trade and distribution">
        <p>
          For dealership, bulk or hatchery supply enquiries, email{" "}
          <a href={`mailto:${COMPANY.email}`} className="text-primary hover:underline">
            {COMPANY.email}
          </a>{" "}
          with your business name and location.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
