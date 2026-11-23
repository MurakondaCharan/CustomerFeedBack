import React, { useState } from "react";
import { FeedbackItem, InsightItem } from "../types";
import { SENTIMENT_TRENDS, TOPICS_DATA } from "../data/demoData";
import {
  TrendingUp,
  TrendingDown,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  MinusCircle,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Tag,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

interface Props {
  feedbacks: FeedbackItem[];
  insights: InsightItem[];
  onSelectFeedback: (item: FeedbackItem) => void;
  onNavigate: (view: string) => void;
}

export const OverviewView: React.FC<Props> = ({
  feedbacks,
  insights,
  onSelectFeedback,
  onNavigate,
}) => {
  const [timeRange, setTimeRange] = useState<"7 Days" | "30 Days" | "3 Months" | "1 Year">("30 Days");

  // Dynamic counts based on current feedbacks
  const totalFeedbackCount = feedbacks.length > 22 ? 12458 + (feedbacks.length - 22) : 12458;
  const positiveCount = Math.round(totalFeedbackCount * 0.63);
  const negativeCount = Math.round(totalFeedbackCount * 0.17);
  const neutralCount = totalFeedbackCount - positiveCount - negativeCount;

  // Donut chart data
  const donutData = [
    { name: "Positive", value: 63, color: "#10b981" },
    { name: "Neutral", value: 20, color: "#fbbf24" },
    { name: "Negative", value: 17, color: "#f43f5e" },
  ];

  // Bar distribution data
  const barDistributionData = [
    { name: "Positive", count: positiveCount, fill: "#10b981" },
    { name: "Neutral", count: neutralCount, fill: "#fbbf24" },
    { name: "Negative", count: negativeCount, fill: "#f43f5e" },
  ];

  // Trends data
  const trendsData = SENTIMENT_TRENDS[timeRange];

  return (
    <div className="space-y-6">
      {/* Title and Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Customer Feedback Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Understand what your customers are saying across channels in real-time.
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-xs self-start sm:self-auto">
          {(["7 Days", "30 Days", "3 Months", "1 Year"] as const).map((range) => (
            <button
              key={range}
              id={`time-range-${range.replace(/\s+/g, "-").toLowerCase()}`}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                timeRange === range
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Feedback */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Feedback</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {totalFeedbackCount.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>↑ 12.5% from last month</span>
            </div>
          </div>
        </div>

        {/* Card 2: Positive Feedback */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Positive Feedback</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ThumbsUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {positiveCount.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                63%
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>↑ 4.2% positive sentiment growth</span>
            </div>
          </div>
        </div>

        {/* Card 3: Negative Feedback */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-rose-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Negative Feedback</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ThumbsDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {negativeCount.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                17%
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-rose-600">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>↓ 1.8% reduced complaint rate</span>
            </div>
          </div>
        </div>

        {/* Card 4: Neutral Feedback */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-amber-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Neutral Feedback</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <MinusCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {neutralCount.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                20%
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <span>Balanced customer inquiries</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Highlights Banner */}
      {insights.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  Top AI Synthesis
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-semibold border border-emerald-400/30">
                  {insights[0].impact} Impact
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-1">
                {insights[0].title}
              </h3>
              <p className="text-xs text-indigo-200 mt-1 max-w-3xl">
                Recommendation: {insights[0].recommendation}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("insights")}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors shrink-0 flex items-center gap-1.5 self-start sm:self-auto"
          >
            All Insights <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Sentiment Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sentiment Trends Line/Area Chart */}
        <div className="lg:col-span-8 p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sentiment Velocity Over Time</h3>
              <p className="text-xs text-slate-500">
                Tracking positive, neutral, and negative ratio for {timeRange.toLowerCase()}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Positive
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Neutral
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Negative
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Area type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPos)" name="Positive %" />
                <Area type="monotone" dataKey="neutral" stroke="#fbbf24" strokeWidth={2} fillOpacity={0} fill="#fbbf24" name="Neutral %" />
                <Area type="monotone" dataKey="negative" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorNeg)" name="Negative %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Sentiment Composition */}
        <div className="lg:col-span-4 p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Sentiment Breakdown</h3>
            <p className="text-xs text-slate-500">Aggregate customer emotion</p>

            <div className="h-52 w-full mt-2 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`${val}%`, "Share"]}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900">63%</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Positive</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Positive
              </span>
              <span className="font-bold text-slate-900">63% (7,842)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Neutral
              </span>
              <span className="font-bold text-slate-900">20% (2,512)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Negative
              </span>
              <span className="font-bold text-slate-900">17% (2,104)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Topics Breakdown & Recent Feedbacks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Topics Breakdown */}
        <div className="lg:col-span-5 p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Top Detected Topics</h3>
              <p className="text-xs text-slate-500">Distribution by volume percentage</p>
            </div>
            <button
              onClick={() => onNavigate("analytics")}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              View Analytics
            </button>
          </div>

          <div className="space-y-3.5">
            {TOPICS_DATA.map((topic, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>{topic.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px] font-normal">{topic.count.toLocaleString()} reviews</span>
                    <span className="font-bold text-slate-900">{topic.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${topic.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Analyzed Reviews */}
        <div className="lg:col-span-7 p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Customer Reviews</h3>
                <p className="text-xs text-slate-500">Real-time NLP stream from feedback channels</p>
              </div>
              <button
                onClick={() => onNavigate("feedback")}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                Full Table <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {feedbacks.slice(0, 5).map((f) => (
                <div
                  key={f.id}
                  onClick={() => onSelectFeedback(f)}
                  className="p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">{f.customerName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          f.sentiment === "Positive"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : f.sentiment === "Negative"
                            ? "bg-rose-50 text-rose-700 border border-rose-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}
                      >
                        {f.sentiment} ({f.confidence}%)
                      </span>
                      <span className="text-[10px] text-slate-400 hidden sm:inline-block">• {f.createdAt}</span>
                    </div>
                    <p className="text-xs text-slate-600 truncate mt-1">"{f.feedbackText}"</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-slate-400 group-hover:text-indigo-600">
                    <span className="hidden sm:inline-block">Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing latest 5 of {feedbacks.length} verified submissions</span>
            <button
              onClick={() => onNavigate("analyze")}
              className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5" /> Analyze New Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
