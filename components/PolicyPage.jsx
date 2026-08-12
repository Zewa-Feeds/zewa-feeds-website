import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { COMPANY, COMPANY_ADDRESS_LINE } from "@/lib/company";

/**
 * Shared shell for the statutory policy pages.
 *
 * One layout so Privacy, Terms, Shipping, Returns and Contact cannot drift
 * apart, and so the seller-identity block required by the E-Commerce Rules
 * appears on all of them without being copy-pasted five times.
 *
 * The draft banner is deliberate and deliberately ugly: this copy has NOT been
 * through legal review, and it must be obvious to anyone who lands here — and
 * to whoever ships the site — that it still needs sign-off.
 */
export default function PolicyPage({ title, updated, intro, children }) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#06080f] pb-24 pt-32 text-[#dde2f6]">
        <div className="mx-auto max-w-[820px] px-6 sm:px-10">
          <div className="mb-8 rounded-xl border border-[#d4793a]/40 bg-[#d4793a]/10 px-4 py-3 text-[12.5px] leading-relaxed text-[#e8a86a]">
            <strong className="font-semibold">Draft — pending legal review.</strong>{" "}
            This page sets out the required structure and disclosures. The wording
            must be reviewed and approved before public launch.
          </div>

          <h1 className="font-[Playfair_Display] text-[34px] leading-tight text-white sm:text-[42px]">
            {title}
          </h1>
          {updated && (
            <p className="mt-3 text-[12.5px] text-white/35 font-[Montserrat]">
              Last updated: {updated}
            </p>
          )}
          {intro && (
            <p className="mt-5 text-[15px] leading-relaxed text-white/55 font-[Montserrat]">
              {intro}
            </p>
          )}

          <div className="policy-body mt-10 space-y-8">{children}</div>

          {/* Seller identity — required on every page under the E-Commerce Rules. */}
          <section className="mt-14 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="font-[Playfair_Display] text-[18px] text-white">
              Seller details
            </h2>
            <dl className="mt-4 space-y-2 text-[13px] leading-relaxed text-white/55 font-[Montserrat]">
              <div>
                <dt className="inline text-white/40">Legal entity: </dt>
                <dd className="inline">{COMPANY.legalName}</dd>
              </div>
              <div>
                <dt className="inline text-white/40">Registered address: </dt>
                <dd className="inline">{COMPANY_ADDRESS_LINE}</dd>
              </div>
              <div>
                <dt className="inline text-white/40">Country of origin: </dt>
                <dd className="inline">{COMPANY.countryOfOrigin}</dd>
              </div>
              <div>
                <dt className="inline text-white/40">Consumer care: </dt>
                <dd className="inline">
                  <a href={`mailto:${COMPANY.email}`} className="text-primary hover:underline">
                    {COMPANY.email}
                  </a>
                  {" · "}
                  <a href={COMPANY.phoneHref} className="text-primary hover:underline">
                    {COMPANY.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="inline text-white/40">Grievance Officer: </dt>
                <dd className="inline">
                  <a
                    href={`mailto:${COMPANY.grievanceOfficer.email}`}
                    className="text-primary hover:underline"
                  >
                    {COMPANY.grievanceOfficer.email}
                  </a>
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

/** Section heading + body, so each policy page reads consistently. */
export function PolicySection({ heading, children }) {
  return (
    <section>
      <h2 className="mb-3 font-[Playfair_Display] text-[20px] text-white">{heading}</h2>
      <div className="space-y-3 text-[14px] leading-[1.75] text-white/55 font-[Montserrat]">
        {children}
      </div>
    </section>
  );
}
