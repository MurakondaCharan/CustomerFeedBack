import React, { useState, useMemo } from "react";
import { FeedbackItem } from "../types";
import { exportFeedbacksToCSV } from "../services/api";
import {
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Tag,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Eye,
  SlidersHorizontal,
  FileSpreadsheet,
} from "lucide-react";

interface Props {
  feedbacks: FeedbackItem[];
  onSelectFeedback: (item: FeedbackItem) => void;
  initialSearchQuery?: string;
}

export const FeedbackTableView: React.FC<Props> = ({
  feedbacks,
  onSelectFeedback,
  initialSearchQuery = "",
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [sentimentFilter, setSentimentFilter] = useState<string>("All");
  const [topicFilter, setTopicFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "confidence">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const topicsList = [
    "All",
    "Product Quality",
    "Delivery",
    "Customer Support",
    "Pricing",
    "User Experience",
    "Performance",
  ];

  // Filter and sort logic
  const filteredFeedbacks = useMemo(() => {
    return feedbacks
      .filter((item) => {
        // Sentiment filter
        if (sentimentFilter !== "All" && item.sentiment !== sentimentFilter) return false;
        // Topic filter
        if (topicFilter !== "All" && !item.topics.includes(topicFilter)) return false;
        // Status filter
        if (statusFilter !== "All" && item.status !== statusFilter) return false;
        // Search term
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchCustomer = item.customerName.toLowerCase().includes(q);
          const matchText = item.feedbackText.toLowerCase().includes(q);
          const matchKeywords = item.keywords.some((k) => k.toLowerCase().includes(q));
          const matchTopics = item.topics.some((t) => t.toLowerCase().includes(q));
          if (!matchCustomer && !matchText && !matchKeywords && !matchTopics) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "confidence") {
          return b.confidence - a.confidence;
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        // default newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [feedbacks, sentimentFilter, topicFilter, statusFilter, searchTerm, sortBy]);

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredFeedbacks.length / itemsPerPage));
  const paginatedFeedbacks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredFeedbacks.slice(start, start + itemsPerPage);
  }, [filteredFeedbacks, currentPage, itemsPerPage]);

  const handleExport = () => {
    exportFeedbacksToCSV(filteredFeedbacks, "customer_feedback_filtered.csv");
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "Positive":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Positive
          </span>
        );
      case "Negative":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3" />
            Negative
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <HelpCircle className="w-3 h-3" />
            Neutral
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Customer Feedback Database
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Query, filter, and inspect structured sentiment telemetry across {feedbacks.length} verified submissions.
          </p>
        </div>

        <button
          id="export-feedback-csv-btn"
          onClick={handleExport}
          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          Export CSV ({filteredFeedbacks.length})
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search feedback text, keywords, or customer..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900"
            />
          </div>

          {/* Sentiment Filter */}
          <div>
            <select
              value={sentimentFilter}
              onChange={(e) => {
                setSentimentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Sentiments</option>
              <option value="Positive">Positive Only</option>
              <option value="Negative">Negative Only</option>
              <option value="Neutral">Neutral Only</option>
            </select>
          </div>

          {/* Topic Filter */}
          <div>
            <select
              value={topicFilter}
              onChange={(e) => {
                setTopicFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              {topicsList.map((t) => (
                <option key={t} value={t}>
                  {t === "All" ? "All Topics" : t}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="confidence">Sort: Highest Confidence</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Tags */}
        <div className="pt-1 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 font-semibold text-[11px]">Quick Filters:</span>
          {(["All", "Positive", "Negative", "Neutral"] as const).map((sent) => (
            <button
              key={sent}
              onClick={() => {
                setSentimentFilter(sent);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                sentimentFilter === sent
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {sent}
            </button>
          ))}
          {(searchTerm || sentimentFilter !== "All" || topicFilter !== "All") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSentimentFilter("All");
                setTopicFilter("All");
                setCurrentPage(1);
              }}
              className="text-[11px] font-semibold text-rose-600 hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6">Customer</th>
                <th className="p-4">Feedback Content</th>
                <th className="p-4">Sentiment</th>
                <th className="p-4">Confidence</th>
                <th className="p-4">Topics</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedFeedbacks.length > 0 ? (
                paginatedFeedbacks.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectFeedback(item)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="p-4 pl-6 font-bold text-slate-900 whitespace-nowrap">
                      {item.customerName}
                    </td>
                    <td className="p-4 max-w-xs sm:max-w-md">
                      <p className="line-clamp-2 text-slate-600 font-normal">
                        "{item.feedbackText}"
                      </p>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {getSentimentBadge(item.sentiment)}
                    </td>
                    <td className="p-4 whitespace-nowrap font-bold text-slate-900">
                      {item.confidence}%
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1 flex-wrap max-w-[200px]">
                        {item.topics.map((t, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700"
                          >
                            <Tag className="w-2.5 h-2.5 text-indigo-400" />
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {item.createdAt}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectFeedback(item);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="View Analysis Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    <p className="text-sm font-semibold text-slate-600">No customer feedback matched your search criteria.</p>
                    <p className="text-xs mt-1">Try relaxing filters or search terms.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <span className="font-bold text-slate-800">{paginatedFeedbacks.length}</span> of{" "}
            <span className="font-bold text-slate-800">{filteredFeedbacks.length}</span> feedback records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-slate-800 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
