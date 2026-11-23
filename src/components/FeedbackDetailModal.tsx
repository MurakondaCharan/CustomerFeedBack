import React from "react";
import { FeedbackItem } from "../types";
import { X, CheckCircle2, AlertCircle, HelpCircle, Tag, Sparkles, ArrowRight, Star, Calendar, User } from "lucide-react";

interface Props {
  feedback: FeedbackItem | null;
  allFeedbacks: FeedbackItem[];
  onClose: () => void;
  onSelectFeedback: (item: FeedbackItem) => void;
}

export const FeedbackDetailModal: React.FC<Props> = ({
  feedback,
  allFeedbacks,
  onClose,
  onSelectFeedback,
}) => {
  if (!feedback) return null;

  // Find related feedback sharing same topics or sentiment
  const related = allFeedbacks
    .filter((f) => f.id !== feedback.id && f.topics.some((t) => feedback.topics.includes(t)))
    .slice(0, 3);

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "Positive":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Positive
          </span>
        );
      case "Negative":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" />
            Negative
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <HelpCircle className="w-3.5 h-3.5" />
            Neutral
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="feedback-detail-modal"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {feedback.customerName.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{feedback.customerName}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {feedback.createdAt}
                </span>
                <span>•</span>
                <span className="text-slate-600 font-medium">{feedback.customerEmail || "customer@verified.io"}</span>
              </div>
            </div>
          </div>
          <button
            id="modal-close-button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Original Feedback */}
        <div className="mt-6">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Original Feedback</label>
          <div className="mt-2 p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 text-sm leading-relaxed italic">
            "{feedback.feedbackText}"
          </div>
        </div>

        {/* Sentiment Analysis Scorecard */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-xs">
            <span className="text-xs text-slate-400 font-medium">Sentiment Classification</span>
            <div className="mt-2 flex items-center gap-3">
              {getSentimentBadge(feedback.sentiment)}
              <span className="text-sm font-semibold text-slate-700">
                {feedback.confidence}% Confidence
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  feedback.sentiment === "Positive"
                    ? "bg-emerald-500"
                    : feedback.sentiment === "Negative"
                    ? "bg-rose-500"
                    : "bg-amber-500"
                }`}
                style={{ width: `${feedback.confidence}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-xs">
            <span className="text-xs text-slate-400 font-medium">Status & Rating</span>
            <div className="mt-2 flex items-center justify-between">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {feedback.status}
              </span>
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < (feedback.rating || 4) ? "fill-amber-400 text-amber-400" : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Topics & Keywords */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Detected Topics</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {feedback.topics.map((topic, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
                >
                  <Tag className="w-3 h-3 text-indigo-500" />
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Extracted Keywords</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {feedback.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI Explanation & Recommendation */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-indigo-50/70 to-purple-50/40 border border-indigo-100/80">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-900">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            AI Explanation & Summary
          </div>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed font-normal">
            {feedback.summary}
          </p>

          {feedback.actionRecommendation && (
            <div className="mt-3 pt-3 border-t border-indigo-100/60">
              <span className="text-xs font-bold text-indigo-950">Recommended Action:</span>
              <p className="text-xs text-slate-600 mt-1">
                {feedback.actionRecommendation}
              </p>
            </div>
          )}
        </div>

        {/* Related Feedback */}
        {related.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Related Customer Feedback</label>
            <div className="mt-3 space-y-2">
              {related.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectFeedback(item)}
                  className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
                >
                  <div className="truncate pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-800">{item.customerName}</span>
                      <span className="text-[10px] text-slate-400">({item.sentiment})</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">"{item.feedbackText}"</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
