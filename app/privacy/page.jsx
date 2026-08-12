import PolicyPage, { PolicySection } from "@/components/PolicyPage";
import { COMPANY } from "@/lib/company";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How Zewa Feeds collects, uses and protects your personal data, and the rights you have over it.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      updated="9 August 2026"
      intro={`This policy explains what personal data ${COMPANY.legalName} collects when you use zewafeeds.com, why we collect it, and what control you have over it.`}
    >
      <PolicySection heading="What we collect">
        <p>
          <strong className="text-white/75">Order information.</strong> Name,
          delivery address, email address and phone number, so we can process and
          deliver your order and contact you about it.
        </p>
        <p>
          <strong className="text-white/75">Payment information.</strong> Card and
          UPI details are entered directly with our payment gateway, Razorpay. We
          never see or store your full card number.
        </p>
        <p>
          <strong className="text-white/75">Account information.</strong> If you
          create an account, the email address and password you choose.
        </p>
        <p>
          <strong className="text-white/75">Usage data.</strong> Pages visited and
          basic device information, used to keep the site working and improve it.
        </p>
      </PolicySection>

      <PolicySection heading="Why we use it">
        <p>
          To fulfil orders, take payment, arrange delivery, respond to enquiries,
          and meet our tax and accounting obligations. We send order-related email
          because it is necessary to complete your purchase.
        </p>
        <p>
          We do not sell your personal data, and we do not send marketing email
          unless you have asked us to.
        </p>
      </PolicySection>

      <PolicySection heading="Who we share it with">
        <p>
          Only with the parties needed to complete your order: our payment gateway
          (Razorpay), our delivery partners, and our email provider. Each receives
          only what that task requires.
        </p>
        <p>
          We may disclose data where the law requires it, or to establish or defend
          a legal claim.
        </p>
      </PolicySection>

      <PolicySection heading="How long we keep it">
        <p>
          Order records are retained for as long as tax and company law requires.
          Account data is kept until you ask us to delete it.
        </p>
      </PolicySection>

      <PolicySection heading="Your rights">
        <p>
          You may ask for a copy of the data we hold about you, ask us to correct
          it, or ask us to delete it where we are not legally required to keep it.
          Write to{" "}
          <a href={`mailto:${COMPANY.email}`} className="text-primary hover:underline">
            {COMPANY.email}
          </a>{" "}
          and we will respond within 30 days.
        </p>
      </PolicySection>

      <PolicySection heading="Cookies">
        <p>
          We use cookies to keep your cart and session working. These are necessary
          for the site to function and cannot be switched off without breaking
          checkout.
        </p>
      </PolicySection>

      <PolicySection heading="Changes">
        <p>
          If we change this policy we will update the date at the top of this page.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
