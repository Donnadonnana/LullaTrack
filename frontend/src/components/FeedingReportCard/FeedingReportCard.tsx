import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";

import ReportCard from "../ReportCard/ReportCard";
import ReportMetric from "../ReportCard/ReportMetric";

import type { FeedingDailyReport } from "../../types/reports";

import { formatFeedCount, formatMinutes } from "../../utils/reports";

type FeedingReportCardProps = {
  report: FeedingDailyReport;
  title?: string;
};

export default function FeedingReportCard({
  report,
  title = "Feeding today",
}: FeedingReportCardProps) {
  if (report.feedingType === "breastfeeding") {
    return (
      <ReportCard
        title={title}
        icon={<RestaurantOutlinedIcon />}
        primaryValue={formatFeedCount(report.feedCount)}
        primaryLabel="Breastfeeding sessions"
        trend={report.trend}
      >
        <ReportMetric
          label="Average feed"
          value={formatMinutes(report.averageFeedMinutes)}
        />

        <ReportMetric
          label="Total feeding time"
          value={formatMinutes(report.totalFeedMinutes)}
        />

        <ReportMetric label="Last feed" value={report.lastFeedTime} />
      </ReportCard>
    );
  }

  return (
    <ReportCard
      title={title}
      icon={<RestaurantOutlinedIcon />}
      primaryValue={`${report.totalFeedMl} ml`}
      primaryLabel="Total bottle intake"
      trend={report.trend}
    >
      <ReportMetric
        label="Number of feeds"
        value={formatFeedCount(report.feedCount)}
      />

      <ReportMetric
        label="Average bottle"
        value={`${report.averageFeedMl} ml`}
      />

      <ReportMetric label="Last feed" value={report.lastFeedTime} />
    </ReportCard>
  );
}
