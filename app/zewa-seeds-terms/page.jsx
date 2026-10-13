import Link from "next/link";
import PolicyPage, { PolicySection } from "@/components/PolicyPage";
import { COMPANY } from "@/lib/company";
import ZewaSeed from "@/components/ZewaSeed";

export const metadata = {
  title: "Zewa Seeds Terms & Conditions",
  description:
    "How Zewa Seeds are earned, unlocked, spent and expire, and what happens to them when an order is cancelled or returned.",
  alternates: { canonical: "/zewa-seeds-terms" },
};

/*
 * Every figure on this page comes from the ACTIVE loyalty rule version (v3,
 * LoyaltyRuleVersion in the backend) and from the behaviour of
 * Backend/src/modules/loyalty. If a rule is changed in the CMS
 * (Zewa Seeds → Rules), this page must be changed with it — nothing here reads
 * the rules at runtime.
 *
 *   earnGranularityPaise 5000, coinsPerStep 1  → 1 seed per full ₹50
 *   coinValuePaise 100                         → 1 seed = ₹1
 *   minRedemptionCoins 10                      → minimum 10 seeds per order
 *   maxRedemptionPct 90                        → up to 90% of eligible value
 *   returnWindowDays 7                         → unlock 7 days after delivery
 *   largeOrderThresholdPaise 2000000, +14 days → over ₹20,000: 21 days
 *   stuckShipmentDays 21 + stuckGraceDays 7    → failsafe unlock
 *   expiryDays 365                             → from the date earned
 *   reservationTtlMinutes 30                   → checkout hold
 *   graceLotDays 30                            → restored-after-expiry validity
 *   guestClaimDays 30                          → guest order claim window
 *   monthlyEarnCapCoins 1000                   → per calendar month
 *   maxNegativeBalance 50, rtoLimit 3 (90 days)
 */

const strong = "text-white/75";

export default function ZewaSeedsTermsPage() {
  return (
    <PolicyPage
      title="Zewa Seeds Terms & Conditions"
      icon={<ZewaSeed size={64} />}
      updated="4 October 2026"
      intro={`Zewa Seeds is the rewards programme run by ${COMPANY.legalName} on zewafeeds.com. These terms explain how seeds are earned and used, and apply alongside our Terms of Use. By earning or using Zewa Seeds you accept them.`}
    >
      <PolicySection heading="Who can take part">
        <p>
          Zewa Seeds are available to customers with a zewafeeds.com account.
          Seeds are earned and spent only while you are signed in. Orders placed
          as a guest do not earn seeds at the time, but can be claimed later (see
          &ldquo;Guest orders&rdquo; below).
        </p>
        <p>
          Accounts belonging to Zewa Feeds staff do not earn seeds automatically
          on their orders.
        </p>
      </PolicySection>

      <PolicySection heading="Earning seeds">
        <p>
          You earn <strong className={strong}>1 Zewa Seed for every full ₹50</strong>{" "}
          of eligible product value on an order — the same as 2 seeds for every
          ₹100. Part-amounts below ₹50 do not earn a seed, so an order with less
          than ₹50 of eligible product value earns nothing.
        </p>
        <p>
          Eligible product value is what you actually pay for the products,
          excluding GST, after any coupon or promotional discount and after any
          seeds you use on that order. Shipping, cash-on-delivery and other
          charges never earn seeds, and you do not earn seeds on the part of an
          order paid for with seeds.
        </p>
        <p>
          Some products may be excluded from earning or from redemption.
        </p>
        <p>
          You can earn up to <strong className={strong}>1,000 seeds per calendar month</strong>.
          An order that would take you past this limit earns only the seeds up to
          it. We may agree a different limit with individual customers, such as
          trade buyers.
        </p>
      </PolicySection>

      <PolicySection heading="When seeds become usable">
        <p>
          Seeds are recorded as pending when your order is paid (online payment)
          or placed (cash on delivery). They{" "}
          <strong className={strong}>unlock 7 days after your order is delivered</strong>,
          once the return window has closed. Pending seeds cannot be spent.
        </p>
        <p>
          For orders with more than ₹20,000 of eligible product value, seeds unlock
          21 days after delivery.
        </p>
        <p>
          If an order is shipped but we receive no delivery update from the
          courier, it is reviewed after 21 days, and any pending seeds on it unlock
          7 days after that.
        </p>
      </PolicySection>

      <PolicySection heading="Using seeds">
        <p>
          <strong className={strong}>1 Zewa Seed = ₹1 off</strong> the amount you
          pay. You can use seeds at checkout on online-payment and cash-on-delivery
          orders.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>You must use at least 10 seeds on an order.</li>
          <li>
            Seeds can cover up to 90% of the eligible product value of an order.
            The rest of the order, including shipping and any other charges, is
            paid by your chosen payment method.
          </li>
          <li>
            Coupons are applied first and seeds second. Some promotional coupons
            cannot be combined with seeds; while one of these is applied, the
            option to use seeds is not shown at checkout.
          </li>
          <li>
            When you apply seeds at checkout they are held for 30 minutes. If the
            order is not completed in that time, they are released back to your
            balance.
          </li>
          <li>Seeds closest to their expiry date are always used first.</li>
          <li>Seeds cannot be used while your balance is negative.</li>
        </ul>
      </PolicySection>

      <PolicySection heading="Expiry">
        <p>
          Seeds <strong className={strong}>expire 12 months after the date they are earned</strong>{" "}
          — the date your order was paid or placed, not the date the seeds
          unlocked. Expired seeds are removed from your balance and cannot be
          reinstated. Seeds expiring soon are shown in your account under Zewa
          Seeds.
        </p>
        <p>
          Seeds already applied to an order you are checking out are not removed
          by expiry while that order is being completed.
        </p>
      </PolicySection>

      <PolicySection heading="Cancellations, returns and refunds">
        <p>
          Your seed balance always ends up as if you had placed the order in its
          final form.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className={strong}>Cancelled or undelivered orders:</strong>{" "}
            pending seeds on the order are cancelled, and any seeds you used on it
            are returned to your balance.
          </li>
          <li>
            <strong className={strong}>Returns and refunds:</strong> seeds earned
            on the returned products are removed, and seeds you used on the
            returned products are returned to your balance.
          </li>
          <li>
            Seeds are always returned as seeds, never as cash. A cash refund covers
            only the amount you paid by your payment method.
          </li>
          <li>
            Returned seeds keep their original expiry date. If that date has
            already passed, they are given a new expiry 30 days from the date they
            are returned.
          </li>
          <li>
            If seeds earned on a returned order have already been spent, your
            balance may go below zero. Seeds you earn later make up the shortfall
            first, and you cannot use seeds until your balance is back above zero.
            Where a shortfall is larger than 50 seeds, we will review the account.
          </li>
        </ul>
      </PolicySection>

      <PolicySection heading="Guest orders">
        <p>
          If you place an order as a guest, you can claim its seeds within{" "}
          <strong className={strong}>30 days of placing the order</strong> by
          creating an account, or signing in, with the same email address and
          verifying that email address. Each order can be claimed once.
        </p>
      </PolicySection>

      <PolicySection heading="Fair use">
        <p>
          Zewa Seeds are for genuine personal and trade purchases. If three or
          more orders on your account are refused at delivery or returned to us
          undelivered within 90 days, earning seeds is suspended on that account,
          and cash on delivery is unavailable on it until 90 days have passed since
          the first of those orders.
        </p>
        <p>
          We may freeze a Zewa Seeds balance while we look into suspected misuse,
          errors or fraud, and seeds cannot be used while a balance is frozen.
          Where we find misuse, we may remove seeds obtained through it or close
          the account&rsquo;s participation in the programme.
        </p>
      </PolicySection>

      <PolicySection heading="Bonus seeds">
        <p>
          We may award bonus seeds at our discretion, for example as a goodwill
          gesture. Bonus seeds can be used straight away and, unless we tell you
          otherwise when awarding them, expire 12 months after they are awarded.
        </p>
      </PolicySection>

      <PolicySection heading="What seeds are not">
        <p>
          Zewa Seeds are a loyalty reward, not money. They have no cash value,
          cannot be exchanged for cash, earn no interest, and cannot be
          transferred, sold or combined between accounts. Seeds are linked to your
          account and lapse if the account is closed.
        </p>
      </PolicySection>

      <PolicySection heading="Changes to the programme">
        <p>
          We may change these terms or the programme&rsquo;s rules, or end the
          programme, and will update this page when we do. The earning rules that
          apply to an order are the ones in force when it was placed. If we end
          the programme, we will give reasonable notice so you can use the seeds
          you hold.
        </p>
      </PolicySection>

      <PolicySection heading="Questions">
        <p>
          Your balance, pending seeds and full seed history are in your account
          under{" "}
          <Link href="/account/seeds" className="text-primary hover:underline">
            Zewa Seeds
          </Link>
          . For anything else, email{" "}
          <a href={`mailto:${COMPANY.email}`} className="text-primary hover:underline">
            {COMPANY.email}
          </a>{" "}
          with your order number.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
