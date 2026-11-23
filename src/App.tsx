import React, { useState, useEffect, useCallback } from "react";
import { FeedbackItem, InsightItem, UserProfile } from "./types";
import { INITIAL_FEEDBACKS, INITIAL_INSIGHTS } from "./data/demoData";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { LandingPage } from "./components/LandingPage";
import { AuthPage } from "./components/AuthPage";
import { AuthModal } from "./components/AuthModal";
import { FeedbackDetailModal } from "./components/FeedbackDetailModal";
import { OverviewView } from "./components/OverviewView";
import { AnalyzeFeedbackView } from "./components/AnalyzeFeedbackView";
import { FeedbackTableView } from "./components/FeedbackTableView";
import { AnalyticsView } from "./components/AnalyticsView";
import { AiInsightsView } from "./components/AiInsightsView";
import { ReportsView } from "./components/ReportsView";
import { SettingsView } from "./components/SettingsView";
import { getSession, clearSession, setSession } from "./services/auth";
import { CheckCircle2, X } from "lucide-react";

export default function App() {
  // Session / Authentication State
  const [session, setSessionState] = useState<{ token: string | null; user: UserProfile | null }>(() => {
    const s = getSession();
    return s ? s : { token: null, user: null };
  });

  const isAuthenticated = Boolean(session.token && session.user);

  // Screen Navigation State: "landing" | "auth" | "app"
  const [currentScreen, setCurrentScreen] = useState<"landing" | "auth" | "app">("landing");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authNotice, setAuthNotice] = useState<{
    type: "success" | "warning" | "error";
    message: string;
  } | null>(null);

  // Active view inside the protected app
  const [activeView, setActiveView] = useState<string>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Login Success Toast
  const [loginSuccessToast, setLoginSuccessToast] = useState<string | null>(null);

  // Auth modal fallback
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalInitialMode, setModalInitialMode] = useState<"login" | "signup">("login");

  // Data State
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(INITIAL_FEEDBACKS);
  const [insights, setInsights] = useState<InsightItem[]>(INITIAL_INSIGHTS);
  const [selectedFeedbackForModal, setSelectedFeedbackForModal] = useState<FeedbackItem | null>(null);
  const [tableSearchQuery, setTableSearchQuery] = useState("");

  // Guard protected navigation: if unauthenticated, redirect to Login Page with notice
  const requireAuth = useCallback((targetAction?: () => void) => {
    const current = getSession();
    if (!current || !current.token || !current.user) {
      setAuthNotice({
        type: "warning",
        message: "Please log in to continue.",
      });
      setAuthMode("login");
      setCurrentScreen("auth");
      window.history.pushState({ screen: "login" }, "", "#login");
      return false;
    }
    if (targetAction) {
      targetAction();
    }
    return true;
  }, []);

  // Listen to browser Back/Forward buttons to protect routes
  useEffect(() => {
    const handlePopState = () => {
      const current = getSession();
      if (!current || !current.token || !current.user) {
        // Prevent access to protected pages via browser Back button after logout
        if (currentScreen === "app") {
          setCurrentScreen("auth");
          setAuthMode("login");
          setAuthNotice({
            type: "warning",
            message: "Please log in to continue.",
          });
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentScreen]);

  // Check URL hash on initial load
  useEffect(() => {
    const hash = window.location.hash.toLowerCase();
    const protectedHashes = [
      "#overview",
      "#dashboard",
      "#analyze",
      "#feedback",
      "#analytics",
      "#insights",
      "#reports",
      "#settings",
    ];

    if (hash === "#login") {
      setCurrentScreen("auth");
      setAuthMode("login");
    } else if (hash === "#signup") {
      setCurrentScreen("auth");
      setAuthMode("signup");
    } else if (protectedHashes.includes(hash)) {
      const current = getSession();
      if (!current || !current.token || !current.user) {
        setCurrentScreen("auth");
        setAuthMode("login");
        setAuthNotice({
          type: "warning",
          message: "Please log in to continue.",
        });
      } else {
        setCurrentScreen("app");
        const cleanView = hash.replace("#", "");
        setActiveView(cleanView === "dashboard" ? "overview" : cleanView);
      }
    }
  }, []);

  // Handlers for Authentication
  const handleOpenAuth = (mode: "login" | "signup" = "login", notice?: string) => {
    setAuthMode(mode);
    if (notice) {
      setAuthNotice({ type: "warning", message: notice });
    } else {
      setAuthNotice(null);
    }
    setCurrentScreen("auth");
    window.history.pushState({ screen: mode }, "", `#${mode}`);
  };

  const handleLoginSuccess = (loggedInUser: UserProfile, token: string) => {
    setSessionState({ token, user: loggedInUser });
    setSession(token, loggedInUser);
    setAuthNotice(null);
    setCurrentScreen("app");
    setActiveView("overview");
    setLoginSuccessToast("Login successful. Welcome back!");
    window.history.pushState({ screen: "dashboard" }, "", "#overview");

    // Auto-dismiss toast after 6 seconds
    setTimeout(() => {
      setLoginSuccessToast(null);
    }, 6000);
  };

  // Logout destroys session, redirects to login, prevents back navigation
  const handleLogout = () => {
    clearSession();
    setSessionState({ token: null, user: null });
    setLoginSuccessToast(null);
    setAuthNotice({
      type: "warning",
      message: "Please log in to continue.",
    });
    setAuthMode("login");
    setCurrentScreen("auth");

    // Replace history entry to prevent back-button navigation to protected dashboard
    window.history.replaceState({ screen: "login" }, "", "#login");
  };

  // Protected actions from Landing Page
  const handleEnterDashboard = () => {
    if (requireAuth()) {
      setCurrentScreen("app");
      setActiveView("overview");
      window.history.pushState({ screen: "dashboard" }, "", "#overview");
    }
  };

  const handleQuickAnalyze = () => {
    if (requireAuth()) {
      setCurrentScreen("app");
      setActiveView("analyze");
      window.history.pushState({ screen: "analyze" }, "", "#analyze");
    }
  };

  const handleAddSingleFeedback = (newFeedback: FeedbackItem) => {
    setFeedbacks((prev) => [newFeedback, ...prev]);
  };

  const handleAddBatchFeedbacks = (batch: FeedbackItem[]) => {
    setFeedbacks((prev) => [...batch, ...prev]);
  };

  const handleQuickSearch = (query: string) => {
    setTableSearchQuery(query);
    setActiveView("feedback");
  };

  const handleFilterByKeyword = (keyword: string) => {
    setTableSearchQuery(keyword);
    setActiveView("feedback");
  };

  const handleFilterByTopic = (topic: string) => {
    setTableSearchQuery(topic);
    setActiveView("feedback");
  };

  // Render view router inside protected dashboard
  const renderActiveDashboardView = () => {
    // Protected guard check
    if (!session.token || !session.user) {
      return (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-700">Please log in to continue.</p>
        </div>
      );
    }

    switch (activeView) {
      case "overview":
        return (
          <OverviewView
            feedbacks={feedbacks}
            insights={insights}
            onSelectFeedback={(item) => setSelectedFeedbackForModal(item)}
            onNavigate={(view) => {
              setActiveView(view);
              window.history.pushState({ screen: view }, "", `#${view}`);
            }}
          />
        );
      case "analyze":
        return (
          <AnalyzeFeedbackView
            onAddFeedback={handleAddSingleFeedback}
            onAddBatchFeedbacks={handleAddBatchFeedbacks}
            onNavigateToFeedbackTable={() => {
              setActiveView("feedback");
              window.history.pushState({ screen: "feedback" }, "", "#feedback");
            }}
          />
        );
      case "feedback":
        return (
          <FeedbackTableView
            feedbacks={feedbacks}
            onSelectFeedback={(item) => setSelectedFeedbackForModal(item)}
            initialSearchQuery={tableSearchQuery}
          />
        );
      case "analytics":
        return (
          <AnalyticsView
            feedbacks={feedbacks}
            onFilterByKeyword={handleFilterByKeyword}
            onFilterByTopic={handleFilterByTopic}
          />
        );
      case "insights":
        return (
          <AiInsightsView
            insights={insights}
            onRefreshInsights={(newInsights) => setInsights(newInsights)}
          />
        );
      case "reports":
        return (
          <ReportsView
            feedbacks={feedbacks}
            insights={insights}
          />
        );
      case "settings":
        return (
          <SettingsView
            user={session.user}
            onUpdateUser={(updated) => {
              setSessionState((prev) => ({ ...prev, user: updated }));
              if (session.token) {
                setSession(session.token, updated);
              }
            }}
            onLogout={handleLogout}
          />
        );
      default:
        return (
          <OverviewView
            feedbacks={feedbacks}
            insights={insights}
            onSelectFeedback={(item) => setSelectedFeedbackForModal(item)}
            onNavigate={(view) => {
              setActiveView(view);
              window.history.pushState({ screen: view }, "", `#${view}`);
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {currentScreen === "landing" ? (
        <LandingPage
          isAuthenticated={isAuthenticated}
          onOpenAuth={handleOpenAuth}
          onEnterDashboard={handleEnterDashboard}
          onQuickAnalyze={handleQuickAnalyze}
        />
      ) : currentScreen === "auth" ? (
        <AuthPage
          initialMode={authMode}
          initialNotice={authNotice}
          onLoginSuccess={handleLoginSuccess}
          onGoToLanding={() => {
            setCurrentScreen("landing");
            setAuthNotice(null);
            window.history.pushState({ screen: "landing" }, "", "/");
          }}
        />
      ) : (
        <div className="min-h-screen flex flex-col">
          {/* Topbar */}
          <Header
            user={session.user}
            activeView={activeView}
            onNavigate={(view) => {
              setActiveView(view);
              window.history.pushState({ screen: view }, "", `#${view}`);
            }}
            onOpenAuth={() => handleOpenAuth("login")}
            onLogout={handleLogout}
            onGoToLanding={() => {
              setCurrentScreen("landing");
              window.history.pushState({ screen: "landing" }, "", "/");
            }}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
            onQuickSearch={handleQuickSearch}
          />

          {/* Body with Sidebar and Main Content */}
          <div className="flex-1 flex">
            <Sidebar
              activeView={activeView}
              onNavigate={(view) => {
                setActiveView(view);
                setIsSidebarOpen(false);
                window.history.pushState({ screen: view }, "", `#${view}`);
              }}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              feedbackCount={feedbacks.length}
              onLogout={handleLogout}
            />

            {/* Main Content Area */}
            <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {/* Login Success Notification */}
              {loginSuccessToast && (
                <div
                  id="login-success-toast"
                  className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2 duration-300"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold">Login successful. Welcome back!</span>
                      <span className="hidden sm:inline text-emerald-700 ml-1.5 font-normal">
                        Your session is authenticated. You have full access to analysis and reporting tools.
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setLoginSuccessToast(null)}
                    className="p-1 text-emerald-700 hover:text-emerald-900 rounded-md hover:bg-emerald-500/10 transition-colors"
                    aria-label="Dismiss message"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {renderActiveDashboardView()}
            </main>
          </div>
        </div>
      )}

      {/* Auth Modal (Optional quick access) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={modalInitialMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Feedback Detail Modal */}
      <FeedbackDetailModal
        feedback={selectedFeedbackForModal}
        allFeedbacks={feedbacks}
        onClose={() => setSelectedFeedbackForModal(null)}
        onSelectFeedback={(item) => setSelectedFeedbackForModal(item)}
      />
    </div>
  );
}
