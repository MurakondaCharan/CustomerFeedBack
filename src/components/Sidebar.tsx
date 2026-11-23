import React from "react";
import {
  LayoutDashboard,
  Zap,
  MessageSquareText,
  BarChart2,
  Sparkles,
  FileSpreadsheet,
  Settings,
  PlusCircle,
  GraduationCap,
  ChevronRight,
  ShieldCheck,
  LogOut,
} from "lucide-react";

interface Props {
  activeView: string;
  onNavigate: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
  feedbackCount: number;
  onLogout?: () => void;
}

export const Sidebar: React.FC<Props> = ({
  activeView,
  onNavigate,
  isOpen,
  onClose,
  feedbackCount,
  onLogout,
}) => {
  const navItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { id: "analyze", label: "Analyze Feedback", icon: Zap, badge: "AI" },
    { id: "feedback", label: "Feedback", icon: MessageSquareText, badge: `${feedbackCount}` },
    { id: "analytics", label: "Analytics", icon: BarChart2, badge: null },
    { id: "insights", label: "Insights", icon: Sparkles, badge: "5" },
    { id: "reports", label: "Reports", icon: FileSpreadsheet, badge: null },
    { id: "settings", label: "Settings", icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 p-4 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Quick Action Button */}
          <button
            id="sidebar-quick-analyze-btn"
            onClick={() => {
              onNavigate("analyze");
              onClose();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-200 transition-all flex items-center justify-center gap-2 group"
          >
            <PlusCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Analyze New Feedback</span>
          </button>

          {/* Nav items list */}
          <nav className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Platform Views
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-indigo-600" : "text-slate-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? "bg-indigo-200/60 text-indigo-800"
                          : item.badge === "AI"
                          ? "bg-purple-100 text-purple-700 font-extrabold"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {onLogout && (
              <div className="pt-2">
                <button
                  id="sidebar-logout-btn"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </nav>
        </div>

        {/* Capstone Project Stamp Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-500/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-100">Final-Year Capstone</div>
              <div className="text-[9px] text-indigo-300">AI & NLP Engineering</div>
            </div>
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed">
            Enterprise NLP model pipeline with Gemini LLM synthesis and business analytics.
          </p>
          <div className="pt-1 flex items-center justify-between text-[10px] text-indigo-200">
            <span className="flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Production Mode
            </span>
            <span className="font-mono text-[9px] text-slate-400">v2.4-capstone</span>
          </div>
        </div>
      </aside>
    </>
  );
};
