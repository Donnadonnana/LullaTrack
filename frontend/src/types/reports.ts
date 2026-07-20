export type TrendDirection =
  | "up"
  | "down"
  | "stable";

export type SleepDailyReport = {
  totalSleepMinutes: number;
  totalNapMinutes: number;
  nightSleepMinutes: number;
  averageWakeWindowMinutes: number;
  napCount: number;
  trend?: TrendDirection;
};

export type BreastfeedingDailyReport = {
  feedingType: "breastfeeding";
  feedCount: number;
  averageFeedMinutes: number;
  totalFeedMinutes: number;
  lastFeedTime: string;
  trend?: TrendDirection;
};

export type BottleFeedingDailyReport = {
  feedingType: "bottle";
  feedCount: number;
  averageFeedMl: number;
  totalFeedMl: number;
  lastFeedTime: string;
  trend?: TrendDirection;
};

export type FeedingDailyReport =
  | BreastfeedingDailyReport
  | BottleFeedingDailyReport;

export type WeeklyReport = {
  averageDailySleepMinutes: number;
  averageNapMinutes: number;
  averageWakeWindowMinutes: number;
  averageFeedsPerDay: number;
  averageFeedMinutes?: number;
  averageFeedMl?: number;
  sleepTrend: TrendDirection;
  feedingTrend: TrendDirection;
  summary: string;
  tip: string;
};