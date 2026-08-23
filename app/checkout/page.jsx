"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cartContext";
import { checkout as checkoutApi, settings as settingsApi, formatInr } from "@/lib/api";
import { pincodeMatchesState, likelyStateForPincode, INDIAN_STATES } from "@/lib/pincode";
import { useAuth, signInHref } from "@/lib/authContext";
import { account as accountApi } from "@/lib/api";
import SavedAddressPicker, { SaveAddressToggle } from "@/components/checkout/SavedAddressPicker";

import CheckoutBreadcrumbs from "@/components/checkout/CheckoutBreadcrumbs";
import { FloatingInput, FloatingSelect } from "@/components/checkout/FloatingInput";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import OrderSummaryCard from "@/components/checkout/OrderSummaryCard";
import { CARD, CARD_PAD, CARD_HEADER, STEP_CHIP, SECTION_TITLE, EASE, FOCUS_RING } from "@/components/checkout/tokens";

// Shared with the account address book so the two forms cannot drift apart.
const STATES = INDIAN_STATES;

const STORAGE_FORM_KEY = "zewa_checkout_form_v1";

export default function CheckoutPage() {
  const {
    items, subtotalPaise, discountPaise, shippingPaise, totalPaise,
    amountToFreeShippingPaise, coupon, issues, fulfillable, validating,
    validate, applyCoupon, clearCart, setQty, removeFromCart,
  } = useCart();

  const [config, setConfig] = useState(null);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", pincode: "", notes: "",
  });

  // Strict Online Payment (Razorpay) — No COD
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [step, setStep] = useState("form"); // form | paying | success | failed
  const [placed, setPlaced] = useState(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  /**
   * Why the payment did not go through, for the failure screen.
   *
   * `{ orderNo, reason }` — the order still exists and is payable, so the
   * screen offers a retry rather than sending the customer back to re-enter an
   * address they already filled in.
   */
  const [failure, setFailure] = useState(null);
  const [statusText, setStatusText] = useState("");
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [autoDetectedBadge, setAutoDetectedBadge] = useState("");

  /**
   * Signed-in shortcut.
   *
   * The cart is anonymous and stays that way, so signing in mid-checkout never
   * costs the customer their basket. All this does is save them retyping details
   * the account already holds.
   */
  const { customer, isAuthenticated, isLoading: authLoading } = useAuth();
  /** True once a prefill has run, so it cannot fight the customer's own edits. */
  const prefilled = useRef(false);

  /** The customer's address book, for the picker. Empty for guests. */
  const [savedAddresses, setSavedAddresses] = useState([]);
  /** An address id, or "new" when typing one in. */
  const [selectedAddressId, setSelectedAddressId] = useState("new");
  /** Ticked by default for guests — it costs them nothing and saves retyping. */
  const [saveAddress, setSaveAddress] = useState(true);

  const idempotencyKey = useRef(
    `chk-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  );

  /*
   * Current form values, readable from async callbacks.
   *
   * The pincode lookup resolves a few hundred ms after it is fired, by which
   * time the closure that started it holds stale values. Reading through a ref
   * avoids both that and re-creating the callback on every keystroke.
   */
  const formRef = useRef(form);
  formRef.current = form;

  /*
   * The city value the pincode lookup last wrote.
   *
   * Lets a corrected pincode replace a city we filled in, while leaving a
   * hand-typed city alone. Null once the customer edits the field themselves.
   */
  const autofilledCityRef = useRef(null);

  // Restore saved form state on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_FORM_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      /* ignore storage errors */
    }
  }, []);

  // Save form updates to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_FORM_KEY, JSON.stringify(form));
    } catch {
      /* ignore */
    }
  }, [form]);

  // Fetch payment config on mount
  useEffect(() => {
    settingsApi
      .public()
      .then((s) => {
        setConfig(s);
        setPaymentMethod("RAZORPAY");
      })
      .catch(() => {
        setConfig({ paymentMethods: { cod: false, razorpay: true } });
        setPaymentMethod("RAZORPAY");
      });
  }, []);

  // Preload Razorpay Checkout SDK script on checkout mount so it is warm in cache before user clicks Pay Online
  useEffect(() => {
    if (typeof window === "undefined" || window.Razorpay) return;
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);


  /*
   * Bring a checkout-level failure into view.
   *
   * The Razorpay modal closes and hands the page back at whatever scroll
   * position it had, which is rarely the top — so a declined payment could
   * render its banner entirely offscreen and look like nothing happened.
   */
  useEffect(() => {
    if (!errors._root) return;
    document
      .getElementById("checkout-root-error")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [errors._root]);

  /**
   * Prefill from the account, once.
   *
   * Runs only while the fields are still untouched: someone who has started
   * typing a different delivery address must not have it overwritten when their
   * profile finally loads. The default address is used when there is one,
   * otherwise just the name and email.
   */
  useEffect(() => {
    if (authLoading || !isAuthenticated || !customer || prefilled.current) return;
    prefilled.current = true;

    let cancelled = false;
    (async () => {
      let list = [];
      try {
        list = await accountApi.addresses();
      } catch {
        /* Address book unavailable — fall back to identity fields only. */
      }
      if (cancelled) return;

      const defaultAddress = list.find((a) => a.isDefault) ?? list[0] ?? null;
      setSavedAddresses(list);
      // Preselect the default so the common case is one fewer decision. With no
      // saved addresses the picker does not render and this stays on "new".
      if (defaultAddress) setSelectedAddressId(defaultAddress.id);

      setForm((f) => ({
        ...f,
        firstName: f.firstName || customer.firstName || "",
        lastName: f.lastName || customer.lastName || "",
        email: f.email || customer.email || "",
        phone: f.phone || defaultAddress?.phone || customer.phone || "",
        address: f.address || (defaultAddress
          ? [defaultAddress.line1, defaultAddress.line2].filter(Boolean).join(", ")
          : ""),
        city: f.city || defaultAddress?.city || "",
        state: f.state || defaultAddress?.state || "",
        pincode: f.pincode || defaultAddress?.pincode || "",
      }));
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated, customer]);

  /**
   * Apply a picked address to the form.
   *
   * The form stays the single source of truth for what gets submitted — the
   * picker only writes into it. That keeps one validation path and one payload
   * shape whether the address was chosen or typed.
   */
  const chooseAddress = (id) => {
    setSelectedAddressId(id);
    if (id === "new") {
      // Clear only the address fields; name, email and phone still apply.
      setForm((f) => ({ ...f, address: "", city: "", state: "", pincode: "" }));
      setAutoDetectedBadge("");
      return;
    }

    const a = savedAddresses.find((x) => x.id === id);
    if (!a) return;

    const [firstName, ...rest] = (a.name || "").trim().split(/\s+/);
    setForm((f) => ({
      ...f,
      firstName: firstName || f.firstName,
      lastName: rest.join(" ") || f.lastName,
      phone: a.phone || f.phone,
      address: [a.line1, a.line2].filter(Boolean).join(", "),
      city: a.city ?? "",
      state: a.state ?? "",
      pincode: a.pincode ?? "",
    }));
    // A stored address has already been through this form's validation.
    setErrors((e) => ({ ...e, address: "", city: "", state: "", pincode: "" }));
    setAutoDetectedBadge("");
  };

  // Re-price when state or email changes for GST tax calculation
  useEffect(() => {
    if (form.state) void validate({ state: form.state, email: form.email || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.state]);

  // Auto-detect City and State from 6-digit Pincode
  const handlePincodeLookup = useCallback(async (pin) => {
    if (pin.length !== 6) return;
    
    const localState = likelyStateForPincode(pin);
    if (localState && !formRef.current.state) {
      setForm((f) => ({ ...f, state: localState }));
      setAutoDetectedBadge(`Auto-detected: ${localState}`);
    }

    setPincodeLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        const apiDistrict = po.District;
        const apiState = po.State;

        /*
         * Overwrite a city WE filled in; never one the customer typed.
         *
         * `f.city || apiDistrict` was right when city was a dropdown, but now
         * that the pincode is the primary way the field gets populated, it left
         * a stale district behind whenever someone corrected their pincode
         * after the first lookup. Tracking what we autofilled lets a corrected
         * pincode fix the city while still protecting manual edits.
         */
        const cityNow = formRef.current.city;
        const cityWasAutofilled = !cityNow || cityNow === autofilledCityRef.current;
        const nextCity = cityWasAutofilled && apiDistrict ? apiDistrict : cityNow;
        autofilledCityRef.current = cityWasAutofilled ? nextCity : null;

        setForm((f) => ({
          ...f,
          city: nextCity || "",
          state: f.state || apiState || localState || "",
        }));

        setAutoDetectedBadge(`Auto-detected: ${apiDistrict || ""}, ${apiState || localState || ""}`);

        /*
         * Clear only what this response actually resolved.
         *
         * Blanket-clearing errors.pincode here used to wipe the PIN/state
         * mismatch error a few hundred ms after the local check raised it: the
         * customer saw a clean form, then an unexplained rejection at submit,
         * because the server enforces the same rule (checkout.service.ts §3b).
         * A successful lookup does not clear a mismatch — it CONFIRMS it, so
         * re-check against the state the customer will actually submit.
         */
        const current = formRef.current;
        const effectiveState = current.state || apiState || localState || "";
        const stillMismatched =
          Boolean(effectiveState) && !pincodeMatchesState(pin, effectiveState);

        setErrors((prev) => ({
          ...prev,
          ...(stillMismatched
            ? {
                pincode: `Pincode ${pin} belongs to ${
                  likelyStateForPincode(pin) || apiState
                }`,
              }
            : { pincode: undefined, state: undefined }),
          ...(current.city || apiDistrict ? { city: undefined } : {}),
        }));
      }
    } catch {
      /* fallback stays */
    } finally {
      setPincodeLoading(false);
    }
  }, []);

  const handleChange = (field) => (e) => {
    let val = e.target.value;

    if (field === "phone") {
      val = val.replace(/\D/g, "").slice(0, 10);
    } else if (field === "pincode") {
      val = val.replace(/\D/g, "").slice(0, 6);
      if (val.length === 6) {
        void handlePincodeLookup(val);
      } else {
        setAutoDetectedBadge("");
      }
    } else if (field === "firstName" || field === "lastName") {
      val = val.replace(/[^a-zA-Z\s'-]/g, "").slice(0, 50);
    } else if (field === "city") {
      val = val.replace(/[^a-zA-Z\s'.-]/g, "").slice(0, 50);
      // Hand-edited from here on — the pincode lookup must stop overwriting it.
      autofilledCityRef.current = null;
    } else if (field === "address") {
      val = val.slice(0, 200);
    } else if (field === "email") {
      val = val.trim().slice(0, 100);
    } else if (field === "notes") {
      val = val.slice(0, 1000);
    }

    setForm((f) => ({ ...f, [field]: val }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErr = validateSingleField(field, form[field]);
    if (fieldErr) {
      setErrors((prev) => ({ ...prev, [field]: fieldErr }));
    }
  };

  const validateSingleField = (field, val) => {
    const trimmed = String(val || "").trim();

    if (field === "firstName") {
      if (!trimmed) return "First name is required";
      if (trimmed.length < 2) return "Must be at least 2 letters";
    }
    if (field === "lastName") {
      if (!trimmed) return "Last name is required";
    }
    if (field === "email") {
      if (!trimmed) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Enter a valid email address (e.g. name@example.com)";
    }
    if (field === "phone") {
      if (!trimmed) return "Mobile number is required";
      if (trimmed.length !== 10) return "Mobile number must be exactly 10 digits";
      if (!/^[6-9]\d{9}$/.test(trimmed)) return "Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9";
    }
    if (field === "address") {
      if (!trimmed) return "Address is required";
      if (trimmed.length < 5) return "Please enter complete street address & house number";
    }
    if (field === "city") {
      if (!trimmed) return "City is required";
    }
    if (field === "state") {
      if (!trimmed) return "State selection is required";
      if (form.pincode && form.pincode.length === 6 && !pincodeMatchesState(form.pincode, trimmed)) {
        const expected = likelyStateForPincode(form.pincode);
        return expected ? `Pincode ${form.pincode} belongs to ${expected}` : "Selected state does not match pincode";
      }
    }
    if (field === "pincode") {
      if (!trimmed) return "Pincode is required";
      if (trimmed.length !== 6) return "Pincode must be exactly 6 digits";
      if (!/^\d{6}$/.test(trimmed)) return "Must be a valid 6-digit postal pincode";
      if (form.state && !pincodeMatchesState(trimmed, form.state)) {
        const expected = likelyStateForPincode(trimmed);
        return expected ? `Pincode belongs to ${expected}` : "Pincode does not match selected state";
      }
    }
    return null;
  };

  const validateForm = () => {
    const e = {};
    Object.keys(form).forEach((key) => {
      if (key !== "notes") {
        const err = validateSingleField(key, form[key]);
        if (err) e[key] = err;
      }
    });
    return e;
  };

  const submitCoupon = async (e) => {
    e.preventDefault();
    setCouponError("");
    const result = await applyCoupon(couponInput.trim().toUpperCase());
    const problem = result?.issues?.find((i) => i.sku === "__coupon__");
    if (problem) setCouponError(problem.message);
  };

  const resetScrollAndLock = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  };

  const unlockScroll = () => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  };

  // Cleanup scroll lock on unmount
  useEffect(() => {
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, []);

  /**
   * Wait for the webhook or backend to confirm the order paid.
   *
   * Only used when the outcome is in-flight or delayed — e.g. slow UPI or
   * webhook settling.
   *
   * Stops early on a terminal payment state instead of waiting out the clock.
   * Uses truthful status messages without fake countdowns or "checking with your bank".
   */
  const pollUntilPaid = async (orderNo, email, timeoutMs = 35_000) => {
    const started = Date.now();
    while (Date.now() - started < timeoutMs) {
      await new Promise((r) => setTimeout(r, 2500));
      const elapsed = Date.now() - started;
      try {
        const status = await checkoutApi.status(orderNo, email);
        if (status.paymentStatus === "PAID") return true;
        if (status.status === "CANCELLED" || status.paymentStatus === "FAILED") return false;
      } catch {
        /* transient network error — keep polling */
      }
      if (elapsed < 12_000) {
        setStatusText("Confirming your payment…");
      } else {
        setStatusText(
          "Payment confirmation is taking a little longer than usual. We're checking securely…",
        );
      }
    }
    return "pending";
  };

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (isSubmittingPayment || validating) return;

    const errs = validateForm();
    if (Object.keys(errs).length) {
      setErrors(errs);
      const allTouched = {};
      Object.keys(form).forEach((k) => (allTouched[k] = true));
      setTouched(allTouched);

      const firstErrorKey = Object.keys(errs)[0];
      const element = document.getElementById(firstErrorKey);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
      return;
    }

    setErrors({});
    setIsSubmittingPayment(true);
    setStatusText("Initializing secure checkout…");
    setStep("paying");
    resetScrollAndLock();

    try {
      const fresh = await validate({ state: form.state, email: form.email });
      const blocking = (fresh?.issues ?? []).filter((i) => i.sku !== "__coupon__");
      if (blocking.length > 0) {
        unlockScroll();
        setErrors({ _root: blocking[0].message });
        setIsSubmittingPayment(false);
        setStep("form");
        return;
      }

      const result = await checkoutApi.place(
        {
          lines: items.map((i) => ({ sku: i.sku, qty: i.qty })),
          email: form.email.trim(),
          phone: form.phone.replace(/\s/g, ""),
          shippingAddress: {
            name: `${form.firstName.trim()} ${form.lastName.trim()}`,
            phone: form.phone.replace(/\s/g, ""),
            line1: form.address.trim(),
            city: form.city.trim(),
            state: form.state,
            pincode: form.pincode.trim(),
          },
          paymentMethod: "RAZORPAY",
          couponCode: coupon?.code ?? undefined,
          customerNote: form.notes.trim() || undefined,
          // Only meaningful for a newly typed address; one picked from the book
          // is already saved, and the server dedupes anyway.
          saveAddress: selectedAddressId === "new" && saveAddress,
        },
        idempotencyKey.current,
      );

      setPlaced(result);

      if (!result.payment.required) {
        clearCart();
        sessionStorage.removeItem(STORAGE_FORM_KEY);
        unlockScroll();
        setIsSubmittingPayment(false);
        setStep("success");
        if (typeof window !== "undefined") window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        return;
      }

      if (result.payment.simulated) {
        setStatusText(
          `Test mode — payment confirms automatically in ${result.payment.autoConfirmInSeconds ?? 30}s…`,
        );
        const paid = await pollUntilPaid(result.orderNo, form.email.trim());
        unlockScroll();
        setIsSubmittingPayment(false);
        if (paid === true) {
          clearCart();
          sessionStorage.removeItem(STORAGE_FORM_KEY);
          setStep("success");
          if (typeof window !== "undefined") window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        } else {
          setErrors({ _root: "Payment was not confirmed in time. Please contact support." });
          setStep("form");
        }
        return;
      }

      setStatusText("Opening payment gateway…");
      const { outcome, message } = await openRazorpay(result, form, async (payload) => {
        await checkoutApi.confirm(result.orderNo, payload);
      });

      // Immediately keep user in paying/processing state so the checkout form never flashes back
      setStep("paying");

      if (outcome === "paid") {
        clearCart();
        sessionStorage.removeItem(STORAGE_FORM_KEY);
        unlockScroll();
        setIsSubmittingPayment(false);
        setStep("success");
        if (typeof window !== "undefined") window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        return;
      }

      /*
       * A declined payment is final — stop now.
       */
      if (outcome === "failed" || outcome === "unavailable") {
        unlockScroll();
        setIsSubmittingPayment(false);
        setFailure({ orderNo: result.orderNo, reason: message });
        setStep("failed");
        if (typeof window !== "undefined") window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        return;
      }

      if (outcome === "dismissed") {
        // Customer dismissed or closed modal. Check once if payment succeeded via webhook
        setStatusText("Checking payment status securely…");
        try {
          const check = await checkoutApi.status(result.orderNo, form.email.trim());
          if (
            check.paymentStatus === "PAID" ||
            check.status === "PROCESSING" ||
            check.status === "SHIPPED"
          ) {
            clearCart();
            sessionStorage.removeItem(STORAGE_FORM_KEY);
            unlockScroll();
            setIsSubmittingPayment(false);
            setStep("success");
            if (typeof window !== "undefined") window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            return;
          }
        } catch {
          /* ignore */
        }
        // Clean dismissal: restore form cleanly with all user inputs intact
        unlockScroll();
        setIsSubmittingPayment(false);
        setStep("form");
        return;
      }

      setStatusText("Confirming your payment…");
      const pollResult = await pollUntilPaid(result.orderNo, form.email.trim(), 35_000);
      unlockScroll();
      setIsSubmittingPayment(false);
      if (pollResult === true) {
        clearCart();
        sessionStorage.removeItem(STORAGE_FORM_KEY);
        setStep("success");
        if (typeof window !== "undefined") window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      } else if (pollResult === false) {
        setFailure({
          orderNo: result.orderNo,
          reason:
            "Payment could not be confirmed. Please check your bank or retry checkout.",
        });
        setStep("failed");
        if (typeof window !== "undefined") window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      } else {
        // Pending state (e.g. slow UPI or delayed gateway webhook)
        setStep("pending");
        if (typeof window !== "undefined") window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    } catch (err) {
      unlockScroll();
      setIsSubmittingPayment(false);
      setErrors(err.fields ?? { _root: err.message });
      setStep("form");
      if (typeof window !== "undefined") window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  // ---- SUCCESS SCREEN --------------------------------------------------------
  if (step === "success" && placed) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center bg-[#060913] px-6 pb-20 pt-28">
          <div className="flex w-full max-w-lg flex-col items-center gap-7 text-center rounded-3xl border border-white/10 bg-[#090f1d] p-8 sm:p-12 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary/40 bg-primary/10 shadow-[0_0_32px_rgba(68,229,194,0.25)]">
              <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12 text-primary animate-bounce">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div>
              <span className="inline-block rounded-full bg-primary/15 border border-primary/30 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary font-[Montserrat] mb-3">
                Order Confirmed
              </span>
              <h1 className="font-[Playfair_Display] text-[36px] sm:text-[42px] font-bold leading-tight text-white">
                Thank you for your order!
              </h1>
              <p className="mt-3 text-[14px] leading-relaxed text-white/60 font-[Montserrat]">
                Order <span className="font-mono font-semibold text-primary">{placed.orderNo}</span> has been confirmed.
                Payment is verified and your items are being prepared for dispatch.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3.5 sm:flex-row pt-2">
              <a
                href={`/orders/track?orderNo=${placed.orderNo}&email=${encodeURIComponent(form.email)}`}
                className="flex-1 rounded-2xl bg-primary py-4 text-center text-[12px] font-bold uppercase tracking-[0.18em] text-[#00382d] font-[Montserrat] transition-all duration-200 hover:bg-primary/90 shadow-[0_4px_20px_rgba(68,229,194,0.3)]"
              >
                Track Order Status
              </a>
              <a
                href="/products"
                className="flex-1 rounded-2xl border border-white/15 bg-white/5 py-4 text-center text-[12px] font-bold uppercase tracking-[0.18em] text-white/70 font-[Montserrat] transition-all duration-200 hover:border-white/30 hover:text-white hover:bg-white/10"
              >
                Explore Products
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  /* ---- PAYMENT FAILED SCREEN -------------------------------------------------
   *
   * A decline deserves its own page, not a red bar above a form the customer
   * has already filled in. Dropping them back there looked like the checkout
   * had reset and lost their details.
   *
   * The order still exists and is payable, so the primary action is "Try
   * payment again" — which re-opens Razorpay with the SAME order rather than
   * creating a duplicate. The cart is deliberately NOT cleared.
   */
  if (step === "failed" && failure) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center bg-[#060913] px-6 pb-20 pt-28">
          <div className="flex w-full max-w-lg flex-col items-center gap-7 text-center rounded-3xl border border-white/10 bg-[#090f1d] p-8 sm:p-12 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-red-500/40 bg-red-500/10">
              <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12 text-red-400" aria-hidden="true">
                <path d="M12 8v5m0 3.5h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>

            <div>
              <span className="mb-3 inline-block rounded-full border border-red-500/30 bg-red-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-red-300 font-[Montserrat]">
                Payment Failed
              </span>
              <h1 className="font-[Playfair_Display] text-[32px] sm:text-[38px] font-bold leading-tight text-white">
                Your payment didn&apos;t go through
              </h1>
              <p className="mt-3 text-[14px] leading-relaxed text-white/60 font-[Montserrat]">
                {failure.reason}
              </p>
              <p className="mt-4 text-[13px] leading-relaxed text-white/45 font-[Montserrat]">
                Order <span className="font-mono font-semibold text-white/70">{failure.orderNo}</span> is
                saved and nothing has been charged. Your cart and details are still here — pay within
                30 minutes or the order is released automatically.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3.5 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setFailure(null);
                  setErrors({});
                  setStep("form");
                }}
                className="flex-1 rounded-2xl bg-primary py-4 text-center text-[12px] font-bold uppercase tracking-[0.18em] text-[#00382d] font-[Montserrat] shadow-[0_4px_20px_rgba(68,229,194,0.3)] transition-all duration-200 hover:bg-primary/90"
              >
                Try Payment Again
              </button>
              <a
                href={`/orders/track?orderNo=${failure.orderNo}&email=${encodeURIComponent(form.email)}`}
                className="flex-1 rounded-2xl border border-white/15 bg-white/5 py-4 text-center text-[12px] font-bold uppercase tracking-[0.18em] text-white/70 font-[Montserrat] transition-all duration-200 hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                Check Order Status
              </a>
            </div>

            <p className="text-[11.5px] leading-relaxed text-white/35 font-[Montserrat]">
              Money debited but no confirmation? It is usually returned by your bank within 5–7
              working days. Contact us with your order number and we will trace it.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ---- PAYMENT CONFIRMATION PENDING (SLOW UPI / GATEWAY SETTLEMENT) ---------
  if (step === "pending" && placed) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center bg-[#060913] px-6 pb-20 pt-28">
          <div className="flex w-full max-w-lg flex-col items-center gap-7 text-center rounded-3xl border border-white/10 bg-[#090f1d] p-8 sm:p-12 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-amber-400/40 bg-amber-400/10 shadow-[0_0_32px_rgba(251,191,36,0.2)]">
              <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12 text-amber-400" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>

            <div>
              <span className="mb-3 inline-block rounded-full border border-amber-400/30 bg-amber-400/15 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-300 font-[Montserrat]">
                Payment Confirmation Pending
              </span>
              <h1 className="font-[Playfair_Display] text-[32px] sm:text-[38px] font-bold leading-tight text-white">
                Verifying your transaction
              </h1>
              <p className="mt-3 text-[14px] leading-relaxed text-white/70 font-[Montserrat]">
                Order <span className="font-mono font-semibold text-primary">{placed.orderNo}</span> has been received.
                We are waiting for final confirmation from the payment gateway.
              </p>
              <p className="mt-4 rounded-xl border border-white/8 bg-white/3 p-4 text-[12.5px] leading-relaxed text-white/50 font-[Montserrat]">
                If money left your account, your order will automatically be confirmed once the gateway confirms receipt. Please do not initiate another payment for this order.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3.5 pt-2 sm:flex-row">
              <a
                href={`/orders/track?orderNo=${placed.orderNo}&email=${encodeURIComponent(form.email)}`}
                className="flex-1 rounded-2xl bg-primary py-4 text-center text-[12px] font-bold uppercase tracking-[0.18em] text-[#00382d] font-[Montserrat] shadow-[0_4px_20px_rgba(68,229,194,0.3)] transition-all duration-200 hover:bg-primary/90"
              >
                Track Order Status
              </a>
              <a
                href="/products"
                className="flex-1 rounded-2xl border border-white/15 bg-white/5 py-4 text-center text-[12px] font-bold uppercase tracking-[0.18em] text-white/70 font-[Montserrat] transition-all duration-200 hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                Continue Shopping
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ---- PAYING / PROCESSING FULL-SCREEN STATE ----------------------------------
  if (step === "paying") {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center bg-[#060913] px-6 pt-28 pb-20">
          <div className="flex flex-col items-center gap-7 text-center rounded-3xl border border-white/10 bg-[#090f1d] p-10 sm:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.6)] max-w-lg w-full">
            <div className="relative flex items-center justify-center">
              <div className="h-20 w-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin shadow-[0_0_24px_rgba(68,229,194,0.3)]" />
              <div className="absolute h-10 w-10 rounded-full bg-primary/20 animate-ping" />
              <div className="absolute flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <div>
              <span className="inline-block rounded-full bg-primary/10 border border-primary/25 px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-widest text-primary font-[Montserrat] mb-3">
                Secure Checkout
              </span>
              <h2 className="font-[Playfair_Display] text-[26px] sm:text-[30px] font-bold text-white leading-snug">
                Processing Your Payment
              </h2>
              <p className="mt-2.5 text-[14px] text-white/75 font-[Montserrat] leading-relaxed">
                {statusText || "Connecting to secure payment gateway…"}
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-white/6 bg-white/2 py-2.5 px-4 text-[12px] text-white/40 font-[Montserrat]">
                <svg className="h-3.5 w-3.5 text-primary/70 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Please do not close or refresh this window</span>
              </div>
            </div>
            {placed?.payment?.simulated && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5">
                <p className="text-[11px] text-amber-300 font-[Montserrat]">
                  Development Test Mode — payment confirms automatically.
                </p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ---- EMPTY CART SCREEN ----------------------------------------------------
  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center bg-[#060913] px-6 pt-20">
          <div className="flex flex-col items-center gap-6 text-center max-w-md">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/30">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h2 className="font-[Playfair_Display] text-[32px] font-bold text-white">Your cart is empty</h2>
              <p className="mt-2 text-[14px] text-white/50 font-[Montserrat]">
                Explore our scientifically formulated insect-protein fish feed options.
              </p>
            </div>
            <a
              href="/products"
              className="rounded-2xl bg-primary px-8 py-4 text-[12px] font-bold uppercase tracking-[0.18em] text-[#00382d] font-[Montserrat] transition-all duration-200 hover:bg-primary/90 shadow-[0_4px_20px_rgba(68,229,194,0.3)]"
            >
              Shop Aqua Feeds
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#060913] pb-24 pt-24 sm:pt-28 text-[#dde2f6]">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-8">
          {/* Top Breadcrumbs Nav */}
          <div className="mb-6 sm:mb-8">
            <CheckoutBreadcrumbs currentStep={step} />
          </div>

          {/* Page Title Header */}
          <div className="mb-8 border-b border-white/8 pb-6">
            <h1 className="font-[Playfair_Display] text-[32px] sm:text-[44px] font-bold leading-tight text-white">
              Complete Your Order
            </h1>
          </div>

          {/* Secure Payment Initializing Banner */}
          {isSubmittingPayment && (
            <div
              id="checkout-payment-loading"
              role="status"
              aria-live="polite"
              className="mb-8 flex items-center gap-4 rounded-2xl border border-primary/40 bg-primary/10 p-5 text-white shadow-[0_0_30px_rgba(68,229,194,0.15)] animate-pulse"
            >
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-[Playfair_Display] text-[17px] font-bold text-white tracking-wide">
                  {statusText || "Preparing secure payment…"}
                </span>
                <span className="font-[Montserrat] text-[12.5px] text-white/70">
                  Connecting to Razorpay. Please do not refresh or close this window.
                </span>
              </div>
            </div>
          )}

          {/* Global Root Errors */}
          {/*
            `id` and the scroll effect below matter after a failed payment: the
            Razorpay modal closes and returns you to wherever the page was
            scrolled, which is usually nowhere near this banner. Without it the
            page just looks like nothing happened.
          */}
          {errors._root && (
            <div
              id="checkout-root-error"
              role="alert"
              aria-live="assertive"
              className="mb-8 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-[13px] text-red-300 font-[Montserrat]"
            >
              <svg className="h-5 w-5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errors._root}</span>
            </div>
          )}

          {/* 2-COLUMN GRID LAYOUT (Left: 7 cols, Right: 5 cols) */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
            {/* LEFT COLUMN: Contact, Shipping, Payment */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 lg:col-span-7">
              {/* SECTION 1: CONTACT INFORMATION */}
              <div className={`flex flex-col gap-5 ${CARD} ${CARD_PAD}`}>
                <div className={CARD_HEADER}>
                  <div className="flex items-center gap-3">
                    <div className={STEP_CHIP}>
                      1
                    </div>
                    <h2 className={SECTION_TITLE}>
                      Contact Information
                    </h2>
                  </div>
                  {/* Signed-in customers get a quiet confirmation instead of a prompt. */}
                  {!authLoading && isAuthenticated && (
                    <span className="hidden font-[Montserrat] text-[11px] text-primary/70 sm:inline">
                      Signed in
                    </span>
                  )}
                </div>

                {/*
                  Offered, never required. Guest checkout stays the default path —
                  forcing an account at the payment step is one of the most
                  reliable ways to lose a sale. `next` returns them here with the
                  cart intact, since the cart lives in the browser either way.
                */}
                {!authLoading && !isAuthenticated && (
                  <a
                    href={signInHref("/checkout")}
                    className={`flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/[0.04] px-4 py-3 ${EASE} hover:border-primary/40 hover:bg-primary/[0.07]`}
                  >
                    <span className="font-[Montserrat] text-[12.5px] text-white/60">
                      Have an account?{" "}
                      <span className="font-semibold text-primary">Sign in</span> to fill this
                      in automatically.
                    </span>
                    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                )}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FloatingInput
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    required
                    value={form.firstName}
                    onChange={handleChange("firstName")}
                    onBlur={handleBlur("firstName")}
                    error={touched.firstName ? errors.firstName : undefined}
                    isValid={touched.firstName && !errors.firstName && form.firstName.length >= 2}
                    autoComplete="given-name"
                    maxLength={50}
                    placeholder="Ravi"
                  />

                  <FloatingInput
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    required
                    value={form.lastName}
                    onChange={handleChange("lastName")}
                    onBlur={handleBlur("lastName")}
                    error={touched.lastName ? errors.lastName : undefined}
                    isValid={touched.lastName && !errors.lastName && form.lastName.length >= 1}
                    autoComplete="family-name"
                    maxLength={50}
                    placeholder="Kumar"
                  />

                  <FloatingInput
                    id="email"
                    name="email"
                    type="email"
                    label="Email Address"
                    required
                    value={form.email}
                    onChange={handleChange("email")}
                    onBlur={handleBlur("email")}
                    error={touched.email ? errors.email : undefined}
                    isValid={touched.email && !errors.email && form.email.length > 3}
                    autoComplete="email"
                    maxLength={100}
                    placeholder="ravi.kumar@example.com"
                  />

                  <FloatingInput
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    label="Mobile Number"
                    required
                    value={form.phone}
                    onChange={handleChange("phone")}
                    onBlur={handleBlur("phone")}
                    error={touched.phone ? errors.phone : undefined}
                    isValid={touched.phone && !errors.phone && form.phone.length === 10}
                    hint="10-digit Indian mobile number for delivery updates"
                    autoComplete="tel"
                    maxLength={10}
                    placeholder="9876543210"
                  />
                </div>
              </div>

              {/* SECTION 2: SHIPPING ADDRESS */}
              <div className={`flex flex-col gap-5 ${CARD} ${CARD_PAD}`}>
                <div className={CARD_HEADER}>
                  <div className="flex items-center gap-3">
                    <div className={STEP_CHIP}>
                      2
                    </div>
                    <h2 className={SECTION_TITLE}>
                      Delivery Address
                    </h2>
                  </div>
                  {autoDetectedBadge && (
                    <span className="text-[10px] bg-primary/15 border border-primary/30 text-primary px-2.5 py-1 rounded-full font-semibold font-[Montserrat]">
                      {autoDetectedBadge}
                    </span>
                  )}
                </div>

                {/*
                  Saved addresses first, when there are any. Choosing one writes
                  into the same form the fields below use, so there is one
                  validation path and one payload either way.
                */}
                {savedAddresses.length > 0 && (
                  <SavedAddressPicker
                    addresses={savedAddresses}
                    selectedId={selectedAddressId}
                    onSelect={chooseAddress}
                  />
                )}

                {/*
                  Kept MOUNTED when a saved address is picked — the fields still
                  hold the values being submitted, and unmounting would drop the
                  state validation reads from.

                  Toggled by class, not the `hidden` attribute: `hidden` is a UA
                  rule and loses to the author-level `display:flex` from these
                  very classes, so the fields stayed visible underneath the
                  picker. Swapping flex for Tailwind's `hidden` removes the
                  competing declaration entirely.
                */}
                <div
                  className={`${
                    savedAddresses.length > 0 && selectedAddressId !== "new"
                      ? "hidden"
                      : "flex"
                  } flex-col gap-5`}
                >
                  <FloatingInput
                    id="address"
                    name="address"
                    label="Street Address / House / Flat No."
                    required
                    value={form.address}
                    onChange={handleChange("address")}
                    onBlur={handleBlur("address")}
                    error={touched.address ? errors.address : undefined}
                    isValid={touched.address && !errors.address && form.address.length >= 5}
                    autoComplete="street-address"
                    maxLength={200}
                    placeholder="Flat 4B, Blue Ridge Apts, MG Road"
                  />

                  {/*
                    State stays a dropdown, unlike city: it drives the GST
                    split on the invoice (CGST+SGST vs IGST), so it has to be
                    one of 33 exact values rather than free text.
                  */}
                  <FloatingSelect
                    id="state"
                    name="state"
                    label="State / Region"
                    required
                    value={form.state}
                    onChange={handleChange("state")}
                    onBlur={handleBlur("state")}
                    error={touched.state ? errors.state : undefined}
                    options={STATES}
                    hint="Also determines GST on your invoice"
                  />

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/*
                      City is a plain text field, autofilled from the pincode.

                      It used to be a dropdown backed by a hardcoded ~18-cities
                      -per-state list, which could not represent most of India's
                      ~750 districts — and the backend accepts city as free text
                      anyway (2–80 chars, printed on the address label; couriers
                      route on the pincode). The dropdown constrained customers
                      for no downstream benefit, and silently blanked itself
                      whenever the postal lookup returned a district outside the
                      list. Typing, with the pincode filling it in, is both
                      simpler and correct everywhere.
                    */}
                    <FloatingInput
                      id="city"
                      name="city"
                      label="City / District"
                      required
                      value={form.city}
                      onChange={handleChange("city")}
                      onBlur={handleBlur("city")}
                      error={touched.city ? errors.city : undefined}
                      isValid={touched.city && !errors.city && form.city.length >= 2}
                      loading={pincodeLoading}
                      hint="Filled in from your pincode — edit if needed"
                      autoComplete="address-level2"
                      maxLength={50}
                      placeholder="Ratnagiri"
                    />


                    <FloatingInput
                      id="pincode"
                      name="pincode"
                      type="text"
                      inputMode="numeric"
                      label="Pincode"
                      required
                      value={form.pincode}
                      onChange={handleChange("pincode")}
                      onBlur={handleBlur("pincode")}
                      error={touched.pincode ? errors.pincode : undefined}
                      isValid={touched.pincode && !errors.pincode && form.pincode.length === 6}
                      loading={pincodeLoading}
                      hint="6-digit postal pincode"
                      autoComplete="postal-code"
                      maxLength={6}
                      placeholder="680001"
                    />
                  </div>
                </div>

                {/*
                  Only offered for an address being typed. Re-saving one that
                  came out of the address book would be a no-op the customer
                  cannot see the result of.
                */}
                {selectedAddressId === "new" && (
                  <SaveAddressToggle
                    checked={saveAddress}
                    onChange={setSaveAddress}
                    isAuthenticated={isAuthenticated}
                  />
                )}
              </div>

              {/* SECTION 3: PAYMENT METHOD */}
              <div className={`flex flex-col gap-5 ${CARD} ${CARD_PAD}`}>
                <div className={CARD_HEADER}>
                  <div className="flex items-center gap-3">
                    <div className={STEP_CHIP}>
                      3
                    </div>
                    <h2 className={SECTION_TITLE}>
                      Payment Method
                    </h2>
                  </div>
                </div>

                <PaymentMethodSelector
                  selectedMethod={paymentMethod}
                  onSelectMethod={(m) => setPaymentMethod(m)}
                />
              </div>

              {/* SECTION 4: ORDER NOTES (OPTIONAL) */}
              <div className={`flex flex-col gap-3 ${CARD} ${CARD_PAD}`}>
                <h3 className="font-[Playfair_Display] text-[18px] font-bold text-white flex items-center justify-between">
                  <span>Order Notes</span>
                  <span className="text-[12px] font-normal text-white/30 font-[Montserrat]">(optional)</span>
                </h3>
                <textarea
                  value={form.notes}
                  onChange={handleChange("notes")}
                  rows={2}
                  maxLength={1000}
                  placeholder="Delivery instructions, gate code, call before arrival..."
                  className="w-full resize-none rounded-2xl border border-white/10 bg-[#090f1d] px-4 py-3 text-[14px] text-white placeholder-white/20 font-[Montserrat] transition-all duration-200 focus:border-primary/50 focus:bg-[#0f192b] focus:outline-none"
                />
              </div>

              {/* MAIN DESKTOP SUBMIT CTA BUTTON */}
              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={validating || isSubmittingPayment || !fulfillable}
                  aria-busy={validating || isSubmittingPayment}
                  className={`group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-primary py-4 text-[13px] font-bold uppercase tracking-[0.2em] text-[#00382d] font-[Montserrat] shadow-[0_4px_28px_rgba(68,229,194,0.35)] sm:py-5 ${EASE} hover:bg-primary/90 hover:shadow-[0_6px_34px_rgba(68,229,194,0.45)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:bg-primary ${FOCUS_RING}`}
                >
                  {/*
                   * Sheen sweep on hover. Purely decorative, so it is hidden
                   * from assistive tech and suppressed under reduced-motion.
                   */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full motion-reduce:hidden"
                  />

                  {isSubmittingPayment || validating ? (
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
                    </svg>
                  ) : (
                    <svg
                      className={`h-5 w-5 ${EASE} group-hover:scale-110`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}

                  <span className="relative">
                    {isSubmittingPayment
                      ? "Preparing secure payment…"
                      : validating
                      ? "Validating prices..."
                      : !fulfillable
                      ? "Fix cart issues to continue"
                      : `Pay Online · ${formatInr(totalPaise)}`}
                  </span>
                </button>

              </div>
            </form>

            {/* RIGHT COLUMN: STICKY ORDER SUMMARY */}
            <div className="lg:sticky lg:top-28 lg:col-span-5 flex flex-col gap-6">
              <OrderSummaryCard
                items={items}
                issues={issues}
                subtotalPaise={subtotalPaise}
                discountPaise={discountPaise}
                shippingPaise={shippingPaise}
                totalPaise={totalPaise}
                amountToFreeShippingPaise={amountToFreeShippingPaise}
                coupon={coupon}
                couponInput={couponInput}
                onCouponInputChange={setCouponInput}
                couponError={couponError}
                onSubmitCoupon={submitCoupon}
                paymentMethod={paymentMethod}
                config={config}
                validating={validating}
                setQty={setQty}
                removeFromCart={removeFromCart}
              />
            </div>
          </div>
        </div>

        {/*
          STICKY BOTTOM BAR — MOBILE ONLY

          `pb-[env(safe-area-inset-bottom)]` keeps the button clear of the home
          indicator on notched iPhones, where a plain fixed bar would sit
          underneath it and become hard to tap. The `pb-24` on <main> reserves
          the space this bar occupies so it never covers the last section.
        */}
        <div className="fixed bottom-0 left-0 right-0 z-40 flex lg:hidden items-center justify-between gap-4 border-t border-white/10 bg-[#090f1d]/95 px-5 py-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] shadow-[0_-8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="flex min-w-0 flex-col">
            <span className="text-[10px] uppercase tracking-wider text-white/40 font-[Montserrat]">
              Total Amount
            </span>
            <span className="truncate font-[Playfair_Display] text-[20px] font-bold tabular-nums text-white">
              {formatInr(totalPaise)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={validating || isSubmittingPayment || !fulfillable}
            aria-busy={validating || isSubmittingPayment}
            className={`flex shrink-0 items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#00382d] font-[Montserrat] ${EASE} hover:bg-primary/90 active:scale-[0.98] disabled:opacity-40 ${FOCUS_RING}`}
          >
            <span>
              {isSubmittingPayment
                ? "Preparing..."
                : validating
                ? "Checking..."
                : !fulfillable
                ? "Fix cart"
                : "Pay Online"}
            </span>
            {isSubmittingPayment || validating ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </button>
        </div>
      </main>

      {/*
        No site Footer on the active checkout form.

        The footer is a browse-oriented nav block, and offering a dozen ways to
        leave the page is the opposite of what checkout is for. The two links
        that genuinely belong at the point of payment — Privacy and Terms — are
        kept inline below instead. The terminal states (success, empty cart,
        error) DO keep the full footer, because browsing is the right next step
        there.
      */}
      <div className="border-t border-white/6 bg-[#060913] px-6 pb-28 pt-6 lg:pb-8">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-white/30 font-[Montserrat]">
          <span>© {new Date().getFullYear()} Zewa Feeds</span>
          {/*
            Placeholder hrefs, matching components/Footer.jsx — the Privacy and
            Terms pages do not exist yet. Point these at the real routes when
            they ship; a payment page is exactly where people look for them.
          */}
          <a href="#" className="transition-colors hover:text-white/60">
            Privacy Policy
          </a>
          <a href="#" className="transition-colors hover:text-white/60">
            Terms of Use
          </a>
        </div>
      </div>
    </>
  );
}

// Razorpay SDK popup handler (Production path)
/**
 * Open the Razorpay modal and report HOW it ended.
 *
 * This used to return a bare boolean, which collapsed four very different
 * outcomes into `false`: the customer cancelled, the bank declined, the SDK
 * failed to load, or confirmation failed on our side. The caller could only
 * assume "maybe it is still in flight" and poll for two minutes — so a card
 * that was declined instantly left the customer watching a "Confirming payment
 * with bank… 118s" counter before finally being told it did not work.
 *
 * Returns { outcome, message }:
 *   "paid"      — confirmed with our API, order is done
 *   "failed"    — Razorpay reported payment.failed, with the bank's reason
 *   "dismissed" — the customer closed the modal without paying
 *   "unavailable" — the SDK could not load or no public key was issued
 */
async function openRazorpay(result, form, onSuccess) {
  const loaded = await new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) return resolve(true);
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      if (window.Razorpay) return resolve(true);
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  if (!loaded || !result.payment.publicKey) {
    return {
      outcome: "unavailable",
      message: "Could not reach the payment gateway. Check your connection and try again.",
    };
  }

  return new Promise((resolve) => {
    /*
     * `handler` and `payment.failed` can both fire, and ondismiss always fires
     * when the modal closes. First result wins — otherwise a failed payment
     * would be overwritten by the dismissal that follows it.
     */
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    const rzp = new window.Razorpay({
      key: result.payment.publicKey,
      amount: result.payment.amountPaise,
      currency: "INR",
      name: "Zewa Feeds",
      order_id: result.payment.gatewayOrderId,
      prefill: {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        contact: form.phone,
      },
      theme: { color: "#44e5c2" },
      handler: async (response) => {
        try {
          await onSuccess({
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          finish({ outcome: "paid" });
        } catch (err) {
          /*
           * Razorpay took the money but our confirm call had a network issue.
           * Fall through to background status polling / pending confirmation.
           */
          finish({
            outcome: "in_flight",
            message: err?.message || "Payment received — confirming with our server.",
          });
        }
      },
      modal: { ondismiss: () => finish({ outcome: "dismissed" }) },
    });

    /*
     * The decisive fix: subscribe to payment.failed. Razorpay fires this the
     * moment the bank declines, so we can stop immediately with the real
     * reason instead of polling for a confirmation that will never arrive.
     */
    rzp.on("payment.failed", (event) => {
      const e = event?.error ?? {};
      /*
       * Close the modal ourselves.
       *
       * Razorpay keeps its own "Payment could not be completed / Retry" screen
       * open after a decline. Without this the customer sees that overlay on
       * top of our own failure state — two competing versions of the same news,
       * with our page visibly reset behind theirs.
       */
      try {
        rzp.close();
      } catch {
        /* already closed */
      }
      finish({
        outcome: "failed",
        message: e.description || e.reason || "Your bank declined the payment.",
      });
    });

    // Ensure the page viewport is definitively at scrollY = 0 before opening Razorpay
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    rzp.open();
  });
}
