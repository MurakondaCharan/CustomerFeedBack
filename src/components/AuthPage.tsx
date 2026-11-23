import React, { useState, useEffect } from "react";
import { UserProfile } from "../types";
import { registerUser, authenticateUser, setSession } from "../services/auth";
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Building,
} from "lucide-react";

interface Props {
  initialMode?: "login" | "signup";
  initialNotice?: {
    type: "success" | "warning" | "error";
    message: string;
  } | null;
  onLoginSuccess: (user: UserProfile, token: string) => void;
  onGoToLanding: () => void;
}

export const AuthPage: React.FC<Props> = ({
  initialMode = "login",
  initialNotice = null,
  onLoginSuccess,
  onGoToLanding,
}) => {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);

  // Form fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupRole, setSignupRole] = useState("");
  const [signupCompany, setSignupCompany] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Status banners
  const [successMessage, setSuccessMessage] = useState<string | null>(
    initialNotice?.type === "success" ? initialNotice.message : null
  );
  const [warningMessage, setWarningMessage] = useState<string | null>(
    initialNotice?.type === "warning" ? initialNotice.message : null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(
    initialNotice?.type === "error" ? initialNotice.message : null
  );

  useEffect(() => {
    if (initialNotice) {
      if (initialNotice.type === "success") setSuccessMessage(initialNotice.message);
      if (initialNotice.type === "warning") setWarningMessage(initialNotice.message);
      if (initialNotice.type === "error") setErrorMessage(initialNotice.message);
    }
  }, [initialNotice]);

  const clearNotices = () => {
    setSuccessMessage(null);
    setWarningMessage(null);
    setErrorMessage(null);
  };

  const handleSwitchToLogin = (registeredEmail?: string) => {
    setMode("login");
    clearNotices();
    if (registeredEmail) {
      setLoginEmail(registeredEmail);
    }
  };

  const handleSwitchToSignup = () => {
    setMode("signup");
    clearNotices();
  };

  // SIGNUP SUBMISSION
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearNotices();

    // 1. Validate all fields
    if (!signupName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!signupEmail.trim() || !/^\S+@\S+\.\S+$/.test(signupEmail.trim())) {
      setErrorMessage("Please enter a valid work email address.");
      return;
    }
    if (!signupPassword) {
      setErrorMessage("Please create a password.");
      return;
    }
    if (signupPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // 2. Create the user account in persistent store
      const result = registerUser({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        role: signupRole || "Customer Experience Lead",
        company: signupCompany || "Global Enterprises",
      });

      setIsLoading(false);

      if (!result.success) {
        setErrorMessage(result.error || "Failed to create account. Please try again.");
        return;
      }

      const registeredEmailCopy = signupEmail.trim();

      // 4. Clear the signup form
      setSignupName("");
      setSignupEmail("");
      setSignupRole("");
      setSignupCompany("");
      setSignupPassword("");
      setSignupConfirmPassword("");

      // 3. Show success message: “Account created successfully! Please log in to continue.”
      // 5. Redirect user to Login page
      // 6. DO NOT create an authenticated session automatically
      // 7. DO NOT redirect directly to the Dashboard
      setMode("login");
      setLoginEmail(registeredEmailCopy);
      setLoginPassword("");
      setSuccessMessage("Account created successfully! Please log in to continue.");
    }, 400);
  };

  // LOGIN SUBMISSION
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearNotices();

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMessage("Invalid email or password. Please try again.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Authenticate against stored users
      const authResult = authenticateUser(loginEmail, loginPassword);
      setIsLoading(false);

      if (!authResult.success || !authResult.user || !authResult.token) {
        // INVALID LOGIN: Show "Invalid email or password. Please try again."
        setErrorMessage("Invalid email or password. Please try again.");
        return;
      }

      // Valid credentials:
      // -> Authenticate the user
      // -> Create the login session/token
      // -> Redirect to Dashboard
      setSession(authResult.token, authResult.user);
      onLoginSuccess(authResult.user, authResult.token);
    }, 350);
  };

  // Demo auto-fill helper
  const handleUseDemoCredentials = () => {
    clearNotices();
    setLoginEmail("rahul.sharma@enterprise-demo.com");
    setLoginPassword("password123");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-200/80 bg-white px-4 sm:px-8 flex items-center justify-between">
        <button
          onClick={onGoToLanding}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-xs shadow-indigo-200">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-sm font-extrabold tracking-tight text-slate-900">
            Feedback<span className="text-indigo-600">AI</span>
          </span>
        </div>

        <div className="text-xs text-slate-500 font-medium hidden sm:block">
          Enterprise Customer Intelligence
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div
          id="auth-page-card"
          className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 transition-all"
        >
          {/* Header Icon & Title */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-xs mb-3">
              <Lock className="w-5 h-5" />
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {mode === "login" ? "Sign In to Your Account" : "Create Enterprise Account"}
            </h1>

            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              {mode === "login"
                ? "Enter your credentials to access the AI feedback analytics dashboard."
                : "Register for an account to start analyzing customer feedback sentiment."}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="mt-5 grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
            <button
              id="auth-tab-login"
              type="button"
              onClick={() => handleSwitchToLogin()}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "login"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Login
            </button>
            <button
              id="auth-tab-signup"
              type="button"
              onClick={handleSwitchToSignup}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "signup"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* BANNERS */}
          {/* 1. Success Message (after signup) */}
          {successMessage && (
            <div
              id="auth-success-alert"
              className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="leading-snug">{successMessage}</div>
            </div>
          )}

          {/* 2. Warning / Protected Route Message */}
          {warningMessage && (
            <div
              id="auth-warning-alert"
              className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="leading-snug">{warningMessage}</div>
            </div>
          )}

          {/* 3. Error Message */}
          {errorMessage && (
            <div
              id="auth-error-alert"
              className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-snug">{errorMessage}</div>
            </div>
          )}

          {/* Demo Credentials Box for evaluators */}
          {mode === "login" && (
            <div className="mt-4 p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  Pre-configured Demo Account:
                </span>
                <button
                  type="button"
                  id="fill-demo-credentials-btn"
                  onClick={handleUseDemoCredentials}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
                >
                  Fill Credentials
                </button>
              </div>
              <div className="text-[11px] font-mono text-slate-600 bg-white/80 p-2 rounded-lg border border-indigo-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span>rahul.sharma@enterprise-demo.com</span>
                <span className="text-slate-400 font-sans sm:border-l sm:border-slate-200 sm:pl-2">Pass: password123</span>
              </div>
            </div>
          )}

          {/* ===================== LOGIN FORM ===================== */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-email-input"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. rahul.sharma@enterprise-demo.com"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        "Demo helper: You can use 'password123' or the password specified during Sign Up."
                      )
                    }
                    className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password-input"
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Remember me for 30 days</span>
                </label>
              </div>

              <button
                id="login-submit-button"
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="pt-3 text-center text-xs text-slate-500">
                Don't have an account yet?{" "}
                <button
                  type="button"
                  onClick={handleSwitchToSignup}
                  className="font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
                >
                  Create an account
                </button>
              </div>
            </form>
          )}

          {/* ===================== SIGNUP FORM ===================== */}
          {mode === "signup" && (
            <form onSubmit={handleSignupSubmit} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-name-input"
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Work Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-email-input"
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Job Role</label>
                  <div className="relative">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-role-input"
                      type="text"
                      value={signupRole}
                      onChange={(e) => setSignupRole(e.target.value)}
                      placeholder="Product Lead"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company</label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-company-input"
                      type="text"
                      value={signupCompany}
                      onChange={(e) => setSignupCompany(e.target.value)}
                      placeholder="Enterprise Corp"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-password-input"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-confirm-password-input"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="Re-type password"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                By creating an account, you will register your profile. You will be redirected to the Login page to authenticate.
              </div>

              <button
                id="signup-submit-button"
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Registering Account...
                  </span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => handleSwitchToLogin()}
                  className="font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
                >
                  Log in
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200/80 bg-white">
        FeedbackAI &bull; Enterprise NLP & Customer Sentiment Analyzer &bull; Capstone Project
      </footer>
    </div>
  );
};
