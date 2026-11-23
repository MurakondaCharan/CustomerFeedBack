import React, { useState } from "react";
import { FeedbackItem } from "../types";
import { SENTIMENT_TRENDS, KEYWORDS_DATA, TOPICS_DATA } from "../data/demoData";
import {
  BarChart2,
  PieChart as PieChartIcon,
  Tag,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

interface Props {
  feedbacks: FeedbackItem[];
  onFilterByKeyword: (keyword: string) => void;
  onFilterByTopic: (topic: string) => void;
}

export const AnalyticsView: React.FC<Props> = ({
  feedbacks,
  onFilterByKeyword,
  onFilterByTopic,
}) => {
  const [timeRange, setTimeRange] = useState<"7 Days" | "30 Days" | "3 Months" | "1 Year">("30 Days");
  const [activeSubTab, setActiveSubTab] = useState<"sentiment" | "topics" | "keywords">("sentiment");

  const trends = SENTIMENT_TRENDS[timeRange];

  const donutData = [
    { name: "Positive", value: 63, color: "#10b981" },
    { name: "Neutral", value: 20, color: "#fbbf24" },
    { name: "Negative", value: 17, color: "#f43f5e" },
  ];

  // Topic sentiment comparison data
  const topicSentimentData = [
    { name: "Product Quality", positive: 78, negative: 12, neutral: 10 },
    { name: "Delivery", positive: 54, negative: 32, neutral: 14 },
    { name: "Support", positive: 42, negative: 46, neutral: 12 },
    { name: "Pricing", positive: 48, negative: 38, neutral: 14 },
    { name: "User Exp.", positive: 70, negative: 15, neutral: 15 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Customer Analytics & NLP Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Deep dive into sentiment dynamics, topic prevalence, and keyword frequency vectors.
          </p>
        </div>

        {/* Time horizon pill */}
        <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-xs self-start sm:self-auto">
          {(["7 Days", "30 Days", "3 Months", "1 Year"] as const).map((range) => (
            <button
              key={range}
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

      {/* Sub tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab("sentiment")}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeSubTab === "sentiment"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <PieChartIcon className="w-4 h-4" />
          Sentiment Analytics
        </button>
        <button
          onClick={() => setActiveSubTab("topics")}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeSubTab === "topics"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Layers className="w-4 h-4" />
          Topic Breakdown
        </button>
        <button
          onClick={() => setActiveSubTab("keywords")}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeSubTab === "keywords"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Tag className="w-4 h-4" />
          Keyword Frequency
        </button>
      </div>

      {/* TAB 1: SENTIMENT ANALYTICS */}
      {activeSubTab === "sentiment" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Donut Chart */}
            <div className="lg:col-span-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Sentiment Donut Distribution</h3>
                <p className="text-xs text-slate-500">Overall ratio for {timeRange.toLowerCase()}</p>

                <div className="h-56 w-full mt-3 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {donutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val) => [`${val}%`, "Proportion"]}
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          borderRadius: "12px",
                          border: "1px solid #e2e8f0",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-slate-900">84%</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Pos+Neu</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <div className="text-[10px] font-bold text-emerald-700">Positive</div>
                  <div className="text-base font-extrabold text-emerald-900">63%</div>
                </div>
                <div className="p-2 bg-amber-50 rounded-xl">
                  <div className="text-[10px] font-bold text-amber-700">Neutral</div>
                  <div className="text-base font-extrabold text-amber-900">20%</div>
                </div>
                <div className="p-2 bg-rose-50 rounded-xl">
                  <div className="text-[10px] font-bold text-rose-700">Negative</div>
                  <div className="text-base font-extrabold text-rose-900">17%</div>
                </div>
              </div>
            </div>

            {/* Line Chart */}
            <div className="lg:col-span-8 p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Sentiment Trajectory ({timeRange})</h3>
                  <p className="text-xs text-slate-500">Longitudinal sentiment shift comparison</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="text-emerald-600 flex items-center gap-1">● Positive</span>
                  <span className="text-amber-500 flex items-center gap-1">● Neutral</span>
                  <span className="text-rose-500 flex items-center gap-1">● Negative</span>
                </div>
              </div>

              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Positive %" />
                    <Line type="monotone" dataKey="neutral" stroke="#fbbf24" strokeWidth={2.5} dot={{ r: 3 }} name="Neutral %" />
                    <Line type="monotone" dataKey="negative" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} name="Negative %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOPIC BREAKDOWN */}
      {activeSubTab === "topics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Topic Share Bar Chart */}
            <div className="lg:col-span-6 p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Topic Distribution Volume</h3>
              <p className="text-xs text-slate-500 mb-4">Percentage of total feedback pool by vertical</p>

              <div className="space-y-3.5">
                {TOPICS_DATA.map((t, idx) => (
                  <div
                    key={idx}
                    onClick={() => onFilterByTopic(t.name)}
                    className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200 group"
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {t.name}
                      </span>
                      <span className="text-indigo-600 font-extrabold">{t.percentage}% ({t.count.toLocaleString()})</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${t.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Topic Sentiment Matrix */}
            <div className="lg:col-span-6 p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Sentiment By Vertical (%)</h3>
              <p className="text-xs text-slate-500 mb-4">Positive vs Negative breakdown per operational department</p>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topicSentimentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                    <Bar dataKey="positive" fill="#10b981" name="Positive %" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="neutral" fill="#fbbf24" name="Neutral %" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="negative" fill="#f43f5e" name="Negative %" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KEYWORD FREQUENCY */}
      {activeSubTab === "keywords" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Top Keywords Ranking */}
            <div className="lg:col-span-7 p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-1">High-Frequency Keywords</h3>
              <p className="text-xs text-slate-500 mb-4">Click any keyword to filter related customer reviews</p>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={KEYWORDS_DATA}
                    layout="vertical"
                    margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis type="category" dataKey="keyword" stroke="#94a3b8" fontSize={11} tickLine={false} width={80} />
                    <Tooltip
                      formatter={(val) => [`${val} mentions`, "Frequency"]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Keyword Interactive Cloud Cards */}
            <div className="lg:col-span-5 p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Keyword Sentiment Valence</h3>
                <p className="text-xs text-slate-500 mb-4">Semantic association with customer sentiment</p>

                <div className="grid grid-cols-2 gap-2.5">
                  {KEYWORDS_DATA.map((kw, i) => (
                    <button
                      key={i}
                      onClick={() => onFilterByKeyword(kw.keyword)}
                      className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 text-left transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
                          #{kw.keyword}
                        </span>
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                            kw.sentiment === "Positive"
                              ? "bg-emerald-50 text-emerald-700"
                              : kw.sentiment === "Negative"
                              ? "bg-rose-50 text-rose-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {kw.sentiment}
                        </span>
                      </div>
                      <div className="mt-2 flex items-baseline justify-between text-[11px] text-slate-500">
                        <span>{kw.count} mentions</span>
                        <span className="text-indigo-600 font-bold group-hover:underline">Filter →</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100 text-xs text-slate-400 italic">
                NLP lemmatization and TF-IDF term weights dynamically updated.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
