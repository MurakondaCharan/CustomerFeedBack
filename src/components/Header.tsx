import React, { useState } from "react";
import { UserProfile } from "../types";
import {
  Sparkles,
  Bell,
  Search,
  Menu,
  X,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";

interface Props {
  user: UserProfile | null;
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onGoToLanding: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onQuickSearch: (query: string) => void;
}

export const Header: React.FC<Props> = ({
  user,
  activeView,
  onNavigate,
  onOpenAuth,
  onLogout,
  onGoToLanding,
  onToggleSidebar,
  isSidebarOpen,
  onQuickSearch,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const notifications = [
    {
      id: 1,
      title: "Batch Analysis Complete",
      desc: "25 customer feedback items processed successfully via NLP.",
      time: "10m ago",
      type: "success",
      icon: CheckCircle2,
    },
    {
      id: 2,
      title: "Support Latency Alert",
      desc: "Negative sentiment in Customer Support increased by 14%.",
      time: "1h ago",
      type: "alert",
      icon: AlertTriangle,
    },
    {
      id: 3,
      title: "Weekly AI Executive Report Ready",
      desc: "Automated analysis report generated for management review.",
      time: "3h ago",
      type: "info",
      icon: FileText,
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onQuickSearch(searchVal.trim());
      onNavigate("feedback");
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Brand */}
      <div className="flex items-center gap-3">
        <button
          id="mobile-sidebar-toggle"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
          aria-label="Toggle navigation menu"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs shadow-indigo-200">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>AI Customer Feedback Analyzer</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Gemini 3.8 Live
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Search input */}
      <div className="hidden md:flex items-center max-w-md w-full mx-6">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search keywords, customer names, or topics..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900"
          />
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Landing Page link */}
        <button
          id="nav-to-landing-btn"
          onClick={onGoToLanding}
          className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="View Landing Page"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Landing Page
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            id="notifications-button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <span className="text-[10px] font-semibold text-indigo-600 cursor-pointer">Mark all as read</span>
              </div>
              <div className="mt-2 space-y-2.5">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div key={n.id} className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-2.5">
                      <div className={`p-1.5 rounded-lg ${n.type === "alert" ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"} shrink-0 mt-0.5`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-800 truncate">{n.title}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{n.desc}</div>
                        <div className="text-[9px] text-slate-400 mt-1">{n.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        {user ? (
          <div className="relative">
            <button
              id="user-profile-menu-button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 pl-2.5 pr-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                {user.name.charAt(0)}
              </div>
              <span className="text-xs font-bold text-slate-800 hidden sm:inline-block max-w-[100px] truncate">
                {user.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in duration-150">
                <div className="p-2.5 border-b border-slate-100">
                  <div className="text-xs font-bold text-slate-900">{user.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                  <div className="text-[10px] text-indigo-600 font-semibold mt-1">{user.role}</div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      onNavigate("settings");
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 font-medium"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Account Settings
                  </button>
                  <button
                    id="header-logout-btn"
                    onClick={() => {
                      onLogout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 font-semibold transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
