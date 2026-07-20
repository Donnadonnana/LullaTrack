// this is dummy for reports once be ready delete this file
import type {
  FeedingDailyReport,
  SleepDailyReport,
  WeeklyReport,
} from "../types/reports";

export const dummySleepReport: SleepDailyReport = {
  totalSleepMinutes: 860,
  totalNapMinutes: 190,
  nightSleepMinutes: 670,
  averageWakeWindowMinutes: 125,
  napCount: 3,
  trend: "up",
};

export const dummyFeedingReport: FeedingDailyReport = {
  feedingType: "breastfeeding",
  feedCount: 7,
  averageFeedMinutes: 18,
  totalFeedMinutes: 126,
  lastFeedTime: "9:20 AM",
  trend: "stable",
};

export const dummyBottleFeedingReport: FeedingDailyReport = {
  feedingType: "bottle",
  feedCount: 6,
  averageFeedMl: 135,
  totalFeedMl: 810,
  lastFeedTime: "9:20 AM",
  trend: "up",
};

export const dummyWeeklyReport: WeeklyReport = {
  averageDailySleepMinutes: 845,
  averageNapMinutes: 192,
  averageWakeWindowMinutes: 122,
  averageFeedsPerDay: 7.4,
  averageFeedMinutes: 17,
  sleepTrend: "up",
  feedingTrend: "stable",
  summary: "Dylan's daytime sleep has become more consistent this week.",
  tip: "His wake windows are averaging about two hours. Continue watching for sleepy cues before the end of each wake window.",
};
