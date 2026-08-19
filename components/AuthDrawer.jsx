"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FloatingInput } from "@/components/checkout/FloatingInput";
import { FormMessage, PasswordToggle, PrimaryButton } from "@/components/account/ui";
import { useAuth, safeNext } from "@/lib/authContext";
import { ApiError } from "@/lib/api";

function validatePassword(p) {
  if (!p) return "Enter a password.";
  if (p.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(p)) return "Add at least one uppercase letter.";
  if (!/[a-z]/.test(p)) return "Add at least one lowercase letter.";
  if (!/[0-9]/.test(p)) return "Add at least one number.";
  return null;
}

function PasswordScore({ password }) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["Weak", "Fair", "Good", "Strong", "Excellent"];
  const colors = [
    "bg-red-500",
    "bg-amber-500",
    "bg-yellow-400",
    "bg-emerald-400",
    "bg-[#44e5c2]",
  ];
  const idx = Math.min(score, 5) - 1;

  return (
    <div className="mt-1.5 flex items-center gap-2">
      <div className="flex flex-1 gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
              i <= idx ? colors[Math.max(0, idx)] : "bg-white/10"
            }`}
          />
        ))}
      </div>
      {idx >= 0 && (
        <span className="font-[Montserrat] text-[10px] font-bold uppercase tracking-wider text-white/50">
          {labels[idx]}
        </span>
      )}
    </div>
  );
}

function AuthDrawerContent() {
  const {
    authDrawerOpen,
    setAuthDrawerOpen,
    authDrawerTab,
    setAuthDrawerTab,
    signIn,
    signUp,
    isAuthenticated,
  } = useAuth();

  const searchParams = useSearchParams();
  const router = useRouter();

  const next = safeNext(searchParams?.get("next"));

  // State for Sign In form
  const [signInForm, setSignInForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInErrors, setSignInErrors] = useState({});
  const [signInFormError, setSignInFormError] = useState(null);
  const [signInSubmitting, setSignInSubmitting] = useState(false);

  // State for Sign Up form
  const [signUpForm, setSignUpForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signUpErrors, setSignUpErrors] = useState({});
  const [signUpFormError, setSignUpFormError] = useState(null);
  const [signUpSubmitting, setSignUpSubmitting] = useState(false);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = authDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [authDrawerOpen]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setAuthDrawerOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setAuthDrawerOpen]);

  // Auto-close if already authenticated
  useEffect(() => {
    if (authDrawerOpen && isAuthenticated) {
      setAuthDrawerOpen(false);
    }
  }, [authDrawerOpen, isAuthenticated, setAuthDrawerOpen]);

  // ---- Sign In Handlers ----
  const setSignInField = (key) => (e) => {
    setSignInForm((f) => ({ ...f, [key]: e.target.value }));
    if (signInErrors[key]) setSignInErrors((prev) => ({ ...prev, [key]: undefined }));
    if (signInFormError) setSignInFormError(null);
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (signInSubmitting) return;

    const errs = {};
    if (!signInForm.email.trim()) errs.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signInForm.email.trim()))
      errs.email = "Enter a valid email address.";
    if (!signInForm.password) errs.password = "Enter your password.";

    setSignInErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSignInSubmitting(true);
    setSignInFormError(null);
    try {
      await signIn({
        email: signInForm.email.trim(),
        password: signInForm.password,
        remember,
      });
      setAuthDrawerOpen(false);
      if (next && next !== "/account") {
        router.push(next);
      }
    } catch (err) {
      if (err instanceof ApiError && err.fields) {
        setSignInErrors(err.fields);
        setSignInFormError(err.message);
      } else {
        setSignInFormError(
          err instanceof ApiError
            ? err.message
            : "Something went wrong signing you in. Please try again.",
        );
      }
    } finally {
      setSignInSubmitting(false);
    }
  };

  // ---- Sign Up Handlers ----
  const setSignUpField = (key) => (e) => {
    setSignUpForm((f) => ({ ...f, [key]: e.target.value }));
    if (signUpErrors[key]) setSignUpErrors((prev) => ({ ...prev, [key]: undefined }));
    if (signUpFormError) setSignUpFormError(null);
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (signUpSubmitting) return;

    const errs = {};
    if (!signUpForm.firstName.trim()) errs.firstName = "Enter your first name.";
    if (!signUpForm.lastName.trim()) errs.lastName = "Enter your last name.";
    if (!signUpForm.email.trim()) errs.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpForm.email.trim()))
      errs.email = "Enter a valid email address.";
    if (signUpForm.phone.trim() && !/^[6-9]\d{9}$/.test(signUpForm.phone.trim().replace(/\s+/g, "")))
      errs.phone = "Enter a valid 10-digit mobile number.";

    const pwErr = validatePassword(signUpForm.password);
    if (pwErr) errs.password = pwErr;
    if (signUpForm.confirmPassword !== signUpForm.password)
      errs.confirmPassword = "Passwords do not match.";

    setSignUpErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSignUpSubmitting(true);
    setSignUpFormError(null);
    try {
      await signUp({
        firstName: signUpForm.firstName.trim(),
        lastName: signUpForm.lastName.trim(),
        email: signUpForm.email.trim(),
        ...(signUpForm.phone.trim() ? { phone: signUpForm.phone.trim().replace(/\s+/g, "") } : {}),
        password: signUpForm.password,
      });
      setAuthDrawerOpen(false);
      if (next && next !== "/account") {
        router.push(next);
      }
    } catch (err) {
      if (err instanceof ApiError && err.fields) {
        setSignUpErrors(err.fields);
        setSignUpFormError(err.message);
      } else {
        setSignUpFormError(
          err instanceof ApiError
            ? err.message
            : "Something went wrong creating your account. Please try again.",
        );
      }
    } finally {
      setSignUpSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setAuthDrawerOpen(false)}
        className="fixed inset-0 z-[60] transition-all duration-300"
        style={{
          background: "rgba(3, 6, 14, 0.75)",
          backdropFilter: "blur(4px)",
          opacity: authDrawerOpen ? 1 : 0,
          pointerEvents: authDrawerOpen ? "auto" : "none",
        }}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        className="fixed top-0 right-0 h-full z-[70] flex flex-col bg-[#060913] border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.85)] transition-transform duration-300 ease-out overflow-hidden"
        style={{
          width: "min(460px, 100vw)",
          transform: authDrawerOpen ? "translateX(0)" : "translateX(100%)",
        }}
        aria-label="Account Authentication Drawer"
        /*
          The panel stays mounted when closed so it can slide rather than pop,
          which left a full sign-in form parked off the right edge of every
          page: still tabbable, still read by screen readers, and still offered
          to password managers. `inert` takes the whole subtree out of focus
          order and the accessibility tree while it is closed.

          Passed as a real boolean: React 19 maps inert={true|false} onto the
          attribute directly, and an empty string is coerced to FALSE — which is
          how the first attempt at this silently did nothing.
        */
        inert={!authDrawerOpen}
        aria-hidden={authDrawerOpen ? undefined : "true"}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8 bg-[#080d1a]/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.75"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="font-[Playfair_Display] text-[22px] font-bold text-white tracking-wide">
              {authDrawerTab === "signup"
                ? "Create Account"
                : authDrawerTab === "forgot"
                ? "Reset Password"
                : "Sign In"}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setAuthDrawerOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/50 hover:bg-white/12 hover:text-white hover:border-white/20 transition-all duration-200 group"
            aria-label="Close account drawer"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Segmented Controller */}
        {authDrawerTab !== "forgot" && (
          <div className="bg-[#080e1c] px-6 py-3 border-b border-white/8">
            <div className="flex rounded-xl bg-[#0d1627] p-1 border border-white/8">
              <button
                type="button"
                onClick={() => setAuthDrawerTab("signin")}
                className={`flex-1 rounded-lg py-2 text-center font-[Montserrat] text-[11px] font-bold uppercase tracking-[0.14em] transition-all duration-200 ${
                  authDrawerTab === "signin"
                    ? "bg-primary text-[#00382d] shadow-sm"
                    : "text-white/50 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthDrawerTab("signup")}
                className={`flex-1 rounded-lg py-2 text-center font-[Montserrat] text-[11px] font-bold uppercase tracking-[0.14em] transition-all duration-200 ${
                  authDrawerTab === "signup"
                    ? "bg-primary text-[#00382d] shadow-sm"
                    : "text-white/50 hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 custom-scrollbar">
          {/* TAB 1: SIGN IN */}
          {authDrawerTab === "signin" && (
            <form onSubmit={handleSignInSubmit} noValidate className="flex flex-col gap-4">
              {signInFormError && <FormMessage>{signInFormError}</FormMessage>}

              <FloatingInput
                id="auth-email"
                name="email"
                type="email"
                label="Email address"
                value={signInForm.email}
                onChange={setSignInField("email")}
                error={signInErrors.email}
                autoComplete="email"
                required
              />

              <div className="relative">
                <FloatingInput
                  id="auth-password"
                  name="password"
                  type={showSignInPassword ? "text" : "password"}
                  label="Password"
                  value={signInForm.password}
                  onChange={setSignInField("password")}
                  error={signInErrors.password}
                  autoComplete="current-password"
                  required
                />
                <PasswordToggle
                  visible={showSignInPassword}
                  onToggle={() => setShowSignInPassword((v) => !v)}
                />
              </div>

              <div className="flex items-center justify-between gap-4 font-[Montserrat] text-[12px]">
                <label className="flex cursor-pointer items-center gap-2 text-white/50 hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-3.5 w-3.5 cursor-pointer accent-primary rounded"
                  />
                  Keep me signed in
                </label>
                <button
                  type="button"
                  onClick={() => setAuthDrawerTab("forgot")}
                  className="text-white/45 hover:text-primary transition-colors font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <div className="mt-2">
                <PrimaryButton type="submit" loading={signInSubmitting}>
                  {signInSubmitting ? "Signing in" : "Sign In"}
                </PrimaryButton>
              </div>

              <div className="mt-4 text-center font-[Montserrat] text-[12.5px] text-white/45">
                New to Zewa Feeds?{" "}
                <button
                  type="button"
                  onClick={() => setAuthDrawerTab("signup")}
                  className="font-bold text-primary hover:underline"
                >
                  Create an account
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SIGN UP */}
          {authDrawerTab === "signup" && (
            <form onSubmit={handleSignUpSubmit} noValidate className="flex flex-col gap-4">
              {signUpFormError && <FormMessage>{signUpFormError}</FormMessage>}

              <div className="grid grid-cols-2 gap-3">
                <FloatingInput
                  id="auth-firstName"
                  name="firstName"
                  label="First name"
                  value={signUpForm.firstName}
                  onChange={setSignUpField("firstName")}
                  error={signUpErrors.firstName}
                  autoComplete="given-name"
                  required
                />
                <FloatingInput
                  id="auth-lastName"
                  name="lastName"
                  label="Last name"
                  value={signUpForm.lastName}
                  onChange={setSignUpField("lastName")}
                  error={signUpErrors.lastName}
                  autoComplete="family-name"
                  required
                />
              </div>

              <FloatingInput
                id="auth-email"
                name="email"
                type="email"
                label="Email address"
                value={signUpForm.email}
                onChange={setSignUpField("email")}
                error={signUpErrors.email}
                autoComplete="email"
                required
              />

              <FloatingInput
                id="auth-phone"
                name="phone"
                type="tel"
                label="Mobile number (optional)"
                value={signUpForm.phone}
                onChange={setSignUpField("phone")}
                error={signUpErrors.phone}
                autoComplete="tel"
                maxLength={10}
              />

              <div className="relative">
                <FloatingInput
                  id="auth-password"
                  name="password"
                  type={showSignUpPassword ? "text" : "password"}
                  label="Password"
                  value={signUpForm.password}
                  onChange={setSignUpField("password")}
                  error={signUpErrors.password}
                  autoComplete="new-password"
                  required
                />
                <PasswordToggle
                  visible={showSignUpPassword}
                  onToggle={() => setShowSignUpPassword((v) => !v)}
                />
                <PasswordScore password={signUpForm.password} />
              </div>

              <FloatingInput
                id="auth-confirmPassword"
                name="confirmPassword"
                type={showSignUpPassword ? "text" : "password"}
                label="Confirm password"
                value={signUpForm.confirmPassword}
                onChange={setSignUpField("confirmPassword")}
                error={signUpErrors.confirmPassword}
                autoComplete="new-password"
                required
              />

              <div className="mt-2">
                <PrimaryButton type="submit" loading={signUpSubmitting}>
                  {signUpSubmitting ? "Creating account" : "Create Account"}
                </PrimaryButton>
              </div>

              <div className="mt-4 text-center font-[Montserrat] text-[12.5px] text-white/45">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthDrawerTab("signin")}
                  className="font-bold text-primary hover:underline"
                >
                  Sign in
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD */}
          {authDrawerTab === "forgot" && (
            <div className="flex flex-col gap-4">
              <p className="font-[Montserrat] text-[13px] text-white/60 leading-relaxed">
                Enter your email address below and we will send you instructions to reset your password.
              </p>

              <FloatingInput
                id="auth-email"
                name="email"
                type="email"
                label="Email address"
                required
              />

              <PrimaryButton type="button" onClick={() => setAuthDrawerTab("signin")}>
                Send Reset Link
              </PrimaryButton>

              <button
                type="button"
                onClick={() => setAuthDrawerTab("signin")}
                className="mt-2 text-center font-[Montserrat] text-[12.5px] text-white/50 hover:text-primary transition-colors"
              >
                ← Back to Sign In
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default function AuthDrawer() {
  return (
    <Suspense fallback={null}>
      <AuthDrawerContent />
    </Suspense>
  );
}
