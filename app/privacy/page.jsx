import PolicyPage, { PolicySection } from "@/components/PolicyPage";
import { COMPANY } from "@/lib/company";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How Zewa Feeds collects, uses and protects your personal data, who processes it for us, and the rights you have over it.",
  alternates: { canonical: "/privacy" },
};

/*
 * Rewritten 11 Nov 2026 after the close-out review found the old text out of
 * date: it said cookies were only for cart and session (GA4 sets analytics
 * cookies), named no processors, and said no marketing email was sent.
 *
 * KEEP IT TRUE. When a service that touches customer data is added or
 * removed (hosting, email, analytics, chat, payments), update "Who processes
 * your data" and the date above. The CSP in lib/securityHeaders.mjs lists
 * the same third parties and is a good cross-check.
 */

const strong = "text-white/75";
const link = "text-primary hover:underline";

const PROCESSORS = [
  ["Razorpay", "Takes card, UPI and net-banking payments. We never see or store your full card number.", "India"],
  ["Our delivery partners", "Receive your name, address and phone number to deliver your parcel.", "India"],
  ["Supabase", "Hosts our database (orders, accounts, Zewa Seeds).", "Mumbai, India"],
  ["Render", "Runs our order and account systems.", "Singapore"],
  ["Vercel", "Hosts this website.", "Global network"],
  ["Zoho ZeptoMail", "Sends order, account and Zewa Seeds emails.", "India"],
  ["Mailchimp", "Sends the founder's letters and newsletters.", "United States"],
  ["Cloudinary", "Stores and serves product photos and videos.", "Global network"],
  ["Tidio", "Runs the live-chat bubble. Messages, and any name or email you type into the chat, go to Tidio.", "European Union"],
  ["Google Analytics", "Measures which pages are visited. Only if you accept analytics cookies.", "Global"],
  ["Sentry", "Receives technical error reports from our servers so we can fix faults. Reports carry no names, emails or IP addresses.", "European Union"],
];

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      updated="11 November 2026"
      intro={`This policy explains what personal data ${COMPANY.legalName} ("Zewa Feeds", "we") collects when you use zewafeeds.com, why we collect it, who processes it for us, and what control you have over it.`}
    >
      <PolicySection heading="What we collect">
        <p>
          <strong className={strong}>Order information.</strong> Name, delivery address, email
          address and phone number, so we can process and deliver your order and contact you about it.
        </p>
        <p>
          <strong className={strong}>Payment information.</strong> Card and UPI details are entered
          directly with our payment gateway, Razorpay. We never see or store your full card number.
        </p>
        <p>
          <strong className={strong}>Account information.</strong> If you create an account: your
          name, email address, phone number, saved addresses and the password you choose (stored only
          as a one-way hash).
        </p>
        <p>
          <strong className={strong}>Zewa Seeds.</strong> The seeds you earn and spend, and the
          orders they came from.
        </p>
        <p>
          <strong className={strong}>Reviews and Find My Feed.</strong> Reviews you submit, and the
          answers you give in Find My Feed (species, tank and goals). Find My Feed answers are not
          linked to your name.
        </p>
        <p>
          <strong className={strong}>Chat messages.</strong> What you write in the live chat.
        </p>
        <p>
          <strong className={strong}>Usage data.</strong> If you accept analytics cookies: the pages
          you visit, roughly where you are (city level) and your device type, through Google Analytics.
        </p>
      </PolicySection>

      <PolicySection heading="Why we use it">
        <p>
          To fulfil orders, take payment, arrange delivery, run Zewa Seeds, answer enquiries, and
          meet our tax and accounting obligations. Order, delivery, account and Seeds emails are
          part of providing the service, so they are sent to every customer.
        </p>
        <p>
          We use analytics, only with your consent, to understand which pages are useful and
          improve the site.
        </p>
        <p>We do not sell your personal data, and we do not share it for other companies&apos; advertising.</p>
      </PolicySection>

      <PolicySection heading="Marketing email" id="marketing">
        <p>
          We send occasional marketing email: letters from our founder, new products and offers. You
          get them if you tick &ldquo;Send me the founder&apos;s letters&rdquo; when you sign up or
          check out. Customers who bought from us before 11 November 2026, when we started asking,
          also receive them.
        </p>
        <p>
          Every marketing email has an <strong className={strong}>unsubscribe</strong> link. One
          click stops them, with no sign-in needed. You can also write to{" "}
          <a href={`mailto:${COMPANY.email}`} className={link}>
            {COMPANY.email}
          </a>
          . Unsubscribing does not stop emails about your orders.
        </p>
      </PolicySection>

      <PolicySection heading="Who processes your data" id="processors">
        <p>
          We use these service providers. Each receives only what its task needs and processes it on
          our behalf.
        </p>
        <ul className="space-y-2">
          {PROCESSORS.map(([name, what, where]) => (
            <li key={name}>
              <strong className={strong}>{name}</strong> ({where}). {what}
            </li>
          ))}
        </ul>
        <p>
          Some of these providers process data outside India. We choose providers that protect it to
          a standard comparable with Indian law. We may also disclose data where the law requires it,
          or to establish or defend a legal claim.
        </p>
      </PolicySection>

      <PolicySection heading="Cookies and similar storage" id="cookies">
        <p>
          <strong className={strong}>Necessary.</strong> Your browser&apos;s local storage keeps your
          cart, your sign-in and your cookie choice. The shop cannot work without these, so they are
          always on.
        </p>
        <p>
          <strong className={strong}>Analytics (optional).</strong> Google Analytics sets the cookies{" "}
          <code>_ga</code> and <code>_ga_*</code> (kept for up to two years). They are set only after
          you choose &ldquo;Accept analytics&rdquo; in the cookie banner. Choose &ldquo;Necessary
          only&rdquo; and Google Analytics never loads.
        </p>
        <p>
          <strong className={strong}>Live chat.</strong> The Tidio chat bubble stores an identifier
          in your browser so a conversation continues across pages.
        </p>
        <p>
          You can change your choice at any time with <strong className={strong}>Cookie settings</strong>{" "}
          at the bottom of every page.
        </p>
      </PolicySection>

      <PolicySection heading="How long we keep it">
        <p>
          Order and invoice records are kept for as long as tax and company law requires (currently
          eight years). Account data is kept until you ask us to delete it. Analytics data is kept for
          the retention period set in our Google Analytics account, and contains no names or email
          addresses.
        </p>
      </PolicySection>

      <PolicySection heading="Your rights">
        <p>
          Under the Digital Personal Data Protection Act, 2023, you may ask for a summary of the data
          we hold about you, ask us to correct or complete it, or ask us to erase it where we are not
          legally required to keep it. You may withdraw any consent you gave, as easily as you gave
          it. Write to{" "}
          <a href={`mailto:${COMPANY.email}`} className={link}>
            {COMPANY.email}
          </a>{" "}
          and we will respond within 30 days.
        </p>
        <p>
          <strong className={strong}>Grievances.</strong> Our {COMPANY.grievanceOfficer.name} can be
          reached at{" "}
          <a href={`mailto:${COMPANY.grievanceOfficer.email}`} className={link}>
            {COMPANY.grievanceOfficer.email}
          </a>
          . We acknowledge complaints within {COMPANY.grievanceOfficer.responseWindow} and resolve
          them within {COMPANY.grievanceOfficer.resolutionWindow}.
        </p>
      </PolicySection>

      <PolicySection heading="Changes">
        <p>
          If we change this policy we will update the date at the top of this page. If a change
          affects how we use data you have already given us, we will tell you by email.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
