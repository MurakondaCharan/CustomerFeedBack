import React, { useState } from "react";
import { UserProfile } from "../types";
import {
  Settings,
  User,
  Sliders,
  Bell,
  Cpu,
  GraduationCap,
  ShieldCheck,
  Check,
  Save,
  LogOut,
} from "lucide-react";

interface Props {
  user: UserProfile | null;
  onUpdateUser: (user: UserProfile) => void;
  onLogout?: () => void;
}

export const SettingsView: React.FC<Props> = ({ user, onUpdateUser, onLogout }) => {
  const [name, setName] = useState(user?.name || "Rahul Sharma");
  const [email, setEmail] = useState(user?.email || "rahul.sharma@enterprise-demo.com");
  const [role, setRole] = useState(user?.role || "Head of Customer Experience");
  const [company, setCompany] = useState(user?.company || "Global Commerce Ltd.");

  // Model and analysis preferences
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  const [autoTagComplaints, setAutoTagComplaints] = useState(true);
  const [emailSpikeAlerts, setEmailSpikeAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [activeModel, setActiveModel] = useState("gemini-2.5-flash");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      email,
      role,
      company,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          System & Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure NLP confidence criteria, user credentials, and academic capstone parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <User className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">User Profile Information</h2>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Job Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                {savedSuccess && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Profile saved successfully
                  </span>
                )}
                <button
                  type="submit"
                  className="ml-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* AI NLP Pipeline Preferences */}
          <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">AI / NLP Model Configuration</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Active Reasoning Model
                </label>
                <select
                  value={activeModel}
                  onChange={(e) => setActiveModel(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultra Fast, High Accuracy - Default)</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Reasoning & Semantic Extraction)</option>
                  <option value="heuristic-nlp">Local Rule-Based Heuristic NLP (Offline fallback)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                  <span>Confidence Score Threshold</span>
                  <span className="text-indigo-600 font-bold">{confidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Reviews with confidence below this threshold will be flagged for human review.
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-3">
                <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoTagComplaints}
                    onChange={(e) => setAutoTagComplaints(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Automatically tag high-severity customer complaints as "Escalated"</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailSpikeAlerts}
                    onChange={(e) => setEmailSpikeAlerts(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Dispatch real-time email alerts when negative sentiment exceeds 25%</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Capstone Project Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 sm:p-6 bg-slate-900 text-white rounded-2xl shadow-md space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              <div>
                <h2 className="text-sm font-bold text-slate-100">Academic Capstone Metadata</h2>
                <div className="text-[10px] text-indigo-300">Final-Year B.Tech / M.Tech Presentation</div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Project Name</span>
                <span className="font-bold text-slate-100">AI Customer Feedback Analyzer</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Primary Domain</span>
                <span className="text-slate-200">Artificial Intelligence & Natural Language Processing (NLP)</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Core Objective</span>
                <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5">
                  Convert voluminous, unstructured multi-channel customer feedback into quantifiable sentiment metrics, topical vectors, and proactive executive actions.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1.5">Technology Stack</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "React 18",
                    "TypeScript",
                    "Vite",
                    "Tailwind CSS",
                    "Recharts",
                    "Express.js",
                    "Node.js",
                    "Google Gemini API",
                    "Lucide Icons",
                  ].map((tech) => (
                    <span key={tech} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-indigo-200 border border-slate-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-emerald-400 font-semibold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Ready for Academic Viva & Defense
                </span>
                <span className="font-mono text-[10px] text-slate-400">Score: A+</span>
              </div>
            </div>
          </div>

          {/* Account Session & Logout Card */}
          {onLogout && (
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Account Session</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ending your session will remove active authentication tokens and require logging in again to access protected views.
              </p>
              <button
                type="button"
                id="settings-logout-btn"
                onClick={onLogout}
                className="w-full py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout from FeedbackAI</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
