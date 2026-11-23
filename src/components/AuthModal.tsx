import React, { useState, useEffect } from "react";
import { UserProfile } from "../types";
import { registerUser, authenticateUser, setSession } from "../services/auth";
import { X, Lock, Mail, User, ShieldCheck, Sparkles, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  initialMode?: "login" | "signup";
  initialNotice?: string | null;
  onClose: () => void;
  onSuccess: (user: UserProfile, token: string) => void;
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  initialMode = "login",
  initialNotice = null,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(initialNotice);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setSuccessMsg(initialNotice || null);
      setError(null);
    }
  }, [isOpen, initialMode, initialNotice]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // SIGNUP FLOW
    if (mode === "signup") {
      // 1. Validate all fields
      if (!name.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
        setError("Please enter a valid email address.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        // 2. Create the user account
        const reg = registerUser({
          name: name.trim(),
          email: email.trim(),
          password,
        });

        setIsLoading(false);

        if (!reg.success) {
          setError(reg.error || "Failed to create account.");
          return;
        }

        const registeredEmail = email.trim();

        // 4. Clear the signup form
        setName("");
        setPassword("");
        setConfirmPassword("");

        // 5. Redirect the user to the Login page / tab
        // 6. DO NOT create an authenticated session automatically
        // 7. DO NOT redirect directly to the Dashboard
        setMode("login");
        setEmail(registeredEmail);

        // 3. Show a success message: “Account created successfully! Please log in to continue.”
        setSuccessMsg("Account created successfully! Please log in to continue.");
      }, 400);
      return;
    }

    // LOGIN FLOW
    if (!email.trim() || !password) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const auth = authenticateUser(email.trim(), password);
      setIsLoading(false);

      if (!auth.success || !auth.user || !auth.token) {
        // INVALID LOGIN: "Invalid email or password. Please try again."
        setError("Invalid email or password. Please try again.");
        return;
      }

      // Valid credentials -> Authenticate user, create login session/token, redirect to Dashboard
      setSession(auth.token, auth.user);
      onSuccess(auth.user, auth.token);
      onClose();
    }, 400);
  };

  const handleQuickDemoFill = () => {
    setError(null);
    setSuccessMsg(null);
    setEmail("rahul.sharma@enterprise-demo.com");
    setPassword("password123");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="auth-modal"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8"
      >
        <button
          id="auth-modal-close"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo and title */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {mode === "login" ? "Sign In to Account" : "Create Enterprise Account"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {mode === "login"
              ? "Access your AI feedback intelligence dashboard"
              : "Register to start analyzing customer sentiment"}
          </p>
        </div>

        {/* Demo login shortcut banner */}
        {mode === "login" && (
          <div className="mt-4 p-3 rounded-xl bg-indigo-50/80 border border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-xs font-semibold text-indigo-950">Evaluation Credentials</span>
            </div>
            <button
              id="demo-login-fill-btn"
              type="button"
              onClick={handleQuickDemoFill}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2 flex items-center gap-1"
            >
              Fill Demo User <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Mode switcher tabs */}
        <div className="mt-4 grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
          <button
            id="auth-tab-login"
            type="button"
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
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
            onClick={() => {
              setMode("signup");
              setError(null);
              setSuccessMsg(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === "signup"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Success message */}
        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="auth-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="auth-password-input"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-confirm-password-input"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          )}

          {mode === "login" && (
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  id="remember-me-checkbox"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => alert("Simulation: Use password 'password123' or your registered password.")}
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            id="auth-submit-button"
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : mode === "login" ? (
              "Login"
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
