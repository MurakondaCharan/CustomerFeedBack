export type SentimentType = "Positive" | "Negative" | "Neutral";

export interface FeedbackItem {
  id: string;
  customerName: string;
  customerEmail?: string;
  feedbackText: string;
  sentiment: SentimentType;
  confidence: number;
  topics: string[];
  keywords: string[];
  summary: string;
  complaintDetected?: boolean;
  complaintCategory?: string | null;
  actionRecommendation?: string;
  createdAt: string;
  status: "Analyzed" | "Pending" | "Flagged";
  rating?: number;
}

export interface AnalysisResponse {
  sentiment: SentimentType;
  confidence: number;
  topics: string[];
  keywords: string[];
  summary: string;
  complaintDetected: boolean;
  complaintCategory: string | null;
  actionRecommendation: string;
  source?: string;
}

export interface InsightItem {
  id: string;
  title: string;
  impact: "High" | "Medium" | "Low";
  relatedSentiment: SentimentType;
  trend: string;
  recommendation: string;
  topic: string;
  category?: string;
  description?: string;
  metric?: string;
}

export interface TopicStat {
  name: string;
  count: number;
  percentage: number;
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export interface KeywordStat {
  keyword: string;
  count: number;
  sentiment: SentimentType;
}

export interface KPISummary {
  total: number;
  totalChange: string;
  positive: number;
  positivePercent: number;
  positiveChange: string;
  negative: number;
  negativePercent: number;
  negativeChange: string;
  neutral: number;
  neutralPercent: number;
  neutralChange: string;
  csatScore: number;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  company: string;
  avatarUrl?: string;
}
