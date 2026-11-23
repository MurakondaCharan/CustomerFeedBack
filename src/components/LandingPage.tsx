import React from "react";
import {
  Sparkles,
  ArrowRight,
  BarChart3,
  MessageSquare,
  FileText,
  TrendingUp,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Cpu,
  Layers,
  Search,
  Upload,
  PieChart,
  Brain,
  Award,
  BookOpen,
} from "lucide-react";

interface Props {
  isAuthenticated: boolean;
  onOpenAuth: (mode?: "login" | "signup", notice?: string) => void;
  onEnterDashboard: () => void;
  onQuickAnalyze: () => void;
}

export const LandingPage: React.FC<Props> = ({
  isAuthenticated,
  onOpenAuth,
  onEnterDashboard,
  onQuickAnalyze,
}) => {
  const handleProtectedAction = (action: () => void) => {
    if (isAuthenticated) {
      action();
    } else {
      onOpenAuth("login", "Please log in to continue.");
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Sticky Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                Feedback<span className="text-indigo-600">AI</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                Capstone SaaS
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#problems" className="hover:text-indigo-600 transition-colors">The Challenge</a>
            <a href="#solution" className="hover:text-indigo-600 transition-colors">NLP Pipeline</a>
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#capstone" className="hover:text-indigo-600 transition-colors">About Project</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="landing-login-btn"
              onClick={() => onOpenAuth("login")}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Sign In
            </button>
            <button
              id="landing-signup-btn"
              onClick={() => onOpenAuth("signup")}
              className="px-3.5 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/80 text-indigo-700 text-xs font-bold transition-colors hidden sm:inline-block"
            >
              Sign Up
            </button>
            <button
              id="landing-enter-dashboard-btn"
              onClick={() => handleProtectedAction(onEnterDashboard)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-200 transition-all flex items-center gap-1.5"
            >
              Launch Dashboard
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/60 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                <span>AI-Powered Customer Intelligence</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Turn Customer Feedback Into{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                  Actionable Insights
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Analyze thousands of customer reviews with AI-powered sentiment analysis,
                keyword extraction, and intelligent insights.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <button
                  id="hero-analyze-feedback-btn"
                  onClick={() => handleProtectedAction(onQuickAnalyze)}
                  className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center gap-2 group"
                >
                  <Zap className="w-4 h-4 text-indigo-200 group-hover:scale-110 transition-transform" />
                  Analyze Feedback
                </button>
                <button
                  id="hero-explore-dashboard-btn"
                  onClick={() => handleProtectedAction(onEnterDashboard)}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold border border-slate-300 shadow-xs hover:border-slate-400 transition-all flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4 text-slate-500" />
                  Explore Dashboard
                </button>
              </div>

              {/* Trust & Proof points */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-lg">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">12,400+</div>
                  <div className="text-xs font-medium text-slate-500 mt-0.5">Reviews Processed</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-indigo-600">96.4%</div>
                  <div className="text-xs font-medium text-slate-500 mt-0.5">NLP Accuracy</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-600">&lt; 1.2s</div>
                  <div className="text-xs font-medium text-slate-500 mt-0.5">Real-time Latency</div>
                </div>
              </div>
            </div>

            {/* Right Visual SaaS Mockup */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative background glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-20 transform -rotate-1" />

                {/* Main Card Mockup */}
                <div className="relative rounded-2xl bg-white border border-slate-200 shadow-xl p-5 sm:p-6 space-y-4">
                  {/* Mockup Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                      <span className="text-[11px] font-semibold text-slate-400 ml-2">Live AI Telemetry</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active Stream
                    </span>
                  </div>

                  {/* Sentiment Bar Distribution */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                      <span>Sentiment Distribution</span>
                      <span className="text-indigo-600">12,458 Reviews</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-slate-100 flex overflow-hidden p-0.5 gap-0.5">
                      <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: "63%" }} title="63% Positive" />
                      <div className="h-full bg-amber-400" style={{ width: "20%" }} title="20% Neutral" />
                      <div className="h-full bg-rose-500 rounded-r-full" style={{ width: "17%" }} title="17% Negative" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-medium">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Positive (63%)
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-400" /> Neutral (20%)
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500" /> Negative (17%)
                      </span>
                    </div>
                  </div>

                  {/* CSAT & Volume Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[11px] font-semibold text-slate-400">Customer Satisfaction</div>
                      <div className="text-xl font-extrabold text-slate-900 mt-0.5">84.2% CSAT</div>
                      <div className="text-[10px] text-emerald-600 font-bold mt-1">↑ 4.1% this quarter</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[11px] font-semibold text-slate-400">Feedback Velocity</div>
                      <div className="text-xl font-extrabold text-slate-900 mt-0.5">+412 / day</div>
                      <div className="text-[10px] text-indigo-600 font-bold mt-1">↑ 12.5% increase</div>
                    </div>
                  </div>

                  {/* Trending Topics */}
                  <div>
                    <div className="text-xs font-bold text-slate-700 mb-2">Top Detected Topics</div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-700">Product Quality</span>
                        <span className="text-slate-500 font-medium">34%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: "34%" }} />
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="font-semibold text-slate-700">Delivery & Logistics</span>
                        <span className="text-slate-500 font-medium">22%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-violet-500 h-full rounded-full" style={{ width: "22%" }} />
                      </div>
                    </div>
                  </div>

                  {/* Live AI-generated insight chip */}
                  <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 text-xs">
                    <div className="flex items-center gap-1.5 text-indigo-900 font-bold mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      AI Live Insight
                    </div>
                    <p className="text-slate-700 leading-snug text-[11px]">
                      "Delivery speed praise surged by 18%, while customer support complaints reflect peak response wait times."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problems" className="py-20 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Customer feedback is everywhere. Understanding it shouldn't be.
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-3">
              Modern enterprises receive hundreds of reviews daily across app stores, emails, and support tickets.
              Traditional manual inspection fails to keep pace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all hover:shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Thousands of Reviews</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Businesses receive more feedback than teams can manually analyze, creating insurmountable backlogs.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all hover:shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-sm mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Hidden Customer Sentiment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Important customer opinions and emotional nuances are buried inside massive walls of unstructured text.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all hover:shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Slow Manual Analysis</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reading, tagging, and categorizing every review takes excessive human hours with inconsistent accuracy.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all hover:shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm mb-4">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Missed Business Insights</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Critical recurring complaints, churn triggers, and urgent trends remain unnoticed until revenue is impacted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section (Visual Process) */}
      <section id="solution" className="py-20 bg-slate-50/70 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">The Solution</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              From Raw Feedback to Business Insights
            </h2>
            <p className="text-slate-500 text-sm mt-3">
              The platform automatically converts noisy, unstructured customer feedback into structured, quantifiable business decisions.
            </p>
          </div>

          {/* Visual Process Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 relative">
            {[
              {
                step: "01",
                title: "Customer Feedback",
                desc: "Raw text from reviews, support tickets, & surveys",
                icon: MessageSquare,
                color: "text-slate-700 bg-slate-100",
              },
              {
                step: "02",
                title: "AI/NLP Processing",
                desc: "Tokenization, stopword filtering, & syntax parsing",
                icon: Cpu,
                color: "text-indigo-600 bg-indigo-50",
              },
              {
                step: "03",
                title: "Sentiment Analysis",
                desc: "Positive, Negative, & Neutral classification",
                icon: PieChart,
                color: "text-emerald-600 bg-emerald-50",
              },
              {
                step: "04",
                title: "Keyword & Topics",
                desc: "Extracting recurring themes & domain categories",
                icon: Search,
                color: "text-violet-600 bg-violet-50",
              },
              {
                step: "05",
                title: "AI Insights",
                desc: "Natural-language executive trend summaries",
                icon: Sparkles,
                color: "text-amber-600 bg-amber-50",
              },
              {
                step: "06",
                title: "Business Decisions",
                desc: "Prioritized recommendations & tactical action items",
                icon: TrendingUp,
                color: "text-blue-600 bg-blue-50",
              },
            ].map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${p.color}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                        {p.step}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1">{p.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Enterprise Capabilities</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Core Platform Features
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Engineered with advanced Natural Language Processing to unlock immediate business intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <PieChart className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Sentiment Analysis</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Classify individual comments or thousands of reviews as Positive, Negative, or Neutral with statistical confidence percentages.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md w-fit">
                <CheckCircle2 className="w-3.5 h-3.5" /> High Precision Confidence Scoring
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Keyword Extraction</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Identify frequently mentioned and critical keywords from customer feedback with term frequency & sentiment tagging.
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {["Quality", "Delivery", "Price", "Support"].map((k) => (
                  <span key={k} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    #{k}
                  </span>
                ))}
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Topic Detection</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Automatically categorize feedback into key business verticals: Product Quality, Delivery, Pricing, Customer Support, and UX.
              </p>
              <div className="text-[11px] font-semibold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-md w-fit">
                6 Domain Pre-Trained Classifiers
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">AI Insights</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Generate concise, natural-language executive summaries outlining emerging trends, customer pain points, and recommended actions.
              </p>
              <div className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md w-fit">
                Synthesized Executive Narratives
              </div>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Bulk Feedback Analysis</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Upload CSV files containing customer reviews and process large datasets through parallel NLP analysis pipelines with drag-and-drop.
              </p>
              <div className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md w-fit">
                Drag-and-Drop CSV Ingestion
              </div>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Interactive Analytics</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Explore real-time dashboards with responsive donut, bar, and trend charts. Filter by 7 Days, 30 Days, 3 Months, or 1 Year.
              </p>
              <div className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md w-fit">
                Dynamic Time Horizon Visuals
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capstone Project Section */}
      <section id="capstone" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              Final-Year Engineering Capstone Project
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Academic Rigor Meets Enterprise Engineering
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              “AI Customer Feedback Analyzer is a final-year capstone project that demonstrates how Artificial Intelligence and Natural Language Processing can transform unstructured customer feedback into meaningful, actionable business insights.”
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { title: "Artificial Intelligence", desc: "LLM synthesis & classification" },
              { title: "Natural Language Processing", desc: "Tokenization & sentiment analysis" },
              { title: "Data Analytics", desc: "Aggregation & CSAT computation" },
              { title: "Full-Stack Development", desc: "React, Express, & TypeScript" },
              { title: "Data Visualization", desc: "Recharts interactive diagrams" },
              { title: "Business Intelligence", desc: "Automated executive reporting" },
            ].map((pillar, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center flex flex-col justify-between"
              >
                <div className="text-xs font-bold text-indigo-300 mb-1">{pillar.title}</div>
                <div className="text-[11px] text-slate-400">{pillar.desc}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => handleProtectedAction(onEnterDashboard)}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all inline-flex items-center gap-2"
            >
              Experience the Live Application <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-white border-t border-slate-200 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              AI
            </div>
            <span className="font-bold text-slate-800">AI Customer Feedback Analyzer</span>
            <span className="text-slate-300">|</span>
            <span>Final-Year Capstone Project</span>
          </div>

          <div className="flex items-center gap-5 sm:gap-6">
            <button onClick={() => handleProtectedAction(onEnterDashboard)} className="hover:text-indigo-600 transition-colors">
              Live Dashboard
            </button>
            <button onClick={() => handleProtectedAction(onQuickAnalyze)} className="hover:text-indigo-600 transition-colors">
              Analyze Feedback
            </button>
            <button onClick={() => onOpenAuth("login")} className="hover:text-indigo-600 transition-colors">
              Sign In
            </button>
            <button onClick={() => onOpenAuth("signup")} className="hover:text-indigo-600 font-semibold transition-colors">
              Sign Up
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
