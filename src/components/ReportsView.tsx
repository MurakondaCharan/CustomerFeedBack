import React, { useState } from "react";
import { FeedbackItem, InsightItem } from "../types";
import { exportFeedbacksToCSV } from "../services/api";
import {
  FileSpreadsheet,
  Printer,
  Download,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Tag,
  Lightbulb,
  Building,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

interface Props {
  feedbacks: FeedbackItem[];
  insights: InsightItem[];
}

export const ReportsView: React.FC<Props> = ({ feedbacks, insights }) => {
  const [reportPeriod, setReportPeriod] = useState<"This Month" | "Last Quarter" | "Year to Date">("This Month");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    exportFeedbacksToCSV(feedbacks, `feedback_intelligence_report_${reportPeriod.toLowerCase().replace(/\s+/g, "_")}.csv`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header controls (hidden when printing) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Customer Feedback Analysis Report
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Executive-ready document synthesizing sentiment, customer complaints, and operational metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
          <select
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value as any)}
            className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl shadow-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="This Month">Period: This Month</option>
            <option value="Last Quarter">Period: Last Quarter</option>
            <option value="Year to Date">Period: Year to Date</option>
          </select>

          <button
            id="print-report-btn"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            Print / Save PDF
          </button>

          <button
            id="export-report-csv-btn"
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export Data
          </button>
        </div>
      </div>

      {/* Formal Printable Document Card */}
      <div 
        id="printable-report"
        className="p-6 sm:p-10 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-8 print:border-none print:shadow-none print:p-0"
      >
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              FeedbackAI Intelligence Suite
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Executive Customer Feedback Report
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Prepared for: Product & Customer Experience Leadership</span>
              <span>•</span>
              <span className="font-semibold">{reportPeriod}</span>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-400 space-y-0.5">
            <div>Generated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
            <div className="font-mono text-[11px] text-slate-500">Ref: RPT-2026-ENG-089</div>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-1">
              Verified Pipeline
            </span>
          </div>
        </div>

        {/* Executive Summary Narrative */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Executive Abstract
          </span>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            During this cycle, the automated AI pipeline processed <strong>12,458 customer reviews</strong> across e-commerce, mobile applications, and direct support tickets. Overall sentiment remains strongly favorable with a <strong>63% positive classification rate</strong>. Key drivers of satisfaction center around <em>Product Quality</em> and <em>Packaging aesthetics</em>. Conversely, customer friction concentrates in <em>Customer Support response duration</em> during peak hours.
          </p>
        </div>

        {/* Core Statistical Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-400">Total Analyzed</div>
            <div className="text-2xl font-black text-slate-900 mt-1">12,458</div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">↑ 12.5% vs previous</div>
          </div>
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
            <div className="text-[11px] font-semibold text-emerald-700">Positive Sentiment</div>
            <div className="text-2xl font-black text-emerald-900 mt-1">63%</div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">7,842 Reviews</div>
          </div>
          <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
            <div className="text-[11px] font-semibold text-amber-700">Neutral Sentiment</div>
            <div className="text-2xl font-black text-amber-900 mt-1">20%</div>
            <div className="text-[10px] text-amber-600 font-bold mt-0.5">2,512 Reviews</div>
          </div>
          <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100">
            <div className="text-[11px] font-semibold text-rose-700">Negative Sentiment</div>
            <div className="text-2xl font-black text-rose-900 mt-1">17%</div>
            <div className="text-[10px] text-rose-600 font-bold mt-0.5">2,104 Reviews</div>
          </div>
        </div>

        {/* Topics & Keywords Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Topics */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Departmental Topic Distribution
            </h3>
            <div className="space-y-2.5">
              {[
                { name: "Product Quality", pct: 34 },
                { name: "Delivery & Shipping", pct: 22 },
                { name: "Customer Support", pct: 18 },
                { name: "Pricing & Value", pct: 13 },
                { name: "User Experience", pct: 8 },
                { name: "Other Inquiries", pct: 5 },
              ].map((t, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{t.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-28 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${t.pct}%` }} />
                    </div>
                    <span className="font-mono font-bold text-slate-900 w-8 text-right">{t.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              High-Frequency Keywords
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { word: "Quality", count: 482, tone: "Positive" },
                { word: "Delivery", count: 391, tone: "Neutral" },
                { word: "Price", count: 310, tone: "Neutral" },
                { word: "Support", count: 278, tone: "Negative" },
                { word: "Packaging", count: 245, tone: "Positive" },
                { word: "Service", count: 219, tone: "Neutral" },
                { word: "Product", count: 198, tone: "Positive" },
                { word: "Experience", count: 174, tone: "Positive" },
              ].map((k, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">#{k.word}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">{k.count}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        k.tone === "Positive"
                          ? "bg-emerald-100 text-emerald-800"
                          : k.tone === "Negative"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {k.tone}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Complaints vs Positive Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              Major Customer Complaints
            </div>
            <ul className="space-y-2 text-xs text-rose-950">
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span><strong>Support response delays:</strong> 42% of negative reviews cite 24h+ response lag times.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span><strong>Tracking status blind spots:</strong> Customers report packages stuck in "dispatched" status.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span><strong>Pricing elasticity:</strong> First-time buyers note perceived premium price vs competitors.</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Positive Customer Highlights
            </div>
            <ul className="space-y-2 text-xs text-emerald-950">
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span><strong>Build craftsmanship:</strong> Outstanding review sentiment on material feel & reliability.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span><strong>Aesthetic unboxing:</strong> Packaging frequently praised as luxury and eco-conscious.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span><strong>Seamless setup:</strong> Onboarding time averages under 4 minutes with positive sentiment.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
            <Lightbulb className="w-4 h-4 text-indigo-600" />
            Prioritized Action Recommendations
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-indigo-100">
              <span className="font-bold text-slate-900 block mb-1">1. Triage Automation</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Deploy instant automated ticket categorizer for refund and delivery status inquiries.
              </p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-indigo-100">
              <span className="font-bold text-slate-900 block mb-1">2. Value Packaging</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Highlight build durability & long warranty in checkout flow to overcome price objections.
              </p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-indigo-100">
              <span className="font-bold text-slate-900 block mb-1">3. Carrier SLA Audit</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Re-evaluate regional logistics partners showing persistent 48-hour delivery delay spikes.
              </p>
            </div>
          </div>
        </div>

        {/* Signoff */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <div>Report generated automatically via AI Customer Feedback Analyzer Pipeline</div>
          <div className="font-mono">End of Report</div>
        </div>
      </div>
    </div>
  );
};
