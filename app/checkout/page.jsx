"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cartContext";

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Chandigarh", "Puducherry",
];

function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-white/40 tracking-[0.12em] uppercase font-[Montserrat]">
        {label}{required && <span className="text-primary ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-400 font-[Montserrat]">{error}</p>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", className = "" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl bg-[#0e1828] border border-white/8 text-[#b8c4d4] text-[14px] font-[Montserrat] placeholder-white/15 focus:outline-none focus:border-primary/40 focus:bg-[#101e30] transition-all duration-200 ${className}`}
    />
  );
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const shipping = subtotal >= 499 ? 0 : 49;
  const total = subtotal + shipping;

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", pincode: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("form"); // "form" | "success"
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "10-digit mobile number required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state) e.state = "Required";
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode)) e.pincode = "Valid 6-digit pincode required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    // Simulate order placement
    setTimeout(() => {
      clearCart();
      setStep("success");
      setLoading(false);
    }, 1200);
  };

  if (step === "success") {
    return (
      <>
        <Header />
        <main className="bg-[#06080f] min-h-screen flex items-center justify-center px-6 pt-20 pb-20">
          <div className="max-w-md w-full text-center flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-primary">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="font-[Playfair_Display] text-[36px] text-white mb-3">Order Placed!</h1>
              <p className="text-[14px] text-white/45 font-[Montserrat] leading-relaxed">
                Thank you, {form.firstName}! We'll send a confirmation to <span className="text-primary">{form.email}</span>.
                Your order will be dispatched within 1–2 business days.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
              <a href="/products"
                className="flex-1 py-3.5 rounded-full bg-primary text-[#00382d] text-center text-[11px] font-bold tracking-[0.18em] uppercase font-[Montserrat] hover:bg-primary/85 transition-all duration-200">
                Continue Shopping
              </a>
              <a href="/"
                className="flex-1 py-3.5 rounded-full border border-white/15 text-white/50 text-center text-[11px] font-bold tracking-[0.18em] uppercase font-[Montserrat] hover:border-white/30 hover:text-white/70 transition-all duration-200">
                Go Home
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="bg-[#06080f] min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="text-center flex flex-col items-center gap-5">
            <p className="font-[Playfair_Display] text-[28px] text-white/50">Your cart is empty</p>
            <a href="/products"
              className="px-8 py-3.5 rounded-full bg-primary text-[#00382d] text-[11px] font-bold tracking-[0.18em] uppercase font-[Montserrat] hover:bg-primary/85 transition-all duration-200">
              Shop Products
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
      <main className="bg-[#06080f] min-h-screen text-[#dde2f6] pt-28 pb-20">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10">

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-px bg-primary" />
              <span className="text-[10px] font-bold text-primary tracking-[0.28em] font-[Montserrat] uppercase">Secure Checkout</span>
            </div>
            <h1 className="font-[Playfair_Display] text-[36px] sm:text-[48px] text-white leading-tight">
              Complete your order
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

            {/* Form — 3 cols */}
            <form onSubmit={handleSubmit} className="lg:col-span-3 flex flex-col gap-8">

              {/* Contact */}
              <div className="rounded-2xl bg-white/3 border border-white/6 p-6 flex flex-col gap-5">
                <h2 className="font-[Playfair_Display] text-[20px] text-white">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="First Name" required error={errors.firstName}>
                    <Input value={form.firstName} onChange={set("firstName")} placeholder="Ravi" />
                  </Field>
                  <Field label="Last Name" required error={errors.lastName}>
                    <Input value={form.lastName} onChange={set("lastName")} placeholder="Kumar" />
                  </Field>
                  <Field label="Email" required error={errors.email}>
                    <Input type="email" value={form.email} onChange={set("email")} placeholder="ravi@example.com" />
                  </Field>
                  <Field label="Mobile Number" required error={errors.phone}>
                    <Input type="tel" value={form.phone} onChange={set("phone")} placeholder="98765 43210" />
                  </Field>
                </div>
              </div>

              {/* Shipping address */}
              <div className="rounded-2xl bg-white/3 border border-white/6 p-6 flex flex-col gap-5">
                <h2 className="font-[Playfair_Display] text-[20px] text-white">Shipping Address</h2>
                <div className="flex flex-col gap-4">
                  <Field label="Address" required error={errors.address}>
                    <Input value={form.address} onChange={set("address")} placeholder="House / Flat no., Street, Area" />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="City" required error={errors.city}>
                      <Input value={form.city} onChange={set("city")} placeholder="Thrissur" />
                    </Field>
                    <Field label="Pincode" required error={errors.pincode}>
                      <Input value={form.pincode} onChange={set("pincode")} placeholder="680001" />
                    </Field>
                  </div>
                  <Field label="State" required error={errors.state}>
                    <select
                      value={form.state}
                      onChange={set("state")}
                      className="w-full px-4 py-3 rounded-xl bg-[#0e1828] border border-white/8 text-[14px] font-[Montserrat] focus:outline-none focus:border-primary/40 focus:bg-[#101e30] transition-all duration-200 appearance-none"
                      style={{ color: form.state ? "#b8c4d4" : "rgba(255,255,255,0.15)" }}
                    >
                      <option value="" disabled>Select state</option>
                      {STATES.map((s) => (
                        <option key={s} value={s} style={{ background: "#0e1828", color: "#b8c4d4" }}>{s}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>

              {/* Order notes */}
              <div className="rounded-2xl bg-white/3 border border-white/6 p-6 flex flex-col gap-4">
                <h2 className="font-[Playfair_Display] text-[20px] text-white">Order Notes <span className="text-[14px] text-white/25 font-[Montserrat] font-normal">(optional)</span></h2>
                <textarea
                  value={form.notes}
                  onChange={set("notes")}
                  placeholder="Any special instructions for your order…"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-[#0e1828] border border-white/8 text-[#b8c4d4] text-[14px] font-[Montserrat] placeholder-white/15 focus:outline-none focus:border-primary/40 focus:bg-[#101e30] transition-all duration-200 resize-none"
                />
              </div>

              {/* Payment note */}
              <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-white/3 border border-white/6">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-primary shrink-0 mt-0.5">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M1 10h22" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <p className="text-[12px] text-white/40 font-[Montserrat] leading-relaxed">
                  Payment is collected on delivery (COD). Our team will call to confirm your order before dispatch.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-primary text-[#00382d] text-[12px] font-bold tracking-[0.2em] uppercase font-[Montserrat] hover:bg-primary/85 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Placing order…
                  </>
                ) : `Place Order · ₹${total.toLocaleString("en-IN")}`}
              </button>
            </form>

            {/* Order summary — 2 cols */}
            <div className="lg:col-span-2 lg:sticky lg:top-28 flex flex-col gap-4">
              <div className="rounded-2xl bg-white/3 border border-white/6 p-6 flex flex-col gap-5">
                <h2 className="font-[Playfair_Display] text-[20px] text-white">Order Summary</h2>

                {/* Items */}
                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <div key={item.sku} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                      {/* Image + qty badge */}
                      <div className="relative shrink-0 w-11 h-11 rounded-lg overflow-visible">
                        <div className="w-11 h-11 rounded-lg overflow-hidden flex items-center justify-center"
                          style={{ background: item.accentBg || "#1a2235" }}>
                          <Image src={item.image} alt={item.name} width={36} height={36}
                            className="object-contain w-full h-full p-1.5"
                            style={{ filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.35))" }} />
                        </div>
                        <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full bg-primary text-[#00382d] text-[9px] font-bold font-[Montserrat] flex items-center justify-center shadow-md z-10">
                          {item.qty}
                        </span>
                      </div>

                      {/* Name + pack */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-[Playfair_Display] text-white/85 leading-snug truncate">{item.name}</p>
                        <p className="text-[10px] text-white/30 font-[Montserrat] mt-0.5">{item.pack}</p>
                      </div>

                      {/* Price */}
                      <span className="text-[13px] font-bold text-white/80 font-[Montserrat] shrink-0 tabular-nums">
                        ₹{(item.price * item.qty).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-white/6" />

                {/* Totals */}
                <div className="flex flex-col gap-3 text-[13px] font-[Montserrat]">
                  <div className="flex justify-between">
                    <span className="text-white/40">Subtotal</span>
                    <span className="text-white">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Shipping</span>
                    <span className={shipping === 0 ? "text-primary" : "text-white"}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="h-px bg-white/6" />
                  <div className="flex justify-between items-baseline">
                    <span className="text-white/70 font-semibold">Total (COD)</span>
                    <span className="font-[Playfair_Display] text-[24px] text-white">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Trust */}
              <div className="rounded-2xl bg-white/2 border border-white/5 p-5 flex flex-col gap-3">
                {[
                  {
                    text: shipping === 0 ? "Free shipping on this order" : "Free shipping above ₹499",
                    svg: <path d="M1 3h15v11H1zM16 8h4l3 3v3h-7V8zM5.5 17a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.5 17a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />,
                  },
                  {
                    text: "Easy returns within 7 days",
                    svg: <path d="M9 14L5 10l4-4M5 10h8a4 4 0 010 8h-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />,
                  },
                  {
                    text: "Order confirmed via call before dispatch",
                    svg: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />,
                  },
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-primary/50 shrink-0">{t.svg}</svg>
                    <span className="text-[11px] text-white/30 font-[Montserrat]">{t.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
