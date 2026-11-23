import React, { useState } from "react";
import { InsightItem } from "../types";
import { generateAIInsights } from "../services/api";
import {
  Sparkles,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Compass,
} from "lucide-react";

interface Props {
  insights: InsightItem[];
  onRefreshInsights: (newInsights: InsightItem[]) => void;
}

export const AiInsightsView: React.FC<Props> = ({
  insights,
  onRefreshInsights,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const fresh = await generateAIInsights();
      onRefreshInsights(fresh);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const getImpactBadge = (impact: "High" | "Medium" | "Low") => {
    switch (impact) {
      case "High":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> High Impact
          </span>
        );
      case "Medium":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            Medium Impact
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
            Low Impact
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Executive Intelligence
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            AI-Generated Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Automated synthesis extracting cross-channel customer pain points and revenue growth signals.
          </p>
        </div>

        <button
          id="generate-new-insights-btn"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all flex items-center gap-2 disabled:opacity-70 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
          {isGenerating ? "Synthesizing with Gemini..." : "Generate New Insights"}
        </button>
      </div>

      {/* Strategic Summary Box */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-[10px] font-bold border border-indigo-400/30">
              Bi-Weekly Executive Digest
            </span>
            <span className="text-xs text-slate-400">Target Resolution: Sprint 42</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black">
            Customer Sentiment Index stands at 84.2% CSAT
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            Product quality and unboxing presentation are driving 78% of 5-star reviews. However, support ticket wait times have created a negative sentiment pocket in customer service that warrants immediate automated ticket triage.
          </p>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item) => (
          <div
            key={item.id}
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                {getImpactBadge(item.impact)}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    (item.category || item.topic).includes("Product")
                      ? "bg-blue-50 text-blue-700 border border-blue-100"
                      : (item.category || item.topic).includes("Support")
                      ? "bg-rose-50 text-rose-700 border border-rose-100"
                      : (item.category || item.topic).includes("Pricing")
                      ? "bg-amber-50 text-amber-700 border border-amber-100"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  }`}
                >
                  {item.category || item.topic}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description || item.trend}
              </p>

              {item.metric && (
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50/70 px-3 py-1.5 rounded-xl border border-indigo-100/80 w-fit">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Metric Signal: {item.metric}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Recommended Strategy:</span>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {item.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
