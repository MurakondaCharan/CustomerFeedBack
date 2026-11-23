import React, { useState, useRef } from "react";
import { FeedbackItem, AnalysisResponse } from "../types";
import { analyzeSingleFeedback, analyzeBatchFeedbacks, parseCSVText } from "../services/api";
import {
  Zap,
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Tag,
  ArrowRight,
  Database,
  RefreshCw,
  Clock,
  Download,
  Check,
  AlertTriangle,
  Info,
} from "lucide-react";

interface Props {
  onAddFeedback: (feedback: FeedbackItem) => void;
  onAddBatchFeedbacks: (feedbacks: FeedbackItem[]) => void;
  onNavigateToFeedbackTable: () => void;
}

export const AnalyzeFeedbackView: React.FC<Props> = ({
  onAddFeedback,
  onAddBatchFeedbacks,
  onNavigateToFeedbackTable,
}) => {
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");

  // Single feedback state
  const [feedbackText, setFeedbackText] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isAnalyzingSingle, setIsAnalyzingSingle] = useState(false);
  const [singleAnalysisStep, setSingleAnalysisStep] = useState(0);
  const [singleResult, setSingleResult] = useState<AnalysisResponse | null>(null);
  const [singleSaved, setSingleSaved] = useState(false);
  const [singleError, setSingleError] = useState<string | null>(null);

  // Bulk feedback state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvParsedCount, setCsvParsedCount] = useState<number>(0);
  const [bulkProcessingStep, setBulkProcessingStep] = useState<"idle" | "upload" | "processing" | "analyzing" | "complete">("idle");
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkResults, setBulkResults] = useState<FeedbackItem[]>([]);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-configured sample feedback prompts
  const sampleFeedbacks = [
    {
      name: "Rahul",
      text: "Amazing product quality and very fast delivery! The packaging was sturdy and arrived in pristine condition.",
    },
    {
      name: "Priya",
      text: "Customer support took too long to respond. I had to wait over 48 hours just to get a basic update on my return request.",
    },
    {
      name: "David",
      text: "The product is good but the price is slightly high compared to other alternatives in the market.",
    },
    {
      name: "Sarah",
      text: "Very happy with the packaging and overall experience. Unboxing was delightful and setup took less than 5 minutes.",
    },
    {
      name: "Marcus",
      text: "I received the product two days late. The tracking link was never updated after leaving the hub.",
    },
  ];

  const analysisSteps = [
    "Analyzing feedback text...",
    "Understanding sentiment & tone...",
    "Extracting critical keywords...",
    "Detecting domain topics...",
    "Generating actionable insights...",
  ];

  const handleAnalyzeSingle = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!feedbackText.trim()) {
      setSingleError("Please enter customer feedback text before analyzing.");
      return;
    }

    setSingleError(null);
    setIsAnalyzingSingle(true);
    setSingleResult(null);
    setSingleSaved(false);

    // Multi-step intelligent animation
    for (let i = 0; i < analysisSteps.length; i++) {
      setSingleAnalysisStep(i);
      await new Promise((r) => setTimeout(r, 260));
    }

    try {
      const result = await analyzeSingleFeedback(feedbackText.trim(), customerName.trim() || "Verified Customer");
      setSingleResult(result);
    } catch (err: any) {
      setSingleError("We couldn't analyze this feedback. Please try again.");
    } finally {
      setIsAnalyzingSingle(false);
    }
  };

  const handleSaveToDatabase = () => {
    if (!singleResult) return;
    const newItem: FeedbackItem = {
      id: `fb-${Date.now()}`,
      customerName: customerName.trim() || "Anonymous Customer",
      customerEmail: "user@feedback.io",
      feedbackText: feedbackText.trim(),
      sentiment: singleResult.sentiment,
      confidence: singleResult.confidence,
      topics: singleResult.topics,
      keywords: singleResult.keywords,
      summary: singleResult.summary,
      complaintDetected: singleResult.complaintDetected,
      complaintCategory: singleResult.complaintCategory,
      actionRecommendation: singleResult.actionRecommendation,
      createdAt: new Date().toISOString().split("T")[0],
      status: "Analyzed",
      rating: singleResult.sentiment === "Positive" ? 5 : singleResult.sentiment === "Negative" ? 1 : 3,
    };

    onAddFeedback(newItem);
    setSingleSaved(true);
  };

  // Bulk CSV handling
  const handleFileChange = (file: File) => {
    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      setBulkError("Please upload a valid CSV file (.csv format required).");
      return;
    }
    setBulkError(null);
    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const parsed = parseCSVText(content);
      if (parsed.length === 0) {
        setBulkError("No valid rows detected. Please ensure CSV contains customer and feedback columns.");
      } else {
        setCsvParsedCount(parsed.length);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleStartBulkAnalysis = async () => {
    if (!csvFile) return;

    setBulkError(null);
    setBulkProcessingStep("upload");
    setBulkProgress(15);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const parsedRows = parseCSVText(text);

        setBulkProcessingStep("processing");
        setBulkProgress(40);
        await new Promise((r) => setTimeout(r, 400));

        setBulkProcessingStep("analyzing");
        setBulkProgress(75);

        const analyzedFeedbacks = await analyzeBatchFeedbacks(parsedRows);

        setBulkProgress(100);
        setBulkProcessingStep("complete");
        setBulkResults(analyzedFeedbacks);
      } catch (err) {
        setBulkError("Error processing bulk CSV. Please verify formatting.");
        setBulkProcessingStep("idle");
      }
    };
    reader.readAsText(csvFile);
  };

  const handleLoadDemoCSV = () => {
    const demoCsv = `Customer,Feedback
Rahul Sharma,"Amazing product quality and very fast delivery! Packaging was supreme."
Priya Patel,"Customer support took too long to respond. Waited over 48 hours for an exchange."
David Miller,"The product is good but the price is slightly high compared to other brands."
Sarah Jenkins,"Very happy with the packaging and overall experience. Super clean interface."
Marcus Vance,"I received the product two days late. Tracking updates were completely absent."`;

    const blob = new Blob([demoCsv], { type: "text/csv" });
    const file = new File([blob], "demo_customer_feedback.csv", { type: "text/csv" });
    handleFileChange(file);
  };

  const handleCommitBulkToDashboard = () => {
    if (bulkResults.length > 0) {
      onAddBatchFeedbacks(bulkResults);
      onNavigateToFeedbackTable();
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Analyze Feedback
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Process individual reviews or upload bulk datasets through the Gemini & NLP pipeline.
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        <button
          id="tab-analyze-single"
          onClick={() => setActiveTab("single")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === "single"
              ? "bg-white text-indigo-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Zap className="w-4 h-4 text-indigo-600" />
          Option 1: Individual Feedback
        </button>
        <button
          id="tab-analyze-bulk"
          onClick={() => setActiveTab("bulk")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === "bulk"
              ? "bg-white text-indigo-700 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Upload className="w-4 h-4 text-indigo-600" />
          Option 2: Bulk CSV Analysis
        </button>
      </div>

      {/* OPTION 1: INDIVIDUAL FEEDBACK */}
      {activeTab === "single" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form */}
          <div className="lg:col-span-7 p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Single Review Ingestion
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                Analyze Individual Customer Feedback
              </h2>
            </div>

            {/* Quick Sample Presets */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500">Quick Test Samples:</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {sampleFeedbacks.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setFeedbackText(sample.text);
                      setCustomerName(sample.name);
                      setSingleResult(null);
                      setSingleSaved(false);
                      setSingleError(null);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 text-[11px] font-medium text-slate-700 transition-colors truncate max-w-[200px]"
                    title={sample.text}
                  >
                    "{sample.text.slice(0, 26)}..."
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAnalyzeSingle} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Name (Optional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Feedback Text <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="feedback-input-textarea"
                  rows={4}
                  required
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Paste customer feedback here..."
                  className="w-full p-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 leading-relaxed"
                />
              </div>

              {singleError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {singleError}
                </div>
              )}

              <button
                id="analyze-with-ai-btn"
                type="submit"
                disabled={isAnalyzingSingle || !feedbackText.trim()}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAnalyzingSingle ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>{analysisSteps[singleAnalysisStep]}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze with AI</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Result Card */}
          <div className="lg:col-span-5 p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            {isAnalyzingSingle ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {analysisSteps[singleAnalysisStep]}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Extracting semantic layers and natural-language summary
                  </p>
                </div>
                <div className="w-48 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${((singleAnalysisStep + 1) / analysisSteps.length) * 100}%` }}
                  />
                </div>
              </div>
            ) : singleResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    AI Analysis Result
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {singleResult.source || "NLP Model"}
                  </span>
                </div>

                {/* Sentiment & Confidence */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Sentiment</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-sm font-black px-2.5 py-0.5 rounded-md ${
                          singleResult.sentiment === "Positive"
                            ? "bg-emerald-100 text-emerald-800"
                            : singleResult.sentiment === "Negative"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {singleResult.sentiment}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Confidence</span>
                    <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                      {singleResult.confidence}%
                    </div>
                  </div>
                </div>

                {/* Detected Topics */}
                <div>
                  <span className="text-xs font-bold text-slate-600 block mb-1.5">
                    Detected Topics
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {singleResult.topics.map((t, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3 text-indigo-500" />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <span className="text-xs font-bold text-slate-600 block mb-1.5">
                    Important Keywords
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {singleResult.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Summary */}
                <div className="p-3.5 bg-gradient-to-br from-indigo-50/70 to-purple-50/40 rounded-xl border border-indigo-100">
                  <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    AI Summary
                  </div>
                  <p className="text-xs text-slate-700 mt-1.5 leading-relaxed italic">
                    "{singleResult.summary}"
                  </p>

                  {singleResult.actionRecommendation && (
                    <div className="mt-2.5 pt-2 border-t border-indigo-100/70 text-xs">
                      <span className="font-bold text-indigo-950">Recommended Action: </span>
                      <span className="text-slate-600">{singleResult.actionRecommendation}</span>
                    </div>
                  )}
                </div>

                {/* Commit Button */}
                <div className="pt-2">
                  <button
                    id="save-to-database-btn"
                    onClick={handleSaveToDatabase}
                    disabled={singleSaved}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      singleSaved
                        ? "bg-emerald-600 text-white cursor-default"
                        : "bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
                    }`}
                  >
                    {singleSaved ? (
                      <>
                        <Check className="w-4 h-4" />
                        Added to Feedback Database
                      </>
                    ) : (
                      <>
                        <Database className="w-4 h-4" />
                        Save to Feedback Database
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-700">Awaiting Feedback Input</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Type or paste review text on the left and click "Analyze with AI" to generate real-time NLP telemetry.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OPTION 2: BULK CSV ANALYSIS */}
      {activeTab === "bulk" && (
        <div className="space-y-6">
          {/* Visual Pipeline Bar */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
              Batch Pipeline Flow
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[
                { label: "Upload CSV", status: csvFile ? "done" : "current", icon: Upload },
                { label: "Processing", status: bulkProgress >= 40 ? "done" : bulkProgress > 0 ? "current" : "pending", icon: RefreshCw },
                { label: "AI Analysis", status: bulkProgress >= 75 ? "done" : "pending", icon: Sparkles },
                { label: "Results & Ingestion", status: bulkProcessingStep === "complete" ? "done" : "pending", icon: Database },
              ].map((step, idx) => {
                const Icon = step.icon;
                const isDone = step.status === "done";
                const isCurrent = step.status === "current";
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                      isDone
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : isCurrent
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200 ring-2 ring-indigo-500/20"
                        : "bg-slate-50 text-slate-400 border-slate-200"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isCurrent ? "animate-spin" : ""}`} />
                    <span>{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Drag and Drop Box */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="p-8 sm:p-12 bg-white rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-400 transition-colors text-center space-y-4 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />

            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
              <Upload className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                {csvFile ? csvFile.name : "Drag and drop your CSV file here, or browse"}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Supports standard comma-separated reviews with "Customer" and "Feedback" columns.
              </p>
            </div>

            {csvFile && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{csvParsedCount} reviews ready for bulk AI analysis</span>
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLoadDemoCSV();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
              >
                Load Pre-Configured Demo CSV (5 Reviews)
              </button>
            </div>
          </div>

          {bulkError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {bulkError}
            </div>
          )}

          {/* Action and Progress */}
          {csvFile && bulkProcessingStep !== "complete" && (
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Progress</span>
                <span>{bulkProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${bulkProgress}%` }}
                />
              </div>
              <button
                id="start-bulk-analysis-btn"
                onClick={handleStartBulkAnalysis}
                disabled={bulkProgress > 0 && bulkProgress < 100}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Start Bulk AI & NLP Analysis ({csvParsedCount} items)
              </button>
            </div>
          )}

          {/* Results Table */}
          {bulkResults.length > 0 && (
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Bulk Processing Complete ({bulkResults.length} Analyzed)
                  </h3>
                  <p className="text-xs text-slate-500">
                    All reviews categorized with sentiment, confidence, and topic tagging.
                  </p>
                </div>
                <button
                  id="import-bulk-to-dashboard-btn"
                  onClick={handleCommitBulkToDashboard}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
                >
                  <Database className="w-4 h-4" />
                  Import All to Main Dashboard
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Feedback</th>
                      <th className="p-3">Sentiment</th>
                      <th className="p-3">Confidence</th>
                      <th className="p-3">Detected Topics</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {bulkResults.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="p-3 font-semibold text-slate-900">{item.customerName}</td>
                        <td className="p-3 max-w-xs truncate">"{item.feedbackText}"</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.sentiment === "Positive"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : item.sentiment === "Negative"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {item.sentiment}
                          </span>
                        </td>
                        <td className="p-3 font-bold">{item.confidence}%</td>
                        <td className="p-3">
                          <div className="flex gap-1 flex-wrap">
                            {item.topics.map((t, i) => (
                              <span key={i} className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
